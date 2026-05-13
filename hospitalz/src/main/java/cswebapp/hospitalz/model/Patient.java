package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "patients")
@Data // Getters, Setters, toString, etc.
@NoArgsConstructor // empty constructor
@AllArgsConstructor // full constructor
public class Patient {

    // Note: PDF says VARCHAR(12) e.g. PAT-2024-0001. 
    // We do NOT use @GeneratedValue here because we will generate this custom string manually later.
    @Id
    @Column(name = "patient_id", length = 20, updatable = false)
    private String patientId;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @Column(name = "phone_number", nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @Column(length = 255)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "emergency_contact_name", length = 255)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 15)
    private String emergencyContactPhone;

    @Column(name = "disease_description", columnDefinition = "TEXT")
    private String diseaseDescription;

    @Column(name = "current_treatment_notes", columnDefinition = "TEXT")
    private String currentTreatmentNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PatientStatus status = PatientStatus.OUTPATIENT;
}