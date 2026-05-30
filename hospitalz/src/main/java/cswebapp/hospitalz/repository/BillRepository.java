package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Bill;
import cswebapp.hospitalz.model.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    Optional<Bill> findByAdmission_AdmissionId(Long admissionId);

    Optional<Bill> findByAppointment_Id(Long appointmentId);

    List<Bill> findByPatient_PatientId(String patientId);

    List<Bill> findByPaymentStatus(PaymentStatus paymentStatus);

    @Query("SELECT COALESCE(SUM(b.paidAmount), 0) FROM Bill b")
    java.math.BigDecimal sumPaidAmount();

    @Query("SELECT new map(b.generatedAt as generatedAt, b.totalAmount as totalAmount) FROM Bill b")
    List<java.util.Map<String, Object>> findBillSummaryForChart();

    List<Bill> findAllByOrderByBillStatusAsc();

    // ── PAGINATED + SEARCH ──────────────────────────────────────────────
    @Query("SELECT b FROM Bill b JOIN FETCH b.patient ORDER BY b.billStatus ASC, b.billId DESC")
    Page<Bill> findAllWithPatient(Pageable pageable);

    @Query("SELECT b FROM Bill b JOIN FETCH b.patient WHERE CAST(b.billId AS string) LIKE %:q% " +
           "OR b.patient.patientId LIKE %:q% OR b.patient.fullName LIKE %:q% ORDER BY b.billId DESC")
    Page<Bill> searchBills(@Param("q") String q, Pageable pageable);
}