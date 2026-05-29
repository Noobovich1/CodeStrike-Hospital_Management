package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.AdmissionStatus;
import cswebapp.hospitalz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdmissionRepository admissionRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private PatientRepository patientRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Active admissions count
        stats.put("activeAdmissions",
                admissionRepository.countByStatus(AdmissionStatus.ACTIVE));

        // Available rooms count
        stats.put("availableRooms",
                roomRepository.countAllAvailableRooms());

        // Active doctors count
        stats.put("activeDoctors",
                doctorRepository.countByIsActiveTrue());

        // Total revenue from paid + partial bills
        stats.put("totalRevenue", billRepository.sumPaidAmount());

        // Room occupancy by type for chart
        var rooms = roomRepository.findAll();
        Map<String, Map<String, Integer>> occupancyByType = new HashMap<>();
        rooms.forEach(r -> {
            String type = r.getRoomType().name();
            occupancyByType.putIfAbsent(type, new HashMap<>());
            occupancyByType.get(type).merge("capacity", r.getCapacity(), Integer::sum);
            occupancyByType.get(type).merge("occupied", r.getCurrentOccupancy(), Integer::sum);
        });
        stats.put("roomOccupancy", occupancyByType);

        // Bills for revenue chart
        stats.put("bills", billRepository.findBillSummaryForChart());

        return ResponseEntity.ok(stats);
    }
}