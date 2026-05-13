package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @Column(name = "doctor_id", length = 20, updatable = false)
    private String doctorId;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "specialisation", nullable = false, length = 100)
    private String specialisation;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(length = 255, unique = true)
    private String email;

    @Column(length = 255)
    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "consultation_fee", nullable = false)
    private Double consultationFee;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
