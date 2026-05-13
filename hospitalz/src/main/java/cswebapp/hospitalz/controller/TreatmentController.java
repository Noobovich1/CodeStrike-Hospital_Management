package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Treatment;
import cswebapp.hospitalz.service.TreatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/treatments")
public class TreatmentController {

    @Autowired
    private TreatmentService treatmentService;

    @PostMapping
    public ResponseEntity<Treatment> createTreatment(@RequestBody Treatment treatment) {
        return ResponseEntity.ok(treatmentService.createTreatment(treatment));
    }

    @GetMapping
    public ResponseEntity<List<Treatment>> getAllTreatments() {
        return ResponseEntity.ok(treatmentService.getAllTreatments());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Treatment>> getActiveTreatments() {
        return ResponseEntity.ok(treatmentService.getActiveTreatments());
    }

    @GetMapping("/{treatmentId}")
    public ResponseEntity<Treatment> getTreatmentById(@PathVariable Long treatmentId) {
        return ResponseEntity.ok(treatmentService.getTreatmentById(treatmentId));
    }

    @PutMapping("/{treatmentId}")
    public ResponseEntity<Treatment> updateTreatment(
            @PathVariable Long treatmentId,
            @RequestBody Treatment updatedData) {
        return ResponseEntity.ok(treatmentService.updateTreatment(treatmentId, updatedData));
    }

    @DeleteMapping("/{treatmentId}")
    public ResponseEntity<String> deactivateTreatment(@PathVariable Long treatmentId) {
        treatmentService.deactivateTreatment(treatmentId);
        return ResponseEntity.ok("Treatment " + treatmentId + " deactivated.");
    }
}