package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.Staff;
import cswebapp.hospitalz.model.StaffRole;
import cswebapp.hospitalz.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    public Staff createStaff(Staff staff) {
        // NRS- for nurses, WRD- for ward boys
        String prefix = staff.getRole() == StaffRole.NURSE ? "NRS-" : "WRD-";
        String uniqueId = prefix + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        staff.setStaffId(uniqueId);
        staff.setIsActive(true);
        staff.setCreatedAt(LocalDateTime.now());
        return staffRepository.save(staff);
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public List<Staff> getActiveStaff() {
        return staffRepository.findByIsActiveTrue();
    }

    public Staff getStaffById(String staffId) {
        return staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));
    }

    public List<Staff> getStaffByRole(StaffRole role) {
        return staffRepository.findByRole(role);
    }

    public List<Staff> getStaffByWard(String ward) {
        return staffRepository.findByAssignedWardIgnoreCase(ward);
    }

    public Staff updateStaff(String staffId, Staff updatedData) {
        Staff existing = getStaffById(staffId);

        if (updatedData.getFullName() != null) existing.setFullName(updatedData.getFullName());
        if (updatedData.getPhoneNumber() != null) existing.setPhoneNumber(updatedData.getPhoneNumber());
        if (updatedData.getAssignedWard() != null) existing.setAssignedWard(updatedData.getAssignedWard());
        if (updatedData.getShift() != null) existing.setShift(updatedData.getShift());

        return staffRepository.save(existing);
    }

    public void deactivateStaff(String staffId) {
        Staff existing = getStaffById(staffId);
        existing.setIsActive(false);
        staffRepository.save(existing);
    }
}