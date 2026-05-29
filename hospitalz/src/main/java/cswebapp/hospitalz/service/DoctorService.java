package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.Doctor;
import cswebapp.hospitalz.model.User;
import cswebapp.hospitalz.model.UserRole;
import cswebapp.hospitalz.repository.DoctorRepository;
import cswebapp.hospitalz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public synchronized Doctor registerDoctor(Doctor doctor) {
        // Same ID pattern as before: DOC-XXXXXXXX (UUID)
        String uniqueId = "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        doctor.setDoctorId(uniqueId);
        doctor.setIsActive(true);

        // --- Sinh Username (cùng pattern với Staff) ---
        String usernamePrefix = "doctor_";
        Optional<String> lastUsernameOpt = userRepository.findLastUsernameByPrefix(usernamePrefix + "%");
        int nextNumber = 1;
        if (lastUsernameOpt.isPresent()) {
            try {
                String numberPart = lastUsernameOpt.get().substring(usernamePrefix.length());
                nextNumber = Integer.parseInt(numberPart) + 1;
            } catch (Exception e) {
                nextNumber = 1;
            }
        }
        String username = usernamePrefix + String.format("%02d", nextNumber);

        // --- Tạo User account ---
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode("Pass1234"));
        newUser.setRole(UserRole.DOCTOR);
        newUser.setActive(true);
        User savedUser = userRepository.save(newUser);

        doctor.setUser(savedUser);
        return doctorRepository.save(doctor);
    }


    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Doctor> getActiveDoctors() {
        return doctorRepository.findByIsActiveTrue();
    }

    public Doctor getDoctorById(String doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));
    }

    public Doctor updateDoctor(String doctorId, Doctor updatedData) {
        Doctor existing = getDoctorById(doctorId);

        // Only update fields that were sent (not null)
        if (updatedData.getFullName() != null) existing.setFullName(updatedData.getFullName());
        if (updatedData.getSpecialisation() != null) existing.setSpecialisation(updatedData.getSpecialisation());
        if (updatedData.getPhoneNumber() != null) existing.setPhoneNumber(updatedData.getPhoneNumber());
        if (updatedData.getEmail() != null) existing.setEmail(updatedData.getEmail());
        if (updatedData.getQualification() != null) existing.setQualification(updatedData.getQualification());
        if (updatedData.getExperienceYears() != null) existing.setExperienceYears(updatedData.getExperienceYears());
        if (updatedData.getConsultationFee() != null) existing.setConsultationFee(updatedData.getConsultationFee());

        return doctorRepository.save(existing);
    }

    // Soft delete — never hard delete doctors (billing history depends on them)
    public void deactivateDoctor(String doctorId) {
        Doctor existing = getDoctorById(doctorId);
        existing.setIsActive(false);
        doctorRepository.save(existing);
    }
}
