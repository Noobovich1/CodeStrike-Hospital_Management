package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.*;
import cswebapp.hospitalz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillPdfService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private TreatmentRecordRepository treatmentRecordRepository;

    @Autowired
    private DoctorPatientRepository doctorPatientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

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
            if (admission != null) {
                stayCell.addElement(new Paragraph("Admission ID: " + admission.getAdmissionId(), boldFont));
                stayCell.addElement(new Paragraph("Room: " + admission.getRoom().getRoomNumber() + " (" + admission.getRoom().getRoomType().name() + ")", normalFont));
                stayCell.addElement(new Paragraph("Admitted: " + admission.getAdmissionDate().toLocalDate().toString(), normalFont));
                stayCell.addElement(new Paragraph("Discharged: " + (admission.getDischargeDate() != null ? admission.getDischargeDate().toLocalDate().toString() : "-"), normalFont));
                stayCell.addElement(new Paragraph("Length of Stay: " + admission.getTotalDays() + " Day(s)", normalFont));
            } else if (bill.getAppointment() != null) {
                Appointment app = bill.getAppointment();
                stayCell.addElement(new Paragraph("Appointment ID: " + app.getId(), boldFont));
                stayCell.addElement(new Paragraph("Specialisation: " + app.getSpecialisation(), normalFont));
                stayCell.addElement(new Paragraph("Date: " + app.getAppointmentDate().toLocalDate().toString(), normalFont));
                stayCell.addElement(new Paragraph("Type: OUTPATIENT VISIT", normalFont));
            }
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
            if (admission != null) {
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
            }

            // 3.2 Treatments and Prescriptions performed during admission or outpatient visit
            if (admission != null) {
                List<TreatmentRecord> treatmentRecords = treatmentRecordRepository.findByPatient_PatientId(patient.getPatientId());
                LocalDateTime start = admission.getAdmissionDate();
                LocalDateTime end = admission.getDischargeDate() != null ? admission.getDischargeDate() : LocalDateTime.now();

                for (TreatmentRecord tr : treatmentRecords) {
                    if (tr.getSessionDate().isAfter(start.minusMinutes(1)) && tr.getSessionDate().isBefore(end.plusMinutes(1))) {
                        PdfPCell descCell = new PdfPCell(new Phrase(tr.getTreatment().getName() + " (Dr. " + tr.getDoctor().getFullName() + ")", normalFont));
                        PdfPCell rateCell = new PdfPCell(new Phrase("$" + String.format("%.2f", tr.getUnitCostSnapshot()), normalFont));
                        PdfPCell qtyCell = new PdfPCell(new Phrase(String.valueOf(tr.getQuantity()), normalFont));
                        java.math.BigDecimal amount = tr.getUnitCostSnapshot().multiply(java.math.BigDecimal.valueOf(tr.getQuantity()));
                        PdfPCell amtCell = new PdfPCell(new Phrase("$" + String.format("%.2f", amount.doubleValue()), normalFont));

                        styleRowCells(descCell, rateCell, qtyCell, amtCell, lightBgColor, borderColor, alternatingRow);
                        itemTable.addCell(descCell);
                        itemTable.addCell(rateCell);
                        itemTable.addCell(qtyCell);
                        itemTable.addCell(amtCell);
                        alternatingRow = !alternatingRow;
                    }
                }
            } else if (bill.getAppointment() != null) {
                List<TreatmentRecord> treatmentRecords = treatmentRecordRepository.findByPatient_PatientId(patient.getPatientId());
                Appointment app = bill.getAppointment();
                LocalDateTime start = app.getAppointmentDate().toLocalDate().atStartOfDay();
                LocalDateTime end = app.getAppointmentDate().toLocalDate().atTime(23, 59, 59);

                for (TreatmentRecord tr : treatmentRecords) {
                    if (tr.getSessionDate().isAfter(start.minusSeconds(1)) && tr.getSessionDate().isBefore(end.plusSeconds(1))) {
                        PdfPCell descCell = new PdfPCell(new Phrase(tr.getTreatment().getName() + " (Dr. " + tr.getDoctor().getFullName() + ")", normalFont));
                        PdfPCell rateCell = new PdfPCell(new Phrase("$" + String.format("%.2f", tr.getUnitCostSnapshot()), normalFont));
                        PdfPCell qtyCell = new PdfPCell(new Phrase(String.valueOf(tr.getQuantity()), normalFont));
                        java.math.BigDecimal amount = tr.getUnitCostSnapshot().multiply(java.math.BigDecimal.valueOf(tr.getQuantity()));
                        PdfPCell amtCell = new PdfPCell(new Phrase("$" + String.format("%.2f", amount.doubleValue()), normalFont));

                        styleRowCells(descCell, rateCell, qtyCell, amtCell, lightBgColor, borderColor, alternatingRow);
                        itemTable.addCell(descCell);
                        itemTable.addCell(rateCell);
                        itemTable.addCell(qtyCell);
                        itemTable.addCell(amtCell);
                        alternatingRow = !alternatingRow;
                    }
                }
            }

            // 3.3 Attending Doctor Consultation Fees
            if (admission != null) {
                List<DoctorPatient> assignments = doctorPatientRepository.findByPatient_PatientId(patient.getPatientId());
                for (DoctorPatient dp : assignments) {
                    PdfPCell descCell = new PdfPCell(new Phrase("Inpatient Consultation: Dr. " + dp.getDoctor().getFullName() + " (" + dp.getDoctor().getSpecialisation() + ")", normalFont));
                    PdfPCell rateCell = new PdfPCell(new Phrase("$" + String.format("%.2f", dp.getDoctor().getConsultationFee()), normalFont));
                    PdfPCell qtyCell = new PdfPCell(new Phrase("1", normalFont));
                    PdfPCell amtCell = new PdfPCell(new Phrase("$" + String.format("%.2f", dp.getDoctor().getConsultationFee()), normalFont));

                    styleRowCells(descCell, rateCell, qtyCell, amtCell, lightBgColor, borderColor, alternatingRow);
                    itemTable.addCell(descCell);
                    itemTable.addCell(rateCell);
                    itemTable.addCell(qtyCell);
                    itemTable.addCell(amtCell);
                    alternatingRow = !alternatingRow;
                }
            }

            // 3.4 Outpatient Appts (Billed)
            if (bill.getOutpatientCharges() != null && bill.getOutpatientCharges().compareTo(java.math.BigDecimal.ZERO) > 0) {
                if (bill.getAppointment() != null) {
                    Appointment app = bill.getAppointment();
                    PdfPCell descCell = new PdfPCell(new Phrase("Outpatient Visit: Dr. " + app.getDoctor().getFullName(), normalFont));
                    PdfPCell rateCell = new PdfPCell(new Phrase("$" + String.format("%.2f", app.getDoctor().getConsultationFee()), normalFont));
                    PdfPCell qtyCell = new PdfPCell(new Phrase("1", normalFont));
                    PdfPCell amtCell = new PdfPCell(new Phrase("$" + String.format("%.2f", app.getDoctor().getConsultationFee()), normalFont));

                    styleRowCells(descCell, rateCell, qtyCell, amtCell, lightBgColor, borderColor, alternatingRow);
                    itemTable.addCell(descCell);
                    itemTable.addCell(rateCell);
                    itemTable.addCell(qtyCell);
                    itemTable.addCell(amtCell);
                    alternatingRow = !alternatingRow;
                } else {
                    List<Appointment> completedAppointments = appointmentRepository.findByPatient_PatientIdAndStatus(patient.getPatientId(), AppointmentStatus.COMPLETED);
                    for (Appointment app : completedAppointments) {
                        if (app.getIsBilled() != null && app.getIsBilled()) {
                            PdfPCell descCell = new PdfPCell(new Phrase("Outpatient Visit: Dr. " + app.getDoctor().getFullName(), normalFont));
                            PdfPCell rateCell = new PdfPCell(new Phrase("$" + String.format("%.2f", app.getDoctor().getConsultationFee()), normalFont));
                            PdfPCell qtyCell = new PdfPCell(new Phrase("1", normalFont));
                            PdfPCell amtCell = new PdfPCell(new Phrase("$" + String.format("%.2f", app.getDoctor().getConsultationFee()), normalFont));

                            styleRowCells(descCell, rateCell, qtyCell, amtCell, lightBgColor, borderColor, alternatingRow);
                            itemTable.addCell(descCell);
                            itemTable.addCell(rateCell);
                            itemTable.addCell(qtyCell);
                            itemTable.addCell(amtCell);
                            alternatingRow = !alternatingRow;
                        }
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

            java.math.BigDecimal chargesSum = bill.getRoomCharges().add(bill.getTreatmentCharges()).add(bill.getDoctorCharges()).add(bill.getOutpatientCharges());
            addSummaryRow(summaryTable, "Subtotal:", chargesSum, normalFont, boldFont);
            java.math.BigDecimal discountAmount = chargesSum.multiply(bill.getDiscount().divide(java.math.BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP)).negate();
            addSummaryRow(summaryTable, "Discount (" + bill.getDiscount() + "%):", discountAmount, normalFont, boldFont);
            java.math.BigDecimal discountFactor = java.math.BigDecimal.ONE.subtract(bill.getDiscount().divide(java.math.BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP));
            java.math.BigDecimal taxFactor = bill.getTaxPercent().divide(java.math.BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP);
            java.math.BigDecimal taxAmount = chargesSum.multiply(discountFactor).multiply(taxFactor);
            addSummaryRow(summaryTable, "Tax (" + bill.getTaxPercent() + "%):", taxAmount, normalFont, boldFont);
            
            PdfPCell gTotalLabel = new PdfPCell(new Phrase("Grand Total:", sectionHeaderFont));
            gTotalLabel.setBorder(Rectangle.NO_BORDER);
            gTotalLabel.setPadding(5);
            summaryTable.addCell(gTotalLabel);

            PdfPCell gTotalVal = new PdfPCell(new Phrase("$" + String.format("%.2f", bill.getTotalAmount().doubleValue()), sectionHeaderFont));
            gTotalVal.setBorder(Rectangle.NO_BORDER);
            gTotalVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            gTotalVal.setPadding(5);
            summaryTable.addCell(gTotalVal);

            addSummaryRow(summaryTable, "Paid Amount:", bill.getPaidAmount().negate(), normalFont, boldFont);

            java.math.BigDecimal balance = bill.getTotalAmount().subtract(bill.getPaidAmount());
            PdfPCell balLabel = new PdfPCell(new Phrase("Balance Due:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new BaseColor(239, 68, 68))));
            balLabel.setBorder(Rectangle.TOP);
            balLabel.setBorderColor(borderColor);
            balLabel.setPadding(5);
            summaryTable.addCell(balLabel);

            PdfPCell balVal = new PdfPCell(new Phrase("$" + String.format("%.2f", balance.doubleValue()), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new BaseColor(239, 68, 68))));
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

    private void addSummaryRow(PdfPTable table, String label, java.math.BigDecimal amount, Font labelFont, Font valFont) {
        PdfPCell lCell = new PdfPCell(new Phrase(label, labelFont));
        lCell.setBorder(Rectangle.NO_BORDER);
        lCell.setPadding(3);
        table.addCell(lCell);

        String sign = amount.compareTo(java.math.BigDecimal.ZERO) < 0 ? "-" : "";
        java.math.BigDecimal absAmount = amount.abs();
        PdfPCell vCell = new PdfPCell(new Phrase(sign + "$" + String.format("%.2f", absAmount.doubleValue()), valFont));
        vCell.setBorder(Rectangle.NO_BORDER);
        vCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        vCell.setPadding(3);
        table.addCell(vCell);
    }
}
