package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Admission;
import cswebapp.hospitalz.model.AdmissionRequest;
import cswebapp.hospitalz.service.AdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admissions")
public class AdmissionController {

    @Autowired
    private AdmissionService admissionService;

    // Admit a patient to a room
    @PostMapping
    public ResponseEntity<Admission> admitPatient(@RequestBody AdmissionRequest request) {
        return ResponseEntity.ok(admissionService.admitPatient(request));
    }

    // Discharge a patient — triggers total_days calculation
    // Bill generation will be a separate call after this
    @PutMapping("/{admissionId}/discharge")
    public ResponseEntity<Admission> dischargePatient(@PathVariable Long admissionId) {
        return ResponseEntity.ok(admissionService.dischargePatient(admissionId));
    }

    @GetMapping
    public ResponseEntity<List<Admission>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Admission>> getActiveAdmissions() {
        return ResponseEntity.ok(admissionService.getActiveAdmissions());
    }

    @GetMapping("/{admissionId}")
    public ResponseEntity<Admission> getAdmissionById(@PathVariable Long admissionId) {
        return ResponseEntity.ok(admissionService.getAdmissionById(admissionId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Admission>> getAdmissionsByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(admissionService.getAdmissionsByPatient(patientId));
    }
}