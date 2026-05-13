package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Admission;
import cswebapp.hospitalz.model.AdmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {

    // All admissions for a patient
    List<Admission> findByPatient_PatientId(String patientId);

    // Find the currently active admission for a patient
    // (used during discharge to find which admission to close)
    Optional<Admission> findByPatient_PatientIdAndStatus(String patientId, AdmissionStatus status);

    // All active admissions (for dashboard)
    List<Admission> findByStatus(AdmissionStatus status);
}