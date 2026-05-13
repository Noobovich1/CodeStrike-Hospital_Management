package cswebapp.hospitalz.service;

import cswebapp.hospitalz.model.Treatment;
import cswebapp.hospitalz.repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TreatmentService {

    @Autowired
    private TreatmentRepository treatmentRepository;

    public Treatment createTreatment(Treatment treatment) {
        treatment.setIsActive(true);
        return treatmentRepository.save(treatment);
    }

    public List<Treatment> getAllTreatments() {
        return treatmentRepository.findAll();
    }

    public List<Treatment> getActiveTreatments() {
        return treatmentRepository.findByIsActiveTrue();
    }

    public Treatment getTreatmentById(Long treatmentId) {
        return treatmentRepository.findById(treatmentId)
                .orElseThrow(() -> new RuntimeException("Treatment not found: " + treatmentId));
    }

    public Treatment updateTreatment(Long treatmentId, Treatment updatedData) {
        Treatment existing = getTreatmentById(treatmentId);

        if (updatedData.getName() != null) existing.setName(updatedData.getName());
        if (updatedData.getCategory() != null) existing.setCategory(updatedData.getCategory());
        if (updatedData.getUnitCost() != null) existing.setUnitCost(updatedData.getUnitCost());
        if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());

        return treatmentRepository.save(existing);
    }

    // Soft delete
    public void deactivateTreatment(Long treatmentId) {
        Treatment existing = getTreatmentById(treatmentId);
        existing.setIsActive(false);
        treatmentRepository.save(existing);
    }
}