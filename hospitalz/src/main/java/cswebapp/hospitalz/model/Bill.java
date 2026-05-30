package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Long billId;

    @OneToOne
    @JoinColumn(name = "admission_id", nullable = true, unique = true)
    @JsonIgnoreProperties({"bills", "patient", "hibernateLazyInitializer"})
    private Admission admission;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = true, unique = true)
    @JsonIgnoreProperties({"bills", "patient", "hibernateLazyInitializer"})
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"bills", "admissions", "hibernateLazyInitializer"})
    private Patient patient;

    // Room charges = daily_rate × total_days
    @Column(name = "room_charges", nullable = false)
    private java.math.BigDecimal roomCharges;

    // Sum of all treatment_records (unit_cost_snapshot × quantity)
    @Column(name = "treatment_charges", nullable = false)
    private java.math.BigDecimal treatmentCharges;

    // Sum of consultation fees for all assigned doctors
    @Column(name = "doctor_charges", nullable = false)
    private java.math.BigDecimal doctorCharges;

    // Medicines, misc — defaults to 0
    @Column(name = "other_charges")
    private java.math.BigDecimal otherCharges = java.math.BigDecimal.ZERO;

    // Outpatient appointment consultation charges
    @Column(name = "outpatient_charges")
    private java.math.BigDecimal outpatientCharges = java.math.BigDecimal.ZERO;

    // Percentage discount (0-100)
    @Column(name = "discount")
    private java.math.BigDecimal discount = java.math.BigDecimal.ZERO;

    // VAT or applicable tax percentage
    @Column(name = "tax_percent")
    private java.math.BigDecimal taxPercent = java.math.BigDecimal.valueOf(10.0);

    // Final computed amount stored for audit
    @Column(name = "total_amount", nullable = false)
    private java.math.BigDecimal totalAmount;

    @Column(name = "payment_status")
    @Enumerated(EnumType.ORDINAL)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "bill_status")
    @Enumerated(EnumType.ORDINAL)
    private BillStatus billStatus = BillStatus.ACTIVE;

    @Column(name = "paid_amount")
    private java.math.BigDecimal paidAmount = java.math.BigDecimal.ZERO;

    @Column(name = "refund_amount")
    private java.math.BigDecimal refundAmount = java.math.BigDecimal.ZERO;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
}