package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.*;
import cswebapp.hospitalz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.ByteArrayOutputStream;
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
        LocalDateTime start = admission.getAdmissionDate();
        LocalDateTime end = admission.getDischargeDate() != null ? admission.getDischargeDate() : LocalDateTime.now();
        double treatmentCharges = treatmentRecordRepository
                .sumTreatmentCostByPatientAndDateRange(patientId, start.minusSeconds(1), end.plusSeconds(1));

        // 6. Calculate doctor charges — sum consultation fees of all assigned doctors
        List<DoctorPatient> assignments = doctorPatientRepository
                .findByPatient_PatientId(patientId);
        double doctorCharges = assignments.stream()
                .mapToDouble(dp -> dp.getDoctor().getConsultationFee())
                .sum();

        // 6.5 Calculate outpatient appointment charges
        List<Appointment> completedAppointments = appointmentRepository
                .findByPatient_PatientIdAndStatusAndIsBilled(patientId, AppointmentStatus.COMPLETED, false);
        double outpatientCharges = completedAppointments.stream()
                .mapToDouble(app -> app.getDoctor().getConsultationFee())
                .sum();

        // 7. Calculate total:
        // subtotal = room + treatment + doctor + outpatient + other
        // discountedSubtotal = subtotal - (subtotal * discount / 100)
        // total = discountedSubtotal + (discountedSubtotal * tax / 100)
        double otherCharges = 0.0;
        double discount = 0.0;
        double taxPercent = 10.0;

        double subtotal = roomCharges + treatmentCharges + doctorCharges + outpatientCharges + otherCharges;
        double afterDiscount = subtotal - (subtotal * discount / 100);
        double totalAmount = afterDiscount + (afterDiscount * taxPercent / 100);

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
        bill.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0); // round to 2 decimals
        bill.setPaymentStatus(PaymentStatus.PENDING);
        bill.setPaidAmount(0.0);
        bill.setGeneratedAt(LocalDateTime.now());

        // Mark completed appointments as billed
        completedAppointments.forEach(app -> app.setIsBilled(true));
        appointmentRepository.saveAll(completedAppointments);

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
                + bill.getDoctorCharges() + bill.getOutpatientCharges() + bill.getOtherCharges();
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
    // ── EXPORT BILL TO PDF ──────────────────────────────────────────────────
    public byte[] generateBillPdf(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));

        Admission admission = bill.getAdmission();
        Patient patient = bill.getPatient();

        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Brand Colors (Matches Web UI)
            BaseColor primaryColor = new BaseColor(14, 165, 233); // #0ea5e9
            BaseColor darkColor = new BaseColor(30, 41, 59); // #1e293b
            BaseColor greyColor = new BaseColor(100, 116, 139); // #64748b
            BaseColor lightBgColor = new BaseColor(248, 250, 252); // #f8fafc
            BaseColor borderColor = new BaseColor(226, 232, 240); // #e2e8f0

            // Fonts
            BaseFont baseFontUnicode;
            try {
                baseFontUnicode = BaseFont.createFont("C:/Windows/Fonts/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            } catch (Exception e) {
                baseFontUnicode = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            }
            Font titleFont = new Font(baseFontUnicode, 22, Font.BOLD, primaryColor);
            Font sectionHeaderFont = new Font(baseFontUnicode, 11, Font.BOLD, darkColor);
            Font subTitleFont = new Font(baseFontUnicode, 10, Font.NORMAL, greyColor);
            Font boldFont = new Font(baseFontUnicode, 9, Font.BOLD, darkColor);
            Font normalFont = new Font(baseFontUnicode, 9, Font.NORMAL, darkColor);
            Font tableHeaderFont = new Font(baseFontUnicode, 9, Font.BOLD, BaseColor.WHITE);

            // 1. Hospital Header
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60, 40});

            PdfPCell hospitalCell = new PdfPCell();
            hospitalCell.setBorder(Rectangle.NO_BORDER);
            hospitalCell.addElement(new Paragraph("HOSPITALZ CLINIC", titleFont));
            hospitalCell.addElement(new Paragraph("123 Health Ave, District 1, HCMC, Vietnam", subTitleFont));
            hospitalCell.addElement(new Paragraph("Phone: (+84) 900 000 000 | Email: contact@hospitalz.com", subTitleFont));
            headerTable.addCell(hospitalCell);

            PdfPCell invoiceMetaCell = new PdfPCell();
            invoiceMetaCell.setBorder(Rectangle.NO_BORDER);
            invoiceMetaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            
            Paragraph invTitle = new Paragraph("INVOICE / BILL", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, darkColor));
            invTitle.setAlignment(Element.ALIGN_RIGHT);
            invoiceMetaCell.addElement(invTitle);
            
            Paragraph billIdPara = new Paragraph("Invoice ID: #" + bill.getBillId(), boldFont);
            billIdPara.setAlignment(Element.ALIGN_RIGHT);
            invoiceMetaCell.addElement(billIdPara);
            
            Paragraph datePara = new Paragraph("Date: " + (bill.getGeneratedAt() != null ? bill.getGeneratedAt().toLocalDate().toString() : ""), normalFont);
            datePara.setAlignment(Element.ALIGN_RIGHT);
            invoiceMetaCell.addElement(datePara);

            Paragraph statusPara = new Paragraph("Status: " + bill.getPaymentStatus().name(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, 
                bill.getPaymentStatus() == PaymentStatus.PAID ? new BaseColor(16, 185, 129) : new BaseColor(245, 158, 11)));
            statusPara.setAlignment(Element.ALIGN_RIGHT);
            invoiceMetaCell.addElement(statusPara);

            headerTable.addCell(invoiceMetaCell);
            document.add(headerTable);

            // Spacing
            document.add(new Paragraph("\n"));

            // Horizontal Line
            PdfPTable divider = new PdfPTable(1);
            divider.setWidthPercentage(100);
            PdfPCell dCell = new PdfPCell();
            dCell.setBorderWidthBottom(1f);
            dCell.setBorderColorBottom(borderColor);
            dCell.setBorder(Rectangle.NO_BORDER);
            divider.addCell(dCell);
            document.add(divider);

            document.add(new Paragraph("\n"));

            // 2. Billing & Encounter Info
            PdfPTable billToStayTable = new PdfPTable(2);
            billToStayTable.setWidthPercentage(100);
            billToStayTable.setWidths(new float[]{50, 50});

            PdfPCell patientCell = new PdfPCell();
            patientCell.setBorder(Rectangle.NO_BORDER);
            patientCell.addElement(new Paragraph("PATIENT DETAILS", sectionHeaderFont));
            patientCell.addElement(new Paragraph("Name: " + patient.getFullName(), boldFont));
            patientCell.addElement(new Paragraph("Patient ID: " + patient.getPatientId(), normalFont));
            patientCell.addElement(new Paragraph("Gender: " + patient.getGender().name(), normalFont));
            patientCell.addElement(new Paragraph("Phone: " + patient.getPhoneNumber(), normalFont));
            patientCell.addElement(new Paragraph("Address: " + (patient.getAddress() != null ? patient.getAddress() : "-"), normalFont));
            billToStayTable.addCell(patientCell);

            PdfPCell stayCell = new PdfPCell();
            stayCell.setBorder(Rectangle.NO_BORDER);
            stayCell.addElement(new Paragraph("STAY / ENCOUNTER DETAILS", sectionHeaderFont));
            stayCell.addElement(new Paragraph("Admission ID: " + admission.getAdmissionId(), boldFont));
            stayCell.addElement(new Paragraph("Room: " + admission.getRoom().getRoomNumber() + " (" + admission.getRoom().getRoomType().name() + ")", normalFont));
            stayCell.addElement(new Paragraph("Admitted: " + admission.getAdmissionDate().toLocalDate().toString(), normalFont));
            stayCell.addElement(new Paragraph("Discharged: " + (admission.getDischargeDate() != null ? admission.getDischargeDate().toLocalDate().toString() : "-"), normalFont));
            stayCell.addElement(new Paragraph("Length of Stay: " + admission.getTotalDays() + " Day(s)", normalFont));
            billToStayTable.addCell(stayCell);

            document.add(billToStayTable);

            document.add(new Paragraph("\n"));

            // 3. Itemized Billing Table
            PdfPTable itemTable = new PdfPTable(4);
            itemTable.setWidthPercentage(100);
            itemTable.setWidths(new float[]{50, 15, 15, 20});

            String[] headers = {"Description", "Rate", "Qty/Duration", "Amount"};
            for (String header : headers) {
                PdfPCell h = new PdfPCell(new Phrase(header, tableHeaderFont));
                h.setBackgroundColor(primaryColor);
                h.setBorderColor(borderColor);
                h.setPadding(8);
                if (!header.equals("Description")) {
                    h.setHorizontalAlignment(Element.ALIGN_RIGHT);
                }
                itemTable.addCell(h);
            }

            boolean alternatingRow = false;

            // 3.1 Room Stay Cost
            PdfPCell descCell = new PdfPCell(new Phrase("Room Stay: Room " + admission.getRoom().getRoomNumber() + " (" + admission.getRoom().getRoomType().name() + ")", normalFont));
            PdfPCell rateCell = new PdfPCell(new Phrase("$" + String.format("%.2f", admission.getRoom().getDailyRate()), normalFont));
            PdfPCell qtyCell = new PdfPCell(new Phrase(admission.getTotalDays() + " day(s)", normalFont));
            PdfPCell amtCell = new PdfPCell(new Phrase("$" + String.format("%.2f", bill.getRoomCharges()), normalFont));

            styleRowCells(descCell, rateCell, qtyCell, amtCell, lightBgColor, borderColor, alternatingRow);
            itemTable.addCell(descCell);
            itemTable.addCell(rateCell);
            itemTable.addCell(qtyCell);
            itemTable.addCell(amtCell);
            alternatingRow = !alternatingRow;

            // 3.2 Treatments and Prescriptions performed during admission
            List<TreatmentRecord> treatmentRecords = treatmentRecordRepository.findByPatient_PatientId(patient.getPatientId());
            LocalDateTime start = admission.getAdmissionDate();
            LocalDateTime end = admission.getDischargeDate() != null ? admission.getDischargeDate() : LocalDateTime.now();

            for (TreatmentRecord tr : treatmentRecords) {
                if (tr.getSessionDate().isAfter(start.minusMinutes(1)) && tr.getSessionDate().isBefore(end.plusMinutes(1))) {
                    descCell = new PdfPCell(new Phrase(tr.getTreatment().getName() + " (Dr. " + tr.getDoctor().getFullName() + ")", normalFont));
                    rateCell = new PdfPCell(new Phrase("$" + String.format("%.2f", tr.getUnitCostSnapshot()), normalFont));
                    qtyCell = new PdfPCell(new Phrase(String.valueOf(tr.getQuantity()), normalFont));
                    double amount = tr.getUnitCostSnapshot() * tr.getQuantity();
                    amtCell = new PdfPCell(new Phrase("$" + String.format("%.2f", amount), normalFont));

                    styleRowCells(descCell, rateCell, qtyCell, amtCell, lightBgColor, borderColor, alternatingRow);
                    itemTable.addCell(descCell);
                    itemTable.addCell(rateCell);
                    itemTable.addCell(qtyCell);
                    itemTable.addCell(amtCell);
                    alternatingRow = !alternatingRow;
                }
            }

            // 3.3 Attending Doctor Consultation Fees
            List<DoctorPatient> assignments = doctorPatientRepository.findByPatient_PatientId(patient.getPatientId());
            for (DoctorPatient dp : assignments) {
                descCell = new PdfPCell(new Phrase("Inpatient Consultation: Dr. " + dp.getDoctor().getFullName() + " (" + dp.getDoctor().getSpecialisation() + ")", normalFont));
                rateCell = new PdfPCell(new Phrase("$" + String.format("%.2f", dp.getDoctor().getConsultationFee()), normalFont));
                qtyCell = new PdfPCell(new Phrase("1", normalFont));
                amtCell = new PdfPCell(new Phrase("$" + String.format("%.2f", dp.getDoctor().getConsultationFee()), normalFont));

                styleRowCells(descCell, rateCell, qtyCell, amtCell, lightBgColor, borderColor, alternatingRow);
                itemTable.addCell(descCell);
                itemTable.addCell(rateCell);
                itemTable.addCell(qtyCell);
                itemTable.addCell(amtCell);
                alternatingRow = !alternatingRow;
            }

            // 3.4 Outpatient Appts (Billed)
            if (bill.getOutpatientCharges() > 0) {
                List<Appointment> completedAppointments = appointmentRepository.findByPatient_PatientIdAndStatus(patient.getPatientId(), AppointmentStatus.COMPLETED);
                for (Appointment app : completedAppointments) {
                    if (app.getIsBilled() != null && app.getIsBilled()) {
                        descCell = new PdfPCell(new Phrase("Outpatient Visit: Dr. " + app.getDoctor().getFullName(), normalFont));
                        rateCell = new PdfPCell(new Phrase("$" + String.format("%.2f", app.getDoctor().getConsultationFee()), normalFont));
                        qtyCell = new PdfPCell(new Phrase("1", normalFont));
                        amtCell = new PdfPCell(new Phrase("$" + String.format("%.2f", app.getDoctor().getConsultationFee()), normalFont));

                        styleRowCells(descCell, rateCell, qtyCell, amtCell, lightBgColor, borderColor, alternatingRow);
                        itemTable.addCell(descCell);
                        itemTable.addCell(rateCell);
                        itemTable.addCell(qtyCell);
                        itemTable.addCell(amtCell);
                        alternatingRow = !alternatingRow;
                    }
                }
            }

            document.add(itemTable);

            // Spacing
            document.add(new Paragraph("\n"));

            // 4. Totals Summary Box
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(40);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.setWidths(new float[]{50, 50});

            double chargesSum = bill.getRoomCharges() + bill.getTreatmentCharges() + bill.getDoctorCharges() + bill.getOutpatientCharges();
            addSummaryRow(summaryTable, "Subtotal:", chargesSum, normalFont, boldFont);
            addSummaryRow(summaryTable, "Discount (" + bill.getDiscount() + "%):", -chargesSum * (bill.getDiscount() / 100), normalFont, boldFont);
            addSummaryRow(summaryTable, "Tax (" + bill.getTaxPercent() + "%):", chargesSum * (1 - bill.getDiscount() / 100) * (bill.getTaxPercent() / 100), normalFont, boldFont);
            
            PdfPCell gTotalLabel = new PdfPCell(new Phrase("Grand Total:", sectionHeaderFont));
            gTotalLabel.setBorder(Rectangle.NO_BORDER);
            gTotalLabel.setPadding(5);
            summaryTable.addCell(gTotalLabel);

            PdfPCell gTotalVal = new PdfPCell(new Phrase("$" + String.format("%.2f", bill.getTotalAmount()), sectionHeaderFont));
            gTotalVal.setBorder(Rectangle.NO_BORDER);
            gTotalVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            gTotalVal.setPadding(5);
            summaryTable.addCell(gTotalVal);

            addSummaryRow(summaryTable, "Paid Amount:", -bill.getPaidAmount(), normalFont, boldFont);

            double balance = bill.getTotalAmount() - bill.getPaidAmount();
            PdfPCell balLabel = new PdfPCell(new Phrase("Balance Due:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new BaseColor(239, 68, 68))));
            balLabel.setBorder(Rectangle.TOP);
            balLabel.setBorderColor(borderColor);
            balLabel.setPadding(5);
            summaryTable.addCell(balLabel);

            PdfPCell balVal = new PdfPCell(new Phrase("$" + String.format("%.2f", balance), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new BaseColor(239, 68, 68))));
            balVal.setBorder(Rectangle.TOP);
            balVal.setBorderColor(borderColor);
            balVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            balVal.setPadding(5);
            summaryTable.addCell(balVal);

            document.add(summaryTable);

            // Footer
            document.add(new Paragraph("\n\n"));
            Paragraph footerTitle = new Paragraph("Thank you for choosing Hospitalz!", boldFont);
            footerTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(footerTitle);

            Paragraph footerSub = new Paragraph("If you have any questions regarding this invoice, please email billing@hospitalz.com", subTitleFont);
            footerSub.setAlignment(Element.ALIGN_CENTER);
            document.add(footerSub);

            document.close();
        } catch (DocumentException | java.io.IOException e) {
            throw new RuntimeException("Error during PDF document creation: " + e.getMessage());
        }

        return out.toByteArray();
    }

    private void styleRowCells(PdfPCell desc, PdfPCell rate, PdfPCell qty, PdfPCell amt, BaseColor bg, BaseColor border, boolean alternating) {
        PdfPCell[] cells = {desc, rate, qty, amt};
        for (int i = 0; i < cells.length; i++) {
            cells[i].setBorderColor(border);
            cells[i].setPadding(6);
            if (alternating) {
                cells[i].setBackgroundColor(bg);
            }
            if (i > 0) {
                cells[i].setHorizontalAlignment(Element.ALIGN_RIGHT);
            }
        }
    }

    private void addSummaryRow(PdfPTable table, String label, double amount, Font labelFont, Font valFont) {
        PdfPCell lCell = new PdfPCell(new Phrase(label, labelFont));
        lCell.setBorder(Rectangle.NO_BORDER);
        lCell.setPadding(3);
        table.addCell(lCell);

        PdfPCell vCell = new PdfPCell(new Phrase((amount < 0 ? "-" : "") + "$" + String.format("%.2f", Math.abs(amount)), valFont));
        vCell.setBorder(Rectangle.NO_BORDER);
        vCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        vCell.setPadding(3);
        table.addCell(vCell);
    }
}