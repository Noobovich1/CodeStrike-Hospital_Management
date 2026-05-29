package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Doctor;
import cswebapp.hospitalz.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping
    public ResponseEntity<?> registerDoctor(@RequestBody Doctor doctor) {
        Doctor saved = doctorService.registerDoctor(doctor);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("doctorId", saved.getDoctorId());
        response.put("fullName", saved.getFullName());
        response.put("username", saved.getUser() != null ? saved.getUser().getUsername() : null);
        response.put("defaultPassword", "Pass1234");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Doctor>> getActiveDoctors() {
        return ResponseEntity.ok(doctorService.getActiveDoctors());
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable String doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorById(doctorId));
    }

    @PutMapping("/{doctorId}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable String doctorId,
            @RequestBody Doctor updatedData) {
        return ResponseEntity.ok(doctorService.updateDoctor(doctorId, updatedData));
    }

    // DELETE is soft — just sets is_active = false
    @DeleteMapping("/{doctorId}")
    public ResponseEntity<String> deactivateDoctor(@PathVariable String doctorId) {
        doctorService.deactivateDoctor(doctorId);
        return ResponseEntity.ok("Doctor " + doctorId + " deactivated successfully.");
    }
}