package cswebapp.hospitalz.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    private String patientId;
    private String specialisation;
    private LocalDateTime appointmentDate;
    private String notes;
}
