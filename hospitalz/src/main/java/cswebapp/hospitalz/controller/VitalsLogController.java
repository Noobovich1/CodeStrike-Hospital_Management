package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.exception.ResourceNotFoundException;
import cswebapp.hospitalz.model.VitalsLog;
import cswebapp.hospitalz.service.VitalsLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vitals")
public class VitalsLogController {

    @Autowired
    private VitalsLogService vitalsLogService;

    @Autowired
    private cswebapp.hospitalz.repository.PatientRepository patientRepository;

    @Autowired
    private cswebapp.hospitalz.repository.UserRepository userRepository;

    // POST /api/v1/vitals/{patientId}
    // patientId truyền qua path, thông tin vitals qua body
    @PostMapping("/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'DOCTOR')")
    public ResponseEntity<?> recordVitals(
            @PathVariable String patientId,
            @RequestBody VitalsLog vitalsLog) {
        try {
            VitalsLog saved = vitalsLogService.recordVitals(patientId, vitalsLog);
            return ResponseEntity.ok(saved);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT')")
    public ResponseEntity<?> getVitalsByPatient(@PathVariable String patientId, java.security.Principal principal) {
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(patientId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: You can only view your own vitals logs"));
            }
        }
        List<VitalsLog> list = vitalsLogService.getVitalsByPatient(patientId);
        return ResponseEntity.ok(list);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<List<VitalsLog>> getAllVitals() {
        List<VitalsLog> list = vitalsLogService.getAllVitals();
        return ResponseEntity.ok(list);
    }
}

