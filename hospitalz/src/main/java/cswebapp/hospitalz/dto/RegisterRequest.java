package cswebapp.hospitalz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String role; // Mặc định sẽ là PATIENT nếu không truyền
    private String fullName;
    private String dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String email;
}