package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Room;
import cswebapp.hospitalz.model.RoomStatus;
import cswebapp.hospitalz.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.createRoom(room));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'NURSE', 'WARD_BOY')")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{roomId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'NURSE', 'WARD_BOY')")
    public ResponseEntity<Room> getRoomById(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getRoomById(roomId));
    }

    // GET /api/v1/rooms/available          → all available rooms
    // GET /api/v1/rooms/available?type=icu → available ICU rooms only
    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<List<Room>> getAvailableRooms(
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(roomService.getAvailableRooms(type));
    }

    @PutMapping("/{roomId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long roomId,
            @RequestBody Room updatedData) {
        return ResponseEntity.ok(roomService.updateRoom(roomId, updatedData));
    }

    // Admin manually sets room status (e.g. MAINTENANCE)
    @PatchMapping("/{roomId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'WARD_BOY', 'RECEPTIONIST')")
    public ResponseEntity<Room> setRoomStatus(
            @PathVariable Long roomId,
            @RequestParam RoomStatus status) {
        return ResponseEntity.ok(roomService.setRoomStatus(roomId, status));
    }

    @DeleteMapping("/{roomId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateRoom(@PathVariable Long roomId) {
        roomService.deactivateRoom(roomId);
        return ResponseEntity.ok(Map.of("message", "Room deactivated successfully"));
    }

    @PostMapping("/{roomId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateRoom(@PathVariable Long roomId) {
        roomService.activateRoom(roomId);
        return ResponseEntity.ok(Map.of("message", "Room activated successfully"));
    }
}