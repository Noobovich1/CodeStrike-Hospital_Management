package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.exception.ResourceNotFoundException;
import cswebapp.hospitalz.model.VitalsLog;
import cswebapp.hospitalz.service.VitalsLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vitals")
public class VitalsLogController {

    @Autowired
    private VitalsLogService vitalsLogService;

    // POST /api/v1/vitals/{patientId}
    // patientId truyền qua path, thông tin vitals qua body
    @PostMapping("/{patientId}")
    public ResponseEntity<?> recordVitals(
            @PathVariable String patientId,
            @RequestBody VitalsLog vitalsLog) {
        try {
            VitalsLog saved = vitalsLogService.recordVitals(patientId, vitalsLog);
            return ResponseEntity.ok(saved);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<VitalsLog>> getVitalsByPatient(@PathVariable String patientId) {
        List<VitalsLog> list = vitalsLogService.getVitalsByPatient(patientId);
        return ResponseEntity.ok(list);
    }

    @GetMapping
    public ResponseEntity<List<VitalsLog>> getAllVitals() {
        List<VitalsLog> list = vitalsLogService.getAllVitals();
        return ResponseEntity.ok(list);
    }
}

