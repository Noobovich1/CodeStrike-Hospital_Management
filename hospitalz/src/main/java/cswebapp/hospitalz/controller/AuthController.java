package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.config.JwtService;
import cswebapp.hospitalz.model.Doctor;
import cswebapp.hospitalz.model.User;
import cswebapp.hospitalz.model.UserRole;
import cswebapp.hospitalz.repository.DoctorRepository;
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
    private DoctorRepository doctorRepository;

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
            String token = jwtService.generateToken(user.getUsername(), user.getRole().name(), request.isRememberMe());
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole().name());
            response.put("username", user.getUsername());

            if ("DOCTOR".equals(user.getRole().name())) {
                Doctor doctor = doctorRepository.findByUser_Id(user.getId()).orElse(null);
                if (doctor != null) {
                    response.put("doctorId", doctor.getDoctorId());
                }
            }

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Invalid username or password");
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // 1. Backend Regex Validation cho Username
        if (request.getUsername() == null || !request.getUsername().matches("^[a-zA-Z0-9_]{3,20}$")) {
            return ResponseEntity.badRequest().body(Map.of("error", 
                "Invalid Username! Must be 3-20 characters, using only letters, numbers, and underscores."));
        }

        // 2. Backend Regex Validation cho Password
        if (request.getPassword() == null || !request.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\W]{8,}$")) {
            return ResponseEntity.badRequest().body(Map.of("error", 
                "Invalid Password! Must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 number."));
        }

        // Kiểm tra xem username đã tồn tại chưa
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is already taken!"));
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        // Mã hóa mật khẩu trước khi lưu vào DB
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Thiết lập Role. Mặc định tài khoản đăng ký tự do trên web là PATIENT
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                newUser.setRole(UserRole.valueOf(request.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                newUser.setRole(UserRole.PATIENT);
            }
        } else {
            newUser.setRole(UserRole.PATIENT);
        }
        
        newUser.setActive(true);
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }
}