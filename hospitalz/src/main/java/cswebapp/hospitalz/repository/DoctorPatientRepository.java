package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.DoctorPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorPatientRepository extends JpaRepository<DoctorPatient, Long> {

    // Get all patients assigned to a specific doctor
    List<DoctorPatient> findByDoctor_DoctorId(String doctorId);

    // Get all doctors assigned to a specific patient
    List<DoctorPatient> findByPatient_PatientId(String patientId);
}