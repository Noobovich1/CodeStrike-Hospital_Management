package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.User;
import cswebapp.hospitalz.model.UserRole;
import cswebapp.hospitalz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

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
}