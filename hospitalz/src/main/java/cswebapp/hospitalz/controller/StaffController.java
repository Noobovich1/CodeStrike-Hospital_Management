package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Staff;
import cswebapp.hospitalz.model.StaffRole;
import cswebapp.hospitalz.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping
    public ResponseEntity<Staff> createStaff(@RequestBody Staff staff) {
        return ResponseEntity.ok(staffService.createStaff(staff));
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
}