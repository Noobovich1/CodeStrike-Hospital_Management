package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.Staff;
import cswebapp.hospitalz.model.StaffRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String> {

    List<Staff> findByRole(StaffRole role);

    List<Staff> findByAssignedWardIgnoreCase(String assignedWard);

    List<Staff> findByIsActiveTrue();
}