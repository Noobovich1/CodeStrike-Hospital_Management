package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.*;
import cswebapp.hospitalz.repository.AdmissionRepository;
import cswebapp.hospitalz.repository.PatientRepository;
import cswebapp.hospitalz.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AdmissionService {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomService roomService;

    // ── ADMIT PATIENT ──────────────────────────────────────────────────────
    @Transactional
    public Admission admitPatient(AdmissionRequest request) {

        // 1. Find patient
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found: " + request.getPatientId()));

        // 2. Check patient isn't already admitted
        if (patient.getStatus() == PatientStatus.ADMITTED) {
            throw new RuntimeException("Patient " + request.getPatientId() + " is already admitted.");
        }

        // 3. Find room
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found: " + request.getRoomId()));

        // 4. Check room availability — this is the business rule from section 4.3
        if (room.getStatus() == RoomStatus.MAINTENANCE) {
            throw new RuntimeException("Room " + room.getRoomNumber() + " is under maintenance.");
        }
        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            throw new RuntimeException("Room " + room.getRoomNumber() + " is at full capacity.");
        }

        // 5. Build admission record
        Admission admission = new Admission();
        admission.setPatient(patient);
        admission.setRoom(room);
        admission.setAdmissionDate(LocalDateTime.now());
        admission.setStatus(AdmissionStatus.ACTIVE);
        admission.setNotes(request.getNotes());
        admission.setCreatedAt(LocalDateTime.now());

        // 6. Increment room occupancy
        roomService.incrementOccupancy(room);

        // 7. Update patient status to ADMITTED
        patient.setStatus(PatientStatus.ADMITTED);
        patientRepository.save(patient);

        // 8. Save and return admission
        return admissionRepository.save(admission);
    }

    // ── DISCHARGE PATIENT ──────────────────────────────────────────────────
    @Transactional
    public Admission dischargePatient(Long admissionId) {

        // 1. Find the admission
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found: " + admissionId));

        // 2. Make sure it's still active
        if (admission.getStatus() == AdmissionStatus.DISCHARGED) {
            throw new RuntimeException("Admission " + admissionId + " is already discharged.");
        }

        // 3. Set discharge date and calculate total days
        LocalDateTime dischargeDate = LocalDateTime.now();
        admission.setDischargeDate(dischargeDate);

        long daysBetween = ChronoUnit.DAYS.between(
                admission.getAdmissionDate(), dischargeDate);

        // Minimum 1 day billed (business rule from section 4.2)
        admission.setTotalDays((int) Math.max(1, daysBetween));
        admission.setStatus(AdmissionStatus.DISCHARGED);

        // 4. Decrement room occupancy
        roomService.decrementOccupancy(admission.getRoom());

        // 5. Update patient status to DISCHARGED
        Patient patient = admission.getPatient();
        patient.setStatus(PatientStatus.DISCHARGED);
        patientRepository.save(patient);

        // 6. Save admission (Bill will be generated separately via BillService)
        return admissionRepository.save(admission);
    }

    // ── QUERIES ────────────────────────────────────────────────────────────
    public Admission getAdmissionById(Long admissionId) {
        return admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found: " + admissionId));
    }

    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    public List<Admission> getActiveAdmissions() {
        return admissionRepository.findByStatus(AdmissionStatus.ACTIVE);
    }

    public List<Admission> getAdmissionsByPatient(String patientId) {
        return admissionRepository.findByPatient_PatientId(patientId);
    }
}