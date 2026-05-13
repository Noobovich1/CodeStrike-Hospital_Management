package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "treatments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Treatment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "treatment_id")
    private Long treatmentId;

    // e.g. ECG, Physiotherapy, Blood Test
    @Column(nullable = false, unique = true, length = 255)
    private String name;

    // Diagnostic / Surgical / Medicine
    @Column(length = 100)
    private String category;

    // Cost per session — used in billing
    @Column(name = "unit_cost", nullable = false)
    private Double unitCost;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active")
    private Boolean isActive = true;
}