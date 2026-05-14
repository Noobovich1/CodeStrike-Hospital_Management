package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.config.JwtService;
import cswebapp.hospitalz.model.User;
import cswebapp.hospitalz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // Thêm import này
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inject Bean BCrypt vào đây

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        // passwordEncoder.matches(mật_khẩu_nhập_vào, mật_khẩu_đã_mã_hóa_trong_db)
        if (user != null && passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole().name(),
                "username", user.getUsername()
            ));
        }
        return ResponseEntity.status(401).body("Invalid username or password");
    }
}