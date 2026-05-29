package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.*;
import cswebapp.hospitalz.dto.PaymentRequest;
import cswebapp.hospitalz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private TreatmentRecordRepository treatmentRecordRepository;

    @Autowired
    private DoctorPatientRepository doctorPatientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillPdfService billPdfService;

    // ── GENERATE BILL ──────────────────────────────────────────────────────
    @Transactional
    public Bill generateBill(Long admissionId) {

        // 1. Find the admission
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found: " + admissionId));

        // 2. Bill can only be generated after discharge (business rule 4.6)
        if (admission.getStatus() == AdmissionStatus.ACTIVE) {
            throw new RuntimeException("Patient must be discharged before generating a bill.");
        }

        // 3. Prevent duplicate bills (business rule 4.6)
        if (billRepository.findByAdmission_AdmissionId(admissionId).isPresent()) {
            throw new RuntimeException("Bill already exists for admission: " + admissionId);
        }

        Patient patient = admission.getPatient();
        String patientId = patient.getPatientId();

        // 4. Calculate room charges = daily_rate × total_days
        BigDecimal roomCharges = admission.getRoom().getDailyRate()
                .multiply(BigDecimal.valueOf(admission.getTotalDays()));

        // 5. Calculate treatment charges — uses the snapshot cost, not current price
        LocalDateTime start = admission.getAdmissionDate();
        LocalDateTime end = admission.getDischargeDate() != null ? admission.getDischargeDate() : LocalDateTime.now();
        BigDecimal treatmentCharges = treatmentRecordRepository
                .sumTreatmentCostByPatientAndDateRange(patientId, start.minusSeconds(1), end.plusSeconds(1));
        if (treatmentCharges == null) {
            treatmentCharges = BigDecimal.ZERO;
        }

        // 6. Calculate doctor charges — sum consultation fees of all assigned doctors
        List<DoctorPatient> assignments = doctorPatientRepository
                .findByPatient_PatientId(patientId);
        BigDecimal doctorCharges = assignments.stream()
                .map(dp -> dp.getDoctor().getConsultationFee())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 6.5 Calculate outpatient appointment charges
        List<Appointment> completedAppointments = appointmentRepository
                .findByPatient_PatientIdAndStatusAndIsBilled(patientId, AppointmentStatus.COMPLETED, false);
        BigDecimal outpatientCharges = completedAppointments.stream()
                .map(app -> app.getDoctor().getConsultationFee())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 7. Calculate total:
        // subtotal = room + treatment + doctor + outpatient + other
        // discountedSubtotal = subtotal - (subtotal * discount / 100)
        // total = discountedSubtotal + (discountedSubtotal * tax / 100)
        BigDecimal otherCharges = BigDecimal.ZERO;
        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal taxPercent = BigDecimal.valueOf(10); // 10%

        BigDecimal subtotal = roomCharges.add(treatmentCharges).add(doctorCharges).add(outpatientCharges).add(otherCharges);
        BigDecimal discountFactor = BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        BigDecimal afterDiscount = subtotal.multiply(discountFactor);
        BigDecimal taxFactor = BigDecimal.ONE.add(taxPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        BigDecimal totalAmount = afterDiscount.multiply(taxFactor);

        // 8. Build and save bill
        Bill bill = new Bill();
        bill.setAdmission(admission);
        bill.setPatient(patient);
        bill.setRoomCharges(roomCharges);
        bill.setTreatmentCharges(treatmentCharges);
        bill.setDoctorCharges(doctorCharges);
        bill.setOutpatientCharges(outpatientCharges);
        bill.setOtherCharges(otherCharges);
        bill.setDiscount(discount);
        bill.setTaxPercent(taxPercent);
        bill.setTotalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP)); // round to 2 decimals
        bill.setPaymentStatus(PaymentStatus.PENDING);
        bill.setPaidAmount(BigDecimal.ZERO);
        bill.setGeneratedAt(LocalDateTime.now());

        // Mark completed appointments as billed
        completedAppointments.forEach(app -> app.setIsBilled(true));
        appointmentRepository.saveAll(completedAppointments);

        return billRepository.save(bill);
    }

    // ── GENERATE OUTPATIENT BILL ───────────────────────────────────────────
    @Transactional
    public Bill generateOutpatientBill(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentId));

        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Appointment must be COMPLETED before generating a bill.");
        }

        if (billRepository.findByAppointment_Id(appointmentId).isPresent()) {
            throw new RuntimeException("Bill already exists for this appointment: " + appointmentId);
        }

        Patient patient = appointment.getPatient();
        BigDecimal roomCharges = BigDecimal.ZERO;
        
        java.time.LocalDateTime start = appointment.getAppointmentDate().toLocalDate().atStartOfDay();
        java.time.LocalDateTime end = appointment.getAppointmentDate().toLocalDate().atTime(23, 59, 59);
        BigDecimal treatmentCharges = treatmentRecordRepository
                .sumTreatmentCostByPatientAndDateRange(patient.getPatientId(), start, end);
        if (treatmentCharges == null) {
            treatmentCharges = BigDecimal.ZERO;
        }
        
        BigDecimal doctorCharges = BigDecimal.ZERO;
        BigDecimal outpatientCharges = appointment.getDoctor().getConsultationFee();

        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal taxPercent = BigDecimal.valueOf(10);
        BigDecimal subtotal = outpatientCharges.add(treatmentCharges);
        BigDecimal discountFactor = BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        BigDecimal afterDiscount = subtotal.multiply(discountFactor);
        BigDecimal taxFactor = BigDecimal.ONE.add(taxPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        BigDecimal totalAmount = afterDiscount.multiply(taxFactor);

        Bill bill = new Bill();
        bill.setAppointment(appointment);
        bill.setPatient(patient);
        bill.setRoomCharges(roomCharges);
        bill.setTreatmentCharges(treatmentCharges);
        bill.setDoctorCharges(doctorCharges);
        bill.setOutpatientCharges(outpatientCharges);
        bill.setDiscount(discount);
        bill.setTaxPercent(taxPercent);
        bill.setTotalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP));
        bill.setPaymentStatus(PaymentStatus.PENDING);
        bill.setPaidAmount(BigDecimal.ZERO);
        bill.setGeneratedAt(LocalDateTime.now());

        appointment.setIsBilled(true);
        appointmentRepository.save(appointment);

        return billRepository.save(bill);
    }

    // ── RECORD PAYMENT ─────────────────────────────────────────────────────
    @Transactional
    public Bill recordPayment(Long billId, PaymentRequest request) {

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));

        // Can't pay an already fully paid bill
        if (bill.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Bill " + billId + " is already fully paid.");
        }

        // Validate payment amount is positive
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive.");
        }

        BigDecimal newPaidAmount = bill.getPaidAmount().add(request.getAmount());

        // Cap paid amount at total — can't overpay
        newPaidAmount = newPaidAmount.min(bill.getTotalAmount());
        bill.setPaidAmount(newPaidAmount.setScale(2, RoundingMode.HALF_UP));

        // Update payment status: pending → partial → paid
        if (bill.getPaidAmount().compareTo(bill.getTotalAmount()) >= 0) {
            bill.setPaymentStatus(PaymentStatus.PAID);
        } else {
            bill.setPaymentStatus(PaymentStatus.PARTIAL);
        }

        return billRepository.save(bill);
    }

    // ── APPLY DISCOUNT ─────────────────────────────────────────────────────
    // Admin only — recalculates total after discount
    @Transactional
    public Bill applyDiscount(Long billId, BigDecimal discountPercent) {

        if (discountPercent.compareTo(BigDecimal.ZERO) < 0 || discountPercent.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new RuntimeException("Discount must be between 0 and 100.");
        }

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));

        if (bill.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Cannot apply discount to a paid bill.");
        }

        // Recalculate total with new discount
        BigDecimal subtotal = bill.getRoomCharges().add(bill.getTreatmentCharges())
                .add(bill.getDoctorCharges()).add(bill.getOutpatientCharges()).add(bill.getOtherCharges());
        BigDecimal discountFactor = BigDecimal.ONE.subtract(discountPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        BigDecimal afterDiscount = subtotal.multiply(discountFactor);
        BigDecimal taxFactor = BigDecimal.ONE.add(bill.getTaxPercent().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        BigDecimal newTotal = afterDiscount.multiply(taxFactor);

        bill.setDiscount(discountPercent);
        bill.setTotalAmount(newTotal.setScale(2, RoundingMode.HALF_UP));

        return billRepository.save(bill);
    }

    // ── QUERIES ────────────────────────────────────────────────────────────
    public Bill getBillById(Long billId) {
        return billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));
    }

    public Bill getBillByAdmission(Long admissionId) {
        return billRepository.findByAdmission_AdmissionId(admissionId)
                .orElseThrow(() -> new RuntimeException("No bill for admission: " + admissionId));
    }

    public List<Bill> getBillsByPatient(String patientId) {
        return billRepository.findByPatient_PatientId(patientId);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    // ── EXPORT BILL TO PDF ──────────────────────────────────────────────────
    public byte[] generateBillPdf(Long billId) {
        return billPdfService.generateBillPdf(billId);
    }
}