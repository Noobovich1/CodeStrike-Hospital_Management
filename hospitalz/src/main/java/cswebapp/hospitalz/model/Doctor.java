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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

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
    private java.math.BigDecimal consultationFee;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @PrePersist
    @PreUpdate
    private void validateFields() {
        if (email != null && !email.isBlank()) {
            if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")) {
                throw new IllegalArgumentException("Invalid email format: " + email);
            }
        }
        if (phoneNumber != null) {
            if (!phoneNumber.matches("^[+]?[0-9]{8,15}$")) {
                throw new IllegalArgumentException("Invalid phone number format: " + phoneNumber);
            }
        }
    }
}
