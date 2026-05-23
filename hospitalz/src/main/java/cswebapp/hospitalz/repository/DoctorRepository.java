package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {

    // Find all active doctors
    List<Doctor> findByIsActiveTrue();

    // Find doctors by specialisation (useful when assigning to ICU patients etc.)
    List<Doctor> findBySpecialisationContainingIgnoreCase(String specialisation);

    Optional<Doctor> findByUser_Id(Long userId);
}
