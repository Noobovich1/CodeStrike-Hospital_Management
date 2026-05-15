package cswebapp.hospitalz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;

    // e.g. ICU-01, OT-02, W-201
    @Column(name = "room_number", unique = true, nullable = false, length = 20)
    private String roomNumber;

    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    // Incremented on admit, decremented on discharge
    @Column(name = "current_occupancy")
    private Integer currentOccupancy = 0;

    // Per-day charge used in billing
    @Column(name = "daily_rate", nullable = false)
    private Double dailyRate;

    @Column(name = "status")
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
