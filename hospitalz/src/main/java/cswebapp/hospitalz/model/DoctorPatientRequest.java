package cswebapp.hospitalz.model;

import lombok.Data;

@Data
public class DoctorPatientRequest {
    private String doctorId;
    private String patientId;
    private Boolean isPrimary;
    private String notes;
}