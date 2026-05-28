package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.VitalsLog;
import cswebapp.hospitalz.repository.VitalsLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vitals")
public class VitalsLogController {

    @Autowired
    private VitalsLogRepository vitalsLogRepository;

    @PostMapping
    public ResponseEntity<VitalsLog> recordVitals(@RequestBody VitalsLog vitalsLog) {
        if (vitalsLog.getRecordedAt() == null) {
            vitalsLog.setRecordedAt(LocalDateTime.now());
        }
        VitalsLog saved = vitalsLogRepository.save(vitalsLog);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<VitalsLog>> getVitalsByPatient(@PathVariable String patientId) {
        List<VitalsLog> list = vitalsLogRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
        return ResponseEntity.ok(list);
    }

    @GetMapping
    public ResponseEntity<List<VitalsLog>> getAllVitals() {
        List<VitalsLog> list = vitalsLogRepository.findAllByOrderByRecordedAtDesc();
        return ResponseEntity.ok(list);
    }
}
