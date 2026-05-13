package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Bill;
import cswebapp.hospitalz.model.PaymentRequest;
import cswebapp.hospitalz.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bills")
public class BillController {

    @Autowired
    private BillService billService;

    // Generate bill after discharge
    // POST /api/v1/bills/generate/1  (1 = admissionId)
    @PostMapping("/generate/{admissionId}")
    public ResponseEntity<Bill> generateBill(@PathVariable Long admissionId) {
        return ResponseEntity.ok(billService.generateBill(admissionId));
    }

    // Record a payment (partial or full)
    // Body: { "amount": 100.00 }
    @PostMapping("/{billId}/pay")
    public ResponseEntity<Bill> recordPayment(
            @PathVariable Long billId,
            @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(billService.recordPayment(billId, request));
    }

    // Admin applies discount — recalculates total
    // PATCH /api/v1/bills/1/discount?percent=15
    @PatchMapping("/{billId}/discount")
    public ResponseEntity<Bill> applyDiscount(
            @PathVariable Long billId,
            @RequestParam Double percent) {
        return ResponseEntity.ok(billService.applyDiscount(billId, percent));
    }

    @GetMapping("/{billId}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long billId) {
        return ResponseEntity.ok(billService.getBillById(billId));
    }

    // Get bill by admission ID
    @GetMapping("/admission/{admissionId}")
    public ResponseEntity<Bill> getBillByAdmission(@PathVariable Long admissionId) {
        return ResponseEntity.ok(billService.getBillByAdmission(admissionId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Bill>> getBillsByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(billService.getBillsByPatient(patientId));
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }
}