package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Treatment;
import cswebapp.hospitalz.service.TreatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/treatments")
public class TreatmentController {

    @Autowired
    private TreatmentService treatmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Treatment> createTreatment(@RequestBody Treatment treatment) {
        return ResponseEntity.ok(treatmentService.createTreatment(treatment));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE')")
    public ResponseEntity<List<Treatment>> getAllTreatments() {
        return ResponseEntity.ok(treatmentService.getAllTreatments());
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE')")
    public ResponseEntity<List<Treatment>> getActiveTreatments() {
        return ResponseEntity.ok(treatmentService.getActiveTreatments());
    }

    @GetMapping("/{treatmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE')")
    public ResponseEntity<Treatment> getTreatmentById(@PathVariable Long treatmentId) {
        return ResponseEntity.ok(treatmentService.getTreatmentById(treatmentId));
    }

    @PutMapping("/{treatmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Treatment> updateTreatment(
            @PathVariable Long treatmentId,
            @RequestBody Treatment updatedData) {
        return ResponseEntity.ok(treatmentService.updateTreatment(treatmentId, updatedData));
    }

    @DeleteMapping("/{treatmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateTreatment(@PathVariable Long treatmentId) {
        treatmentService.deactivateTreatment(treatmentId);
        return ResponseEntity.ok("Treatment " + treatmentId + " deactivated.");
    }

    @PostMapping("/{treatmentId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> activateTreatment(@PathVariable Long treatmentId) {
        treatmentService.activateTreatment(treatmentId);
        return ResponseEntity.ok("Treatment " + treatmentId + " activated.");
    }
}