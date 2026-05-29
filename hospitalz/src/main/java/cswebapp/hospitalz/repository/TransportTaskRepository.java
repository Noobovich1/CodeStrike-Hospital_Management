package cswebapp.hospitalz.repository;

import cswebapp.hospitalz.model.TransportTask;
import cswebapp.hospitalz.model.TransportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportTaskRepository extends JpaRepository<TransportTask, Long> {
    
    // Find tasks by multiple statuses (e.g. active tasks: PENDING, ACCEPTED, IN_PROGRESS)
    List<TransportTask> findByStatusIn(List<TransportStatus> statuses);
    
    // Find active tasks assigned to a specific staff member
    List<TransportTask> findByAssignedStaffStaffIdAndStatusIn(Long staffId, List<TransportStatus> statuses);
}
