package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.Staff;
import cswebapp.hospitalz.model.StaffRole;
import cswebapp.hospitalz.model.User;
import cswebapp.hospitalz.model.UserRole;
import cswebapp.hospitalz.repository.StaffRepository;
import cswebapp.hospitalz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public synchronized Staff createStaff(Staff staff) {
        if (staff.getRole() == StaffRole.RECEPTIONIST) {
            throw new IllegalArgumentException("Receptionist accounts are managed via User Management.");
        }

        // --- Sinh Staff ID (cùng pattern với Patient ID trong AuthController) ---
        String idPrefix = staff.getRole() == StaffRole.NURSE ? "NRS" : "WRD";
        int currentYear = LocalDate.now().getYear();
        String staffIdPrefix = idPrefix + "-" + currentYear + "-";

        Optional<String> lastIdOpt = staffRepository.findLastStaffIdByPrefix(staffIdPrefix + "%");
        int nextStaffNumber = 1;
        if (lastIdOpt.isPresent()) {
            try {
                String numberPart = lastIdOpt.get().substring(staffIdPrefix.length());
                nextStaffNumber = Integer.parseInt(numberPart) + 1;
            } catch (Exception e) {
                nextStaffNumber = 1;
            }
        }
        String staffId = staffIdPrefix + String.format("%04d", nextStaffNumber);

        // --- Sinh Username (cùng pattern) ---
        String usernamePrefix = staff.getRole() == StaffRole.NURSE ? "nurse_" : "ward_boy_";
        Optional<String> lastUsernameOpt = userRepository.findLastUsernameByPrefix(usernamePrefix + "%");
        int nextUsernameNumber = 1;
        if (lastUsernameOpt.isPresent()) {
            try {
                String numberPart = lastUsernameOpt.get().substring(usernamePrefix.length());
                nextUsernameNumber = Integer.parseInt(numberPart) + 1;
            } catch (Exception e) {
                nextUsernameNumber = 1;
            }
        }
        String username = usernamePrefix + String.format("%02d", nextUsernameNumber);

        // --- Tạo User account ---
        UserRole userRole = staff.getRole() == StaffRole.NURSE ? UserRole.NURSE : UserRole.WARD_BOY;
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode("Pass1234"));
        newUser.setRole(userRole);
        newUser.setActive(true);
        User savedUser = userRepository.save(newUser);

        // --- Gán vào Staff và lưu ---
        staff.setStaffId(staffId);
        staff.setUser(savedUser);
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

    @Transactional
    public void deactivateStaff(String staffId) {
        Staff existing = getStaffById(staffId);
        existing.setIsActive(false);
        staffRepository.save(existing);
        if (existing.getUser() != null) {
            existing.getUser().setActive(false);
            userRepository.save(existing.getUser());
        }
    }

    @Transactional
    public void activateStaff(String staffId) {
        Staff existing = getStaffById(staffId);
        existing.setIsActive(true);
        staffRepository.save(existing);
        if (existing.getUser() != null) {
            existing.getUser().setActive(true);
            userRepository.save(existing.getUser());
        }
    }
}