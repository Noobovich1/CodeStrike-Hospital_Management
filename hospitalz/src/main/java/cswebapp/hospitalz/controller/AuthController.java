package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.config.JwtService;
import cswebapp.hospitalz.model.*;
import cswebapp.hospitalz.dto.LoginRequest;
import cswebapp.hospitalz.dto.RegisterRequest;
import cswebapp.hospitalz.repository.DoctorRepository;
import cswebapp.hospitalz.repository.PatientRepository;
import cswebapp.hospitalz.repository.UserRepository;
import cswebapp.hospitalz.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // Thêm import này
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private StaffRepository staffRepository;

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
            // Kiểm tra tài khoản có bị khóa không
            if (!user.isActive()) {
                return ResponseEntity.status(403).body("Account is locked. Please contact admin.");
            }

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
            } else if ("PATIENT".equals(user.getRole().name())) {
                Patient patient = patientRepository.findByUser_Id(user.getId()).orElse(null);
                if (patient != null) {
                    response.put("patientId", patient.getPatientId());
                }
            } else if ("NURSE".equals(user.getRole().name()) || "WARD_BOY".equals(user.getRole().name())) {
                Staff staff = staffRepository.findByUser_Id(user.getId()).orElse(null);
                if (staff != null) {
                    response.put("staffId", staff.getStaffId());
                    response.put("assignedWard", staff.getAssignedWard());
                }
            }

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Invalid username or password");
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // 1. Backend Regex Validation cho Username
        if (request.getUsername() == null || !request.getUsername().matches("^[a-zA-Z0-9_]{3,20}$")) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Invalid Username! Must be 3-20 characters, using only letters, numbers, and underscores."));
        }

        // 2. Backend Regex Validation cho Password
        if (request.getPassword() == null
                || !request.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\W]{8,}$")) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Invalid Password! Must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 number."));
        }

        // 3. Validate Patient Info fields
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Full name is required."));
        }
        if (request.getDateOfBirth() == null || request.getDateOfBirth().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Date of birth is required."));
        }
        if (request.getGender() == null || request.getGender().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Gender is required."));
        }
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phone number is required."));
        }

        // Check if gender is valid
        Gender genderEnum;
        try {
            genderEnum = Gender.valueOf(request.getGender().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Gender value."));
        }

        // Parse date of birth
        LocalDate dob;
        try {
            dob = LocalDate.parse(request.getDateOfBirth());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid Date of Birth format (should be YYYY-MM-DD)."));
        }

        // Kiểm tra xem username đã tồn tại chưa
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is already taken!"));
        }

        // Kiểm tra xem phoneNumber đã tồn tại chưa
        if (patientRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Phone number is already registered by another patient!"));
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        // Mã hóa mật khẩu trước khi lưu vào DB
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        // Mặc định tài khoản đăng ký tự do trên web là PATIENT
        newUser.setRole(UserRole.PATIENT);
        newUser.setActive(true);
        User savedUser = userRepository.save(newUser);

        // Sinh PatientID
        int currentYear = LocalDate.now().getYear();
        String patientId = generateNextPatientId(currentYear);

        Patient newPatient = new Patient();
        newPatient.setPatientId(patientId);
        newPatient.setFullName(request.getFullName());
        newPatient.setDateOfBirth(dob);
        newPatient.setGender(genderEnum);
        newPatient.setPhoneNumber(request.getPhoneNumber());
        newPatient.setEmail(
                request.getEmail() != null && !request.getEmail().trim().isEmpty() ? request.getEmail() : null);
        newPatient.setStatus(PatientStatus.OUTPATIENT);
        newPatient.setUser(savedUser);

        patientRepository.save(newPatient);

        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully!",
                "patientId", patientId));
    }

    private synchronized String generateNextPatientId(int year) {
        String prefix = "PAT-" + year + "-";
        Optional<String> lastIdOpt = patientRepository.findLastPatientIdByPrefix(prefix + "%");
        int nextNumber = 1;
        if (lastIdOpt.isPresent()) {
            String lastId = lastIdOpt.get();
            try {
                String numberPart = lastId.substring(prefix.length());
                nextNumber = Integer.parseInt(numberPart) + 1;
            } catch (Exception e) {
                nextNumber = 1;
            }
        }
        return prefix + String.format("%04d", nextNumber); // 4 chữ số, đồng bộ với Staff ID
    }
}