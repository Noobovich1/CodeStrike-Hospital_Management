package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.config.JwtService;
import cswebapp.hospitalz.dto.ChangePasswordRequest;
import cswebapp.hospitalz.dto.RoleUpdateRequest;
import cswebapp.hospitalz.model.User;
import cswebapp.hospitalz.model.UserRole;
import cswebapp.hospitalz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Lấy danh sách toàn bộ tài khoản
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Admin cập nhật Role cho tài khoản
    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody RoleUpdateRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        try {
            UserRole newRole = UserRole.valueOf(request.getRole().toUpperCase());
            user.setRole(newRole);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Role updated successfully", "newRole", newRole.name()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role provided"));
        }
    }

    // Đổi mật khẩu tài khoản hiện tại
    @PatchMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody ChangePasswordRequest request) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized: No token provided"));
        }

        String token = authHeader.substring(7);
        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized: Invalid or expired token"));
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        if (request.getCurrentPassword() == null || request.getNewPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Current password and new password are required."));
        }

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Incorrect current password"));
        }

        // Validate mật khẩu mới theo regex
        if (!request.getNewPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\W]{8,}$")) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Password must be at least 8 characters, and include at least one uppercase letter, one lowercase letter, and one number."));
        }

        // Lưu mật khẩu đã mã hóa mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}