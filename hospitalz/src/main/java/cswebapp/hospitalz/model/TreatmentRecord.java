package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "treatment_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TreatmentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "treatment_id", nullable = false)
    private Treatment treatment;

    // Doctor who prescribed this treatment
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "session_date", nullable = false)
    private LocalDateTime sessionDate;

    // Quantity must be >= 1 (business rule 4.5)
    @Column(nullable = false)
    private Integer quantity = 1;

    // Cost snapshot at time of record — important so bill isn't affected
    // if unit_cost changes later in the treatments master table
    @Column(name = "unit_cost_snapshot", nullable = false)
    private Double unitCostSnapshot;

    @Column(columnDefinition = "TEXT")
    private String notes;
}