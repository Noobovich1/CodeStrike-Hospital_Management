package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vitals_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VitalsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false, length = 20)
    private String patientId;

    @Column(name = "blood_pressure", length = 20)
    private String bloodPressure;

    private Double temperature;

    private Integer pulse;

    @Column(name = "oxygen_level")
    private Integer oxygenLevel;

    @Column(name = "recorded_by", length = 50)
    private String recordedBy;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();
}
