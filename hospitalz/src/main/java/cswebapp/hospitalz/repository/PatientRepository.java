package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    // String is the type of our Primary Key (patientId)
    // Spring Data JPA will automatically give us save(), findAll(), findById(), etc.
}