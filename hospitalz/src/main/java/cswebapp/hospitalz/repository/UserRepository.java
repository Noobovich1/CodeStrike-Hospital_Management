package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    // Tìm username lớn nhất theo prefix — cùng pattern với PatientRepository.findLastPatientIdByPrefix
    // Ví dụ: prefix = "nurse_%" → trả về "nurse_03"
    @Query("SELECT u.username FROM User u WHERE u.username LIKE :prefix ORDER BY u.username DESC LIMIT 1")
    Optional<String> findLastUsernameByPrefix(@Param("prefix") String prefix);
}