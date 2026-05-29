package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.*;
import cswebapp.hospitalz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class TransportTaskService {

    @Autowired
    private TransportTaskRepository transportTaskRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AdmissionRepository admissionRepository;

    public TransportTask createTask(TransportTask task) {
        // Validate patient exists
        Patient patient = patientRepository.findById(task.getPatient().getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found: " + task.getPatient().getPatientId()));
        task.setPatient(patient);

        // Validate toRoom exists
        Room toRoom = roomRepository.findById(task.getToRoom().getRoomId())
                .orElseThrow(() -> new RuntimeException("Destination room not found: " + task.getToRoom().getRoomId()));
        task.setToRoom(toRoom);

        // Optional: validate fromRoom if provided
        if (task.getFromRoom() != null && task.getFromRoom().getRoomId() != null) {
            Room fromRoom = roomRepository.findById(task.getFromRoom().getRoomId())
                    .orElseThrow(() -> new RuntimeException("Source room not found: " + task.getFromRoom().getRoomId()));
            task.setFromRoom(fromRoom);
        } else {
            // Auto-fill fromRoom from active admission if available
            Optional<Admission> activeAdmission = admissionRepository.findByPatient_PatientIdAndStatus(
                    patient.getPatientId(), AdmissionStatus.ACTIVE);
            if (activeAdmission.isPresent()) {
                task.setFromRoom(activeAdmission.get().getRoom());
            }
        }

        task.setStatus(TransportStatus.PENDING);
        task.setCreatedAt(LocalDateTime.now());
        return transportTaskRepository.save(task);
    }

    public List<TransportTask> getActiveTasks() {
        return transportTaskRepository.findByStatusIn(Arrays.asList(
                TransportStatus.PENDING,
                TransportStatus.ACCEPTED,
                TransportStatus.IN_PROGRESS
        ));
    }

    public TransportTask updateTaskStatus(Long taskId, TransportStatus status, String staffId) {
        TransportTask task = transportTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Transport task not found: " + taskId));

        task.setStatus(status);

        if (status == TransportStatus.ACCEPTED) {
            if (staffId != null && !staffId.isBlank()) {
                Staff staff = staffRepository.findById(staffId)
                        .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));
                task.setAssignedStaff(staff);
            }
        } else if (status == TransportStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
        }

        return transportTaskRepository.save(task);
    }
}
