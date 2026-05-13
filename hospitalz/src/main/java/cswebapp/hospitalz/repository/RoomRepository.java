package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Room;
import cswebapp.hospitalz.model.RoomStatus;
import cswebapp.hospitalz.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // All rooms of a specific type
    List<Room> findByRoomType(RoomType roomType);

    // All rooms with a specific status
    List<Room> findByStatus(RoomStatus status);

    // The key availability query:
    // available = status is AVAILABLE AND occupancy has not hit capacity
    @Query("SELECT r FROM Room r WHERE r.roomType = :roomType " +
           "AND r.status = cswebapp.hospitalz.model.RoomStatus.AVAILABLE " +
           "AND r.currentOccupancy < r.capacity")
    List<Room> findAvailableRoomsByType(RoomType roomType);

    // All available rooms regardless of type
    @Query("SELECT r FROM Room r WHERE r.status = cswebapp.hospitalz.model.RoomStatus.AVAILABLE " +
           "AND r.currentOccupancy < r.capacity")
    List<Room> findAllAvailableRooms();
}