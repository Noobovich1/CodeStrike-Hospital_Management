package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Bill;
import cswebapp.hospitalz.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    // Get bill by admission
    Optional<Bill> findByAdmission_AdmissionId(Long admissionId);

    // Get bill by appointment
    Optional<Bill> findByAppointment_Id(Long appointmentId);

    // Get all bills for a patient
    List<Bill> findByPatient_PatientId(String patientId);

    // Get unpaid/partial bills — useful for admin dashboard
    List<Bill> findByPaymentStatus(PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(b.paidAmount), 0) FROM Bill b")
    java.math.BigDecimal sumPaidAmount();
}