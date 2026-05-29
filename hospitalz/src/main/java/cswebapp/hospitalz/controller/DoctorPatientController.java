// controller/DoctorPatientController.java
package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.DoctorPatient;
import cswebapp.hospitalz.model.DoctorPatientRequest;
import cswebapp.hospitalz.service.DoctorPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/doctor-patient")
public class DoctorPatientController {

    @Autowired
    private DoctorPatientService doctorPatientService;

    @Autowired
    private cswebapp.hospitalz.repository.PatientRepository patientRepository;

    @Autowired
    private cswebapp.hospitalz.repository.UserRepository userRepository;

    // Assign a doctor to a patient
    // Body: { "doctorId": "DOC-XXX", "patientId": "PAT-XXX", "isPrimary": true, "notes": "..." }
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<DoctorPatient> assignDoctor(@RequestBody DoctorPatientRequest request) {
        return ResponseEntity.ok(doctorPatientService.assignDoctorToPatient(request));
    }

    // Get all patients assigned to a doctor
    @GetMapping("/doctor/{doctorId}/patients")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<List<DoctorPatient>> getPatientsByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(doctorPatientService.getPatientsByDoctor(doctorId));
    }

    // Get all doctors assigned to a patient
    @GetMapping("/patient/{patientId}/doctors")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE', 'PATIENT')")
    public ResponseEntity<?> getDoctorsByPatient(@PathVariable String patientId, java.security.Principal principal) {
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(patientId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: You can only view your own doctor assignments"));
            }
        }
        return ResponseEntity.ok(doctorPatientService.getDoctorsByPatient(patientId));
    }
}
