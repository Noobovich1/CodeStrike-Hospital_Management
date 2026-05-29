package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Appointment;
import cswebapp.hospitalz.dto.AppointmentRequest;
import cswebapp.hospitalz.model.AppointmentStatus;
import cswebapp.hospitalz.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private cswebapp.hospitalz.repository.PatientRepository patientRepository;

    @Autowired
    private cswebapp.hospitalz.repository.UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request, java.security.Principal principal) {
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(java.util.Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(request.getPatientId())) {
                return ResponseEntity.status(403).body(java.util.Map.of("error", "Forbidden: You can only book appointments for yourself"));
            }
        }
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<?> getAppointmentsByPatient(@PathVariable String patientId, java.security.Principal principal) {
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(java.util.Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(patientId)) {
                return ResponseEntity.status(403).body(java.util.Map.of("error", "Forbidden: You can only view your own appointments"));
            }
        }
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam AppointmentStatus status, java.security.Principal principal) {
        Appointment appointment = appointmentService.getAllAppointments().stream().filter(a -> a.getId().equals(id)).findFirst().orElse(null);
        if (appointment == null) {
            return ResponseEntity.status(404).body(java.util.Map.of("error", "Appointment not found"));
        }
        boolean isPatient = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().contains(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"));
        if (isPatient) {
            cswebapp.hospitalz.model.User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(403).body(java.util.Map.of("error", "Forbidden: User not found"));
            }
            cswebapp.hospitalz.model.Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
            if (patient == null || !patient.getPatientId().equals(appointment.getPatient().getPatientId())) {
                return ResponseEntity.status(403).body(java.util.Map.of("error", "Forbidden: You cannot modify other patients' appointments"));
            }
            if (status != AppointmentStatus.CANCELLED) {
                return ResponseEntity.status(400).body(java.util.Map.of("error", "Bad Request: Patients can only CANCEL appointments"));
            }
        }
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Appointment> assignDoctor(@PathVariable Long id, @RequestParam String doctorId) {
        return ResponseEntity.ok(appointmentService.assignDoctor(id, doctorId));
    }
}
