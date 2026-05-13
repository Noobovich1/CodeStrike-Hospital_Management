package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.TreatmentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreatmentRecordRepository extends JpaRepository<TreatmentRecord, Long> {

    // All treatment records for a patient — used when generating bill
    List<TreatmentRecord> findByPatient_PatientId(String patientId);

    // All records for a specific doctor
    List<TreatmentRecord> findByDoctor_DoctorId(String doctorId);

    // Sum of (unit_cost_snapshot * quantity) for a patient — used in billing
    @Query("SELECT COALESCE(SUM(tr.unitCostSnapshot * tr.quantity), 0) " +
           "FROM TreatmentRecord tr WHERE tr.patient.patientId = :patientId")
    Double sumTreatmentCostByPatient(String patientId);
}