package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByUser_Id(Long userId);

    @Query("SELECT p.patientId FROM Patient p WHERE p.patientId LIKE :prefix ORDER BY p.patientId DESC LIMIT 1")
    Optional<String> findLastPatientIdByPrefix(@Param("prefix") String prefix);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumberAndPatientIdNot(String phoneNumber, String patientId);

    // Get all patients sorted: active first, then inactive
    List<Patient> findAllByOrderByIsActiveDesc();
}