package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "transport_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long taskId;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"admissions", "treatmentRecords", "hibernateLazyInitializer"})
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "from_room_id")
    @JsonIgnoreProperties({"admissions", "hibernateLazyInitializer"})
    private Room fromRoom;

    @ManyToOne
    @JoinColumn(name = "to_room_id", nullable = false)
    @JsonIgnoreProperties({"admissions", "hibernateLazyInitializer"})
    private Room toRoom;

    @Column(name = "status")
    @Enumerated(EnumType.ORDINAL)
    private TransportStatus status = TransportStatus.PENDING;

    @Column(name = "requested_by", nullable = false)
    private String requestedBy;

    @ManyToOne
    @JoinColumn(name = "assigned_staff_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Staff assignedStaff;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
