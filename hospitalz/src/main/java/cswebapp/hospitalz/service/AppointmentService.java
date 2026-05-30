package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.*;
import cswebapp.hospitalz.dto.AppointmentRequest;
import cswebapp.hospitalz.repository.AppointmentRepository;
import cswebapp.hospitalz.repository.DoctorRepository;
import cswebapp.hospitalz.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Transactional
    public Appointment createAppointment(AppointmentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found: " + request.getPatientId()));

        String specialisation = request.getSpecialisation();

        if (specialisation == null || specialisation.trim().isEmpty()) {
            throw new RuntimeException("Specialisation must be specified.");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(null);
        appointment.setSpecialisation(specialisation);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setNotes(request.getNotes());
        appointment.setIsBilled(false);

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment assignDoctor(Long id, String doctorId) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new RuntimeException("Can only assign doctors to PENDING appointments.");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));

        if (!doctor.getSpecialisation().equalsIgnoreCase(appointment.getSpecialisation())) {
            throw new RuntimeException("Doctor specialisation (" + doctor.getSpecialisation()
                    + ") does not match appointment specialisation (" + appointment.getSpecialisation() + ").");
        }

        // Check if doctor has a scheduling conflict (+/- 30 minutes, exclusive range check)
        LocalDateTime start = appointment.getAppointmentDate().minusMinutes(30);
        LocalDateTime end = appointment.getAppointmentDate().plusMinutes(30);
        boolean isBusy = appointmentRepository.existsByDoctor_DoctorIdAndStatusNotAndAppointmentDateAfterAndAppointmentDateBefore(
                doctorId, AppointmentStatus.CANCELLED, start, end);

        if (isBusy) {
            throw new RuntimeException(
                    "Doctor " + doctor.getFullName() + " already has an appointment around this time.");
        }

        appointment.setDoctor(doctor);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findByDoctor_DoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatient_PatientId(patientId);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Transactional
    public Appointment updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}
