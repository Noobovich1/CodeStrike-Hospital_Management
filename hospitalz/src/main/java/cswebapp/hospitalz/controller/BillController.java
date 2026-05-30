package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Bill;
import cswebapp.hospitalz.dto.PaymentRequest;
import cswebapp.hospitalz.dto.RefundRequest;
import cswebapp.hospitalz.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @Autowired
    private cswebapp.hospitalz.repository.PatientRepository patientRepository;

    @Autowired
    private cswebapp.hospitalz.repository.UserRepository userRepository;

    // Generate bill after discharge
    // POST /api/v1/bills/generate/1 (1 = admissionId)
    @PostMapping("/generate/{admissionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Bill> generateBill(@PathVariable Long admissionId) {
        return ResponseEntity.ok(billService.generateBill(admissionId));
    }

    // Generate outpatient bill for completed appointment
    @PostMapping("/generate/outpatient/{appointmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Bill> generateOutpatientBill(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(billService.generateOutpatientBill(appointmentId));
    }

    // Record a payment (partial or full)
    // Body: { "amount": 100.00 }
    @PostMapping("/{billId}/pay")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Bill> recordPayment(
            @PathVariable Long billId,
            @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(billService.recordPayment(billId, request));
    }

    // Admin applies discount — recalculates total
    // PATCH /api/v1/bills/1/discount?percent=15
    @PatchMapping("/{billId}/discount")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bill> applyDiscount(
            @PathVariable Long billId,
            @RequestParam java.math.BigDecimal percent) {
        return ResponseEntity.ok(billService.applyDiscount(billId, percent));
    }

    @GetMapping("/{billId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<?> getBillById(@PathVariable Long billId, java.security.Principal principal) {
        Bill bill = billService.getBillById(billId);
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(bill.getPatient().getPatientId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: You cannot access other patients' bills"));
            }
        }
        return ResponseEntity.ok(bill);
    }

    // Get bill by admission ID
    @GetMapping("/admission/{admissionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<?> getBillByAdmission(@PathVariable Long admissionId, java.security.Principal principal) {
        Bill bill = billService.getBillByAdmission(admissionId);
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(bill.getPatient().getPatientId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: You cannot access other patients' bills"));
            }
        }
        return ResponseEntity.ok(bill);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<?> getBillsByPatient(@PathVariable String patientId, java.security.Principal principal) {
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(patientId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: You cannot access other patients' bills"));
            }
        }
        return ResponseEntity.ok(billService.getBillsByPatient(patientId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<?> getAllBills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(billService.searchBills(search, page, size));
        }
        return ResponseEntity.ok(billService.getBillsPaginated(page, size));
    }

    @GetMapping("/{billId}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<?> downloadBillPdf(@PathVariable Long billId, java.security.Principal principal) {
        Bill bill = billService.getBillById(billId);
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(bill.getPatient().getPatientId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: You cannot access other patients' bills"));
            }
        }
        byte[] pdfBytes = billService.generateBillPdf(billId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Bill_" + billId + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @DeleteMapping("/{billId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> voidBill(@PathVariable Long billId) {
        billService.voidBill(billId);
        return ResponseEntity.ok(Map.of("message", "Bill voided successfully"));
    }

    @PostMapping("/{billId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> refundBill(
            @PathVariable Long billId,
            @RequestBody RefundRequest request) {
        billService.refundBill(billId, request.getAmount());
        return ResponseEntity.ok(Map.of("message", "Bill refunded successfully"));
    }
}