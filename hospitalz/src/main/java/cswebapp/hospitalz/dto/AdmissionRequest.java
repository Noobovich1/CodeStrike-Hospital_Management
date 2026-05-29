package cswebapp.hospitalz.dto;

import lombok.Data;

@Data
public class AdmissionRequest {
    private String patientId;
    private Long roomId;
    private String notes;
}