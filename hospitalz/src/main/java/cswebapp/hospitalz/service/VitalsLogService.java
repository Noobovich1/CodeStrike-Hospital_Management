package cswebapp.hospitalz.service;

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
    public VitalsLog recordVitals(VitalsLog vitalsLog) {
        // Kiểm tra xem bệnh nhân có tồn tại hay không (Task 1.2)
        if (!patientRepository.existsById(vitalsLog.getPatientId())) {
            throw new IllegalArgumentException("Patient not found: " + vitalsLog.getPatientId());
        }

        if (vitalsLog.getRecordedAt() == null) {
            vitalsLog.setRecordedAt(LocalDateTime.now());
        }
        return vitalsLogRepository.save(vitalsLog);
    }

    public List<VitalsLog> getVitalsByPatient(String patientId) {
        return vitalsLogRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
    }

    public List<VitalsLog> getAllVitals() {
        return vitalsLogRepository.findAllByOrderByRecordedAtDesc();
    }
}
