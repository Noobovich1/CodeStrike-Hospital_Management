package cswebapp.hospitalz.controller;

import lombok.Data;

@Data
public class PatientProfileUpdateRequest {
    private String fullName;
    private String dateOfBirth; // YYYY-MM-DD
    private String gender;      // MALE, FEMALE, OTHER
    private String phoneNumber;
    private String email;
    private String address;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
