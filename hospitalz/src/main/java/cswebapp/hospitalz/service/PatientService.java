package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.Patient;
import cswebapp.hospitalz.model.User;
import cswebapp.hospitalz.repository.PatientRepository;
import cswebapp.hospitalz.repository.UserRepository;
import cswebapp.hospitalz.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    public Patient registerNewPatient(Patient patient) {
        String uniqueId = "PAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        patient.setPatientId(uniqueId);

        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAllByOrderByIsActiveDesc();
    }

    public Patient getPatientById(String patientId) {
        return patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));
    }

    public Patient updateClinicalDetails(String patientId, String diseaseDescription, String currentTreatmentNotes) {
        Patient patient = getPatientById(patientId);
        if (diseaseDescription != null) {
            patient.setDiseaseDescription(diseaseDescription);
        }
        if (currentTreatmentNotes != null) {
            patient.setCurrentTreatmentNotes(currentTreatmentNotes);
        }
        return patientRepository.save(patient);
    }

    @Transactional
    public void deactivatePatient(String patientId) {
        Patient existing = getPatientById(patientId);
        existing.setIsActive(false);
        patientRepository.save(existing);
        if (existing.getUser() != null) {
            existing.getUser().setActive(false);
            userRepository.save(existing.getUser());
        }
    }

    @Transactional
    public void activatePatient(String patientId) {
        Patient existing = getPatientById(patientId);
        existing.setIsActive(true);
        patientRepository.save(existing);
        if (existing.getUser() != null) {
            existing.getUser().setActive(true);
            userRepository.save(existing.getUser());
        }
    }
}
