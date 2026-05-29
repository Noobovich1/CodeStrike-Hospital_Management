package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.TreatmentRecord;
import cswebapp.hospitalz.model.TreatmentRecordRequest;
import cswebapp.hospitalz.service.TreatmentRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/treatment-records")
public class TreatmentRecordController {

    @Autowired
    private TreatmentRecordService treatmentRecordService;

    @Autowired
    private cswebapp.hospitalz.repository.PatientRepository patientRepository;

    @Autowired
    private cswebapp.hospitalz.repository.UserRepository userRepository;

    // Doctor prescribes a treatment for a patient
    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<TreatmentRecord> prescribeTreatment(
            @RequestBody TreatmentRecordRequest request) {
        return ResponseEntity.ok(treatmentRecordService.prescribeTreatment(request));
    }

    // Get all treatment records for a patient (used by nurse, doctor, billing)
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE', 'PATIENT')")
    public ResponseEntity<?> getRecordsByPatient(
            @PathVariable String patientId, java.security.Principal principal) {
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(java.util.Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(patientId)) {
                return ResponseEntity.status(403).body(java.util.Map.of("error", "Forbidden: You can only view your own treatment records"));
            }
        }
        return ResponseEntity.ok(treatmentRecordService.getRecordsByPatient(patientId));
    }

    // Get all records prescribed by a doctor
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<TreatmentRecord>> getRecordsByDoctor(
            @PathVariable String doctorId) {
        return ResponseEntity.ok(treatmentRecordService.getRecordsByDoctor(doctorId));
    }

    // Get total treatment cost for a patient — used internally by BillService
    @GetMapping("/patient/{patientId}/total-cost")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<java.math.BigDecimal> getTotalCost(@PathVariable String patientId) {
        return ResponseEntity.ok(treatmentRecordService.getTotalTreatmentCostForPatient(patientId));
    }

    @PutMapping("/{id}/notes")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<TreatmentRecord> updateNotes(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> payload) {
        return ResponseEntity.ok(treatmentRecordService.updateNotes(id, payload.get("notes")));
    }
}