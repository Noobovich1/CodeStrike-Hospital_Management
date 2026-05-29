package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.VitalsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VitalsLogRepository extends JpaRepository<VitalsLog, Long> {
    // Dùng navigation path patient.patientId thay vì plain String field
    List<VitalsLog> findByPatient_PatientIdOrderByRecordedAtDesc(String patientId);
    List<VitalsLog> findAllByOrderByRecordedAtDesc();
}

