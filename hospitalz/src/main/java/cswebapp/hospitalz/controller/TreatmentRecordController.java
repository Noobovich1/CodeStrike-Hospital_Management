package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.TreatmentRecord;
import cswebapp.hospitalz.model.TreatmentRecordRequest;
import cswebapp.hospitalz.service.TreatmentRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/treatment-records")
public class TreatmentRecordController {

    @Autowired
    private TreatmentRecordService treatmentRecordService;

    // Doctor prescribes a treatment for a patient
    @PostMapping
    public ResponseEntity<TreatmentRecord> prescribeTreatment(
            @RequestBody TreatmentRecordRequest request) {
        return ResponseEntity.ok(treatmentRecordService.prescribeTreatment(request));
    }

    // Get all treatment records for a patient (used by nurse, doctor, billing)
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<TreatmentRecord>> getRecordsByPatient(
            @PathVariable String patientId) {
        return ResponseEntity.ok(treatmentRecordService.getRecordsByPatient(patientId));
    }

    // Get all records prescribed by a doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<TreatmentRecord>> getRecordsByDoctor(
            @PathVariable String doctorId) {
        return ResponseEntity.ok(treatmentRecordService.getRecordsByDoctor(doctorId));
    }

    // Get total treatment cost for a patient — used internally by BillService
    @GetMapping("/patient/{patientId}/total-cost")
    public ResponseEntity<Double> getTotalCost(@PathVariable String patientId) {
        return ResponseEntity.ok(treatmentRecordService.getTotalTreatmentCostForPatient(patientId));
    }
}