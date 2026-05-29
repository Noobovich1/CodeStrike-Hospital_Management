package cswebapp.hospitalz.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    // FK thật tới bảng patients — DB-level constraint
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Patient patient;

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

