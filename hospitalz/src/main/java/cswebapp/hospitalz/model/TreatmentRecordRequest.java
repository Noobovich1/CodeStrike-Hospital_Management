package cswebapp.hospitalz.model;

import lombok.Data;

@Data
public class TreatmentRecordRequest {
    private String patientId;
    private Long treatmentId;
    private String doctorId;
    private Integer quantity;
    private String notes;
}