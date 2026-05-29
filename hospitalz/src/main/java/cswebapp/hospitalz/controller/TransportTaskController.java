package cswebapp.hospitalz.controller;

import cswebapp.hospitalz.model.TransportTask;
import cswebapp.hospitalz.model.TransportStatus;
import cswebapp.hospitalz.service.TransportTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transport-tasks")
public class TransportTaskController {

    @Autowired
    private TransportTaskService transportTaskService;

    @PostMapping
    public ResponseEntity<TransportTask> createTask(@RequestBody TransportTask task) {
        return ResponseEntity.ok(transportTaskService.createTask(task));
    }

    @GetMapping("/active")
    public ResponseEntity<List<TransportTask>> getActiveTasks() {
        return ResponseEntity.ok(transportTaskService.getActiveTasks());
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TransportTask> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam TransportStatus status,
            @RequestParam(required = false) String staffId) {
        return ResponseEntity.ok(transportTaskService.updateTaskStatus(taskId, status, staffId));
    }
}
