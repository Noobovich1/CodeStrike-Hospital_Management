package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.Doctor;
import cswebapp.hospitalz.model.DoctorPatient;
import cswebapp.hospitalz.model.DoctorPatientRequest;
import cswebapp.hospitalz.model.Patient;
import cswebapp.hospitalz.repository.DoctorPatientRepository;
import cswebapp.hospitalz.repository.DoctorRepository;
import cswebapp.hospitalz.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DoctorPatientService {

    @Autowired
    private DoctorPatientRepository doctorPatientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    public DoctorPatient assignDoctorToPatient(DoctorPatientRequest request) {

        // 1. Look up the doctor — throw if not found
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + request.getDoctorId()));

        // 2. Look up the patient — throw if not found
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found: " + request.getPatientId()));

        // 3. Build the junction record
        DoctorPatient assignment = new DoctorPatient();
        assignment.setDoctor(doctor);
        assignment.setPatient(patient);
        assignment.setAssignedDate(LocalDate.now());
        assignment.setIsPrimary(request.getIsPrimary() != null ? request.getIsPrimary() : false);
        assignment.setNotes(request.getNotes());

        return doctorPatientRepository.save(assignment);
    }

    public List<DoctorPatient> getPatientsByDoctor(String doctorId) {
        return doctorPatientRepository.findByDoctor_DoctorId(doctorId);
    }

    public List<DoctorPatient> getDoctorsByPatient(String patientId) {
        return doctorPatientRepository.findByPatient_PatientId(patientId);
    }
}