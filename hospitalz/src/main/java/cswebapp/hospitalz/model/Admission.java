package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "admissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admission_id")
    private Long admissionId;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "admission_date", nullable = false)
    private LocalDateTime admissionDate;

    // NULL while patient is still admitted
    @Column(name = "discharge_date")
    private LocalDateTime dischargeDate;

    // Calculated on discharge
    @Column(name = "total_days")
    private Integer totalDays;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AdmissionStatus status = AdmissionStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}