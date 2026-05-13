package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Patient;
import cswebapp.hospitalz.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping
    public Patient registerPatient(@RequestBody Patient patient) {
        return patientService.registerNewPatient(patient);
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }
}