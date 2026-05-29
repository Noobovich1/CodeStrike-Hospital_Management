package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Staff;
import cswebapp.hospitalz.model.StaffRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String> {

    List<Staff> findByRole(StaffRole role);

    List<Staff> findByAssignedWardIgnoreCase(String assignedWard);

    List<Staff> findByIsActiveTrue();

    Optional<Staff> findByUser_Id(Long userId);

    // Tìm staff ID lớn nhất theo prefix — cùng pattern với PatientRepository.findLastPatientIdByPrefix
    // Ví dụ: prefix = "NRS-2026-%" → trả về "NRS-2026-0003"
    @Query("SELECT s.staffId FROM Staff s WHERE s.staffId LIKE :prefix ORDER BY s.staffId DESC LIMIT 1")
    Optional<String> findLastStaffIdByPrefix(@Param("prefix") String prefix);
}