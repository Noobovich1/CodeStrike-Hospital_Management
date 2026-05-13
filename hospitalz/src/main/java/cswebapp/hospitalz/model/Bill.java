package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

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

    // One bill per admission — enforced by UNIQUE
    @OneToOne
    @JoinColumn(name = "admission_id", nullable = false, unique = true)
    private Admission admission;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Room charges = daily_rate × total_days
    @Column(name = "room_charges", nullable = false)
    private Double roomCharges;

    // Sum of all treatment_records (unit_cost_snapshot × quantity)
    @Column(name = "treatment_charges", nullable = false)
    private Double treatmentCharges;

    // Sum of consultation fees for all assigned doctors
    @Column(name = "doctor_charges", nullable = false)
    private Double doctorCharges;

    // Medicines, misc — defaults to 0
    @Column(name = "other_charges")
    private Double otherCharges = 0.0;

    // Percentage discount (0-100)
    @Column(name = "discount")
    private Double discount = 0.0;

    // VAT or applicable tax percentage
    @Column(name = "tax_percent")
    private Double taxPercent = 10.0;

    // Final computed amount stored for audit
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "paid_amount")
    private Double paidAmount = 0.0;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
}