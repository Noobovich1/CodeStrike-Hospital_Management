package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(
    name = "doctor_patient",
    // Prevent duplicate assignments of same doctor to same patient
    uniqueConstraints = @UniqueConstraint(columnNames = {"doctor_id", "patient_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorPatient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many assignments can reference one doctor
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // Many assignments can reference one patient
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;

    // True = primary doctor, False = consulting doctor
    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
