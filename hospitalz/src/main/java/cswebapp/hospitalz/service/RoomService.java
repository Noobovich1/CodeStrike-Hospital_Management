package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.Room;
import cswebapp.hospitalz.model.RoomStatus;
import cswebapp.hospitalz.model.RoomType;
import cswebapp.hospitalz.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room createRoom(Room room) {
        // New rooms always start available with 0 occupancy
        room.setCurrentOccupancy(0);
        room.setStatus(RoomStatus.AVAILABLE);
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));
    }

    public List<Room> getRoomsByType(RoomType roomType) {
        return roomRepository.findByRoomType(roomType);
    }

    // Called by the receptionist before admitting — returns rooms that can take a patient
    public List<Room> getAvailableRooms(String type) {
        if (type == null || type.isBlank()) {
            return roomRepository.findAllAvailableRooms();
        }
        RoomType roomType = RoomType.valueOf(type.toUpperCase());
        return roomRepository.findAvailableRoomsByType(roomType);
    }

    public Room updateRoom(Long roomId, Room updatedData) {
        Room existing = getRoomById(roomId);

        if (updatedData.getRoomNumber() != null) existing.setRoomNumber(updatedData.getRoomNumber());
        if (updatedData.getRoomType() != null) existing.setRoomType(updatedData.getRoomType());
        if (updatedData.getFloor() != null) existing.setFloor(updatedData.getFloor());
        if (updatedData.getCapacity() != null) existing.setCapacity(updatedData.getCapacity());
        if (updatedData.getDailyRate() != null) existing.setDailyRate(updatedData.getDailyRate());
        if (updatedData.getNotes() != null) existing.setNotes(updatedData.getNotes());

        return roomRepository.save(existing);
    }

    // Admin can manually set a room to MAINTENANCE (e.g. for cleaning after discharge)
    public Room setRoomStatus(Long roomId, RoomStatus status) {
        Room room = getRoomById(roomId);
        room.setStatus(status);
        return roomRepository.save(room);
    }

    // ── These two methods will be called by AdmissionService, not directly by API ──

    // Called when a patient is admitted to this room
    public void incrementOccupancy(Room room) {
        room.setCurrentOccupancy(room.getCurrentOccupancy() + 1);

        // If now full, mark OCCUPIED
        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            room.setStatus(RoomStatus.OCCUPIED);
        }

        roomRepository.save(room);
    }

    // Called when a patient is discharged from this room
    public void decrementOccupancy(Room room) {
        int newOccupancy = Math.max(0, room.getCurrentOccupancy() - 1);
        room.setCurrentOccupancy(newOccupancy);

        // If there's now space, mark AVAILABLE again
        if (newOccupancy < room.getCapacity()) {
            room.setStatus(RoomStatus.AVAILABLE);
        }

        roomRepository.save(room);
    }
}