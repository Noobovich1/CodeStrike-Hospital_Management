package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.*;
import cswebapp.hospitalz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        double roomCharges = admission.getRoom().getDailyRate() * admission.getTotalDays();

        // 5. Calculate treatment charges — uses the snapshot cost, not current price
        double treatmentCharges = treatmentRecordRepository
                .sumTreatmentCostByPatient(patientId);

        // 6. Calculate doctor charges — sum consultation fees of all assigned doctors
        List<DoctorPatient> assignments = doctorPatientRepository
                .findByPatient_PatientId(patientId);
        double doctorCharges = assignments.stream()
                .mapToDouble(dp -> dp.getDoctor().getConsultationFee())
                .sum();

        // 7. Calculate total:
        // subtotal = room + treatment + doctor + other
        // discountedSubtotal = subtotal - (subtotal * discount / 100)
        // total = discountedSubtotal + (discountedSubtotal * tax / 100)
        double otherCharges = 0.0;
        double discount = 0.0;
        double taxPercent = 10.0;

        double subtotal = roomCharges + treatmentCharges + doctorCharges + otherCharges;
        double afterDiscount = subtotal - (subtotal * discount / 100);
        double totalAmount = afterDiscount + (afterDiscount * taxPercent / 100);

        // 8. Build and save bill
        Bill bill = new Bill();
        bill.setAdmission(admission);
        bill.setPatient(patient);
        bill.setRoomCharges(roomCharges);
        bill.setTreatmentCharges(treatmentCharges);
        bill.setDoctorCharges(doctorCharges);
        bill.setOtherCharges(otherCharges);
        bill.setDiscount(discount);
        bill.setTaxPercent(taxPercent);
        bill.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0); // round to 2 decimals
        bill.setPaymentStatus(PaymentStatus.PENDING);
        bill.setPaidAmount(0.0);
        bill.setGeneratedAt(LocalDateTime.now());

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

        double newPaidAmount = bill.getPaidAmount() + request.getAmount();

        // Cap paid amount at total — can't overpay
        newPaidAmount = Math.min(newPaidAmount, bill.getTotalAmount());
        bill.setPaidAmount(Math.round(newPaidAmount * 100.0) / 100.0);

        // Update payment status: pending → partial → paid
        if (bill.getPaidAmount() >= bill.getTotalAmount()) {
            bill.setPaymentStatus(PaymentStatus.PAID);
        } else {
            bill.setPaymentStatus(PaymentStatus.PARTIAL);
        }

        return billRepository.save(bill);
    }

    // ── APPLY DISCOUNT ─────────────────────────────────────────────────────
    // Admin only — recalculates total after discount
    @Transactional
    public Bill applyDiscount(Long billId, Double discountPercent) {

        if (discountPercent < 0 || discountPercent > 100) {
            throw new RuntimeException("Discount must be between 0 and 100.");
        }

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));

        if (bill.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Cannot apply discount to a paid bill.");
        }

        // Recalculate total with new discount
        double subtotal = bill.getRoomCharges() + bill.getTreatmentCharges()
                + bill.getDoctorCharges() + bill.getOtherCharges();
        double afterDiscount = subtotal - (subtotal * discountPercent / 100);
        double newTotal = afterDiscount + (afterDiscount * bill.getTaxPercent() / 100);

        bill.setDiscount(discountPercent);
        bill.setTotalAmount(Math.round(newTotal * 100.0) / 100.0);

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
}