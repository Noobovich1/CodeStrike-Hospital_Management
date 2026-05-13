package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.Room;
import cswebapp.hospitalz.model.RoomStatus;
import cswebapp.hospitalz.model.RoomType;
import cswebapp.hospitalz.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.createRoom(room));
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getRoomById(roomId));
    }

    // GET /api/v1/rooms/available          → all available rooms
    // GET /api/v1/rooms/available?type=icu → available ICU rooms only
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms(
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(roomService.getAvailableRooms(type));
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long roomId,
            @RequestBody Room updatedData) {
        return ResponseEntity.ok(roomService.updateRoom(roomId, updatedData));
    }

    // Admin manually sets room status (e.g. MAINTENANCE)
    @PatchMapping("/{roomId}/status")
    public ResponseEntity<Room> setRoomStatus(
            @PathVariable Long roomId,
            @RequestParam RoomStatus status) {
        return ResponseEntity.ok(roomService.setRoomStatus(roomId, status));
    }
}