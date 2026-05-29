package cswebapp.hospitalz.service;

import cswebapp.hospitalz.exception.ResourceNotFoundException;
import cswebapp.hospitalz.model.Patient;
import cswebapp.hospitalz.model.VitalsLog;
import cswebapp.hospitalz.repository.PatientRepository;
import cswebapp.hospitalz.repository.VitalsLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VitalsLogService {

    @Autowired
    private VitalsLogRepository vitalsLogRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Transactional
    public VitalsLog recordVitals(String patientId, VitalsLog vitalsLog) {
        // Validation check for physical limits
        if (vitalsLog.getTemperature() != null && (vitalsLog.getTemperature() < 25.0 || vitalsLog.getTemperature() > 45.0)) {
            throw new IllegalArgumentException("Invalid temperature: must be between 25.0°C and 45.0°C");
        }
        if (vitalsLog.getPulse() != null && (vitalsLog.getPulse() < 0 || vitalsLog.getPulse() > 300)) {
            throw new IllegalArgumentException("Invalid pulse: must be between 0 and 300 bpm");
        }
        if (vitalsLog.getOxygenLevel() != null && (vitalsLog.getOxygenLevel() < 0 || vitalsLog.getOxygenLevel() > 100)) {
            throw new IllegalArgumentException("Invalid oxygen level (SpO2): must be between 0% and 100%");
        }

        // Load Patient object — nếu không tìm thấy sẽ throw 404
        // FK constraint ở DB level cũng sẽ enforce khi save
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        vitalsLog.setPatient(patient);

        if (vitalsLog.getRecordedAt() == null) {
            vitalsLog.setRecordedAt(LocalDateTime.now());
        }
        return vitalsLogRepository.save(vitalsLog);
    }

    public List<VitalsLog> getVitalsByPatient(String patientId) {
        return vitalsLogRepository.findByPatient_PatientIdOrderByRecordedAtDesc(patientId);
    }

    public List<VitalsLog> getAllVitals() {
        return vitalsLogRepository.findAllByOrderByRecordedAtDesc();
    }
}
