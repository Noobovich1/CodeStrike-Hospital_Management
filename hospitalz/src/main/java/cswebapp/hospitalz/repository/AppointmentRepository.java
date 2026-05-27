package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Appointment;
import cswebapp.hospitalz.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctor_DoctorId(String doctorId);

    List<Appointment> findByPatient_PatientId(String patientId);

    List<Appointment> findByPatient_PatientIdAndStatus(String patientId, AppointmentStatus status);

    List<Appointment> findByPatient_PatientIdAndStatusAndIsBilled(String patientId, AppointmentStatus status, Boolean isBilled);

    List<Appointment> findByDoctor_DoctorIdAndAppointmentDateBetween(String doctorId, LocalDateTime start, LocalDateTime end);

    boolean existsByDoctor_DoctorIdAndStatusNotAndAppointmentDateBetween(String doctorId, AppointmentStatus status, LocalDateTime start, LocalDateTime end);
}
