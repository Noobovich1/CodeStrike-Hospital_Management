package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.Doctor;
import cswebapp.hospitalz.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public Doctor registerDoctor(Doctor doctor) {
        // Same ID pattern as Patient: DOC-XXXXXXXX
        String uniqueId = "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        doctor.setDoctorId(uniqueId);
        doctor.setIsActive(true);
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
