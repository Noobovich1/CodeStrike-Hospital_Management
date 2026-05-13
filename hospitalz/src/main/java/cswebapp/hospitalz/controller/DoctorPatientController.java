// controller/DoctorPatientController.java
package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.DoctorPatient;
import cswebapp.hospitalz.model.DoctorPatientRequest;
import cswebapp.hospitalz.service.DoctorPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctor-patient")
public class DoctorPatientController {

    @Autowired
    private DoctorPatientService doctorPatientService;

    // Assign a doctor to a patient
    // Body: { "doctorId": "DOC-XXX", "patientId": "PAT-XXX", "isPrimary": true, "notes": "..." }
    @PostMapping
    public ResponseEntity<DoctorPatient> assignDoctor(@RequestBody DoctorPatientRequest request) {
        return ResponseEntity.ok(doctorPatientService.assignDoctorToPatient(request));
    }

    // Get all patients assigned to a doctor
    @GetMapping("/doctor/{doctorId}/patients")
    public ResponseEntity<List<DoctorPatient>> getPatientsByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(doctorPatientService.getPatientsByDoctor(doctorId));
    }

    // Get all doctors assigned to a patient
    @GetMapping("/patient/{patientId}/doctors")
    public ResponseEntity<List<DoctorPatient>> getDoctorsByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(doctorPatientService.getDoctorsByPatient(patientId));
    }
}
