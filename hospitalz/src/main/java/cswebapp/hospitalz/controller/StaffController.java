package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Staff;
import cswebapp.hospitalz.model.StaffRole;
import cswebapp.hospitalz.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/staff")
@PreAuthorize("hasRole('ADMIN')")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping
    public ResponseEntity<?> createStaff(@RequestBody Staff staff) {
        try {
            Staff saved = staffService.createStaff(staff);
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("staffId", saved.getStaffId());
            response.put("fullName", saved.getFullName());
            response.put("role", saved.getRole());
            response.put("username", saved.getUser() != null ? saved.getUser().getUsername() : null);
            response.put("defaultPassword", "Pass1234");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Staff>> getActiveStaff() {
        return ResponseEntity.ok(staffService.getActiveStaff());
    }

    @GetMapping("/{staffId}")
    public ResponseEntity<Staff> getStaffById(@PathVariable String staffId) {
        return ResponseEntity.ok(staffService.getStaffById(staffId));
    }

    // GET /api/v1/staff/role?role=NURSE
    @GetMapping("/role")
    public ResponseEntity<List<Staff>> getStaffByRole(@RequestParam StaffRole role) {
        return ResponseEntity.ok(staffService.getStaffByRole(role));
    }

    // GET /api/v1/staff/ward/Ward-A  ← from doc: GET /api/v1/staff/ward/{ward}
    @GetMapping("/ward/{ward}")
    public ResponseEntity<List<Staff>> getStaffByWard(@PathVariable String ward) {
        return ResponseEntity.ok(staffService.getStaffByWard(ward));
    }

    @PutMapping("/{staffId}")
    public ResponseEntity<Staff> updateStaff(
            @PathVariable String staffId,
            @RequestBody Staff updatedData) {
        return ResponseEntity.ok(staffService.updateStaff(staffId, updatedData));
    }

    @DeleteMapping("/{staffId}")
    public ResponseEntity<String> deactivateStaff(@PathVariable String staffId) {
        staffService.deactivateStaff(staffId);
        return ResponseEntity.ok("Staff " + staffId + " deactivated.");
    }

    @PostMapping("/{staffId}/activate")
    public ResponseEntity<String> activateStaff(@PathVariable String staffId) {
        staffService.activateStaff(staffId);
        return ResponseEntity.ok("Staff " + staffId + " activated.");
    }
}