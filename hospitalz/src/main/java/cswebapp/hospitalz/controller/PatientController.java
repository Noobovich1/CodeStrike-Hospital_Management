package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.config.JwtService;
import cswebapp.hospitalz.model.Patient;
import cswebapp.hospitalz.repository.PatientRepository;
import cswebapp.hospitalz.repository.UserRepository;
import cswebapp.hospitalz.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public Patient registerPatient(@RequestBody Patient patient) {
        return patientService.registerNewPatient(patient);
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable String id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    // Patient cập nhật hồ sơ của chính mình
    @PatchMapping("/me")
    public ResponseEntity<?> updateCurrentPatientProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody PatientProfileUpdateRequest request) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized: No token provided"));
        }

        String token = authHeader.substring(7);
        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized: Invalid or expired token"));
        }

        cswebapp.hospitalz.model.User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
        if (patient == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Patient profile not found for this user"));
        }

        // Validate các trường bắt buộc
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Full name is required"));
        }
        if (request.getDateOfBirth() == null || request.getDateOfBirth().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Date of birth is required"));
        }
        if (request.getGender() == null || request.getGender().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Gender is required"));
        }
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phone number is required"));
        }

        // Validate gender enum
        cswebapp.hospitalz.model.Gender genderEnum;
        try {
            genderEnum = cswebapp.hospitalz.model.Gender.valueOf(request.getGender().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Gender value"));
        }

        // Parse date of birth
        java.time.LocalDate dob;
        try {
            dob = java.time.LocalDate.parse(request.getDateOfBirth());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Date of Birth format (should be YYYY-MM-DD)"));
        }

        // Kiểm tra trùng số điện thoại với người khác
        if (!request.getPhoneNumber().equals(patient.getPhoneNumber())) {
            if (patientRepository.existsByPhoneNumberAndPatientIdNot(request.getPhoneNumber(), patient.getPatientId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Phone number is already registered by another patient"));
            }
        }

        // Cập nhật các trường được phép
        patient.setFullName(request.getFullName().trim());
        patient.setDateOfBirth(dob);
        patient.setGender(genderEnum);
        patient.setPhoneNumber(request.getPhoneNumber().trim());
        patient.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty() ? request.getEmail().trim() : null);
        patient.setAddress(request.getAddress() != null && !request.getAddress().trim().isEmpty() ? request.getAddress().trim() : null);
        patient.setEmergencyContactName(request.getEmergencyContactName() != null && !request.getEmergencyContactName().trim().isEmpty() ? request.getEmergencyContactName().trim() : null);
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone() != null && !request.getEmergencyContactPhone().trim().isEmpty() ? request.getEmergencyContactPhone().trim() : null);

        Patient savedPatient = patientRepository.save(patient);
        return ResponseEntity.ok(savedPatient);
    }

    @PatchMapping("/{id}/clinical")
    public ResponseEntity<Patient> updateClinicalDetails(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String diseaseDesc = payload.get("diseaseDescription");
        String treatmentNotes = payload.get("currentTreatmentNotes");
        return ResponseEntity.ok(patientService.updateClinicalDetails(id, diseaseDesc, treatmentNotes));
    }
}