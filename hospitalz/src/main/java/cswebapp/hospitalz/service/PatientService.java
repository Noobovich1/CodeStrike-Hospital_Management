package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.Patient;
import cswebapp.hospitalz.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient registerNewPatient(Patient patient) {
        String uniqueId = "PAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        patient.setPatientId(uniqueId);

        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(String patientId) {
        return patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));
    }

}
