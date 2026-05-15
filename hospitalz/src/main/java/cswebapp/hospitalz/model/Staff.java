package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Staff {

    @Id
    @Column(name = "staff_id", length = 20, updatable = false)
    private String staffId;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false)
    private StaffRole role;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    // Which ward/wing they are assigned to
    @Column(name = "assigned_ward", length = 100)
    private String assignedWard;

    @Column(name = "shift")
    private Shift shift;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}