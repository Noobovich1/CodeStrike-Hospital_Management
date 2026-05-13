package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.*;
import cswebapp.hospitalz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TreatmentRecordService {

    @Autowired
    private TreatmentRecordRepository treatmentRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private TreatmentRepository treatmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public TreatmentRecord prescribeTreatment(TreatmentRecordRequest request) {

        // 1. Find patient
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found: " + request.getPatientId()));

        // 2. Find treatment from master list
        Treatment treatment = treatmentRepository.findById(request.getTreatmentId())
                .orElseThrow(() -> new RuntimeException("Treatment not found: " + request.getTreatmentId()));

        // 3. Find prescribing doctor
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + request.getDoctorId()));

        // 4. Validate quantity (business rule 4.5)
        int quantity = (request.getQuantity() != null && request.getQuantity() >= 1)
                ? request.getQuantity() : 1;

        // 5. Build record — snapshot the cost NOW so future price changes don't affect this bill
        TreatmentRecord record = new TreatmentRecord();
        record.setPatient(patient);
        record.setTreatment(treatment);
        record.setDoctor(doctor);
        record.setSessionDate(LocalDateTime.now());
        record.setQuantity(quantity);
        record.setUnitCostSnapshot(treatment.getUnitCost()); // snapshot!
        record.setNotes(request.getNotes());

        return treatmentRecordRepository.save(record);
    }

    public List<TreatmentRecord> getRecordsByPatient(String patientId) {
        return treatmentRecordRepository.findByPatient_PatientId(patientId);
    }

    public List<TreatmentRecord> getRecordsByDoctor(String doctorId) {
        return treatmentRecordRepository.findByDoctor_DoctorId(doctorId);
    }

    public Double getTotalTreatmentCostForPatient(String patientId) {
        return treatmentRecordRepository.sumTreatmentCostByPatient(patientId);
    }
}