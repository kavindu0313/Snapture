package backend.controller;

import backend.model.Feedback;
import backend.repostry.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // Get all feedback
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedback = feedbackRepository.findAll();
        return new ResponseEntity<>(feedback, HttpStatus.OK);
    }

    // Get feedback by ID
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        Optional<Feedback> feedback = feedbackRepository.findById(id);
        if (feedback.isPresent()) {
            return new ResponseEntity<>(feedback.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get feedback by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getFeedbackByUserId(@PathVariable Long userId) {
        List<Feedback> feedback = feedbackRepository.findByUserId(userId);
        return new ResponseEntity<>(feedback, HttpStatus.OK);
    }

    // Submit new feedback
    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody Feedback feedback) {
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setStatus("New");
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    // Update feedback status (admin)
    @PutMapping("/{id}/status")
    public ResponseEntity<Feedback> updateFeedbackStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(id);
        if (feedbackOpt.isPresent()) {
            Feedback feedback = feedbackOpt.get();
            feedback.setStatus(statusUpdate.get("status"));
            Feedback updatedFeedback = feedbackRepository.save(feedback);
            return new ResponseEntity<>(updatedFeedback, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Add admin response to feedback
    @PutMapping("/{id}/respond")
    public ResponseEntity<Feedback> respondToFeedback(
            @PathVariable Long id,
            @RequestBody Map<String, Object> response) {
        
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(id);
        if (feedbackOpt.isPresent()) {
            Feedback feedback = feedbackOpt.get();
            feedback.setAdminResponse((String) response.get("adminResponse"));
            feedback.setAdminId(Long.parseLong(response.get("adminId").toString()));
            feedback.setAdminName((String) response.get("adminName"));
            feedback.setResponseDate(LocalDateTime.now());
            feedback.setStatus("Resolved");
            
            Feedback updatedFeedback = feedbackRepository.save(feedback);
            return new ResponseEntity<>(updatedFeedback, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete feedback
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteFeedback(@PathVariable Long id) {
        Optional<Feedback> feedback = feedbackRepository.findById(id);
        if (feedback.isPresent()) {
            feedbackRepository.delete(feedback.get());
            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", Boolean.TRUE);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get feedback statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getFeedbackStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total feedback count
        stats.put("totalCount", feedbackRepository.count());
        
        // Count by status
        stats.put("newCount", feedbackRepository.findByStatus("New").size());
        stats.put("inProgressCount", feedbackRepository.findByStatus("In Progress").size());
        stats.put("resolvedCount", feedbackRepository.findByStatus("Resolved").size());
        stats.put("closedCount", feedbackRepository.findByStatus("Closed").size());
        
        // Count by category
        stats.put("uiUxCount", feedbackRepository.countByCategory("UI/UX"));
        stats.put("featuresCount", feedbackRepository.countByCategory("Features"));
        stats.put("performanceCount", feedbackRepository.countByCategory("Performance"));
        stats.put("bugReportCount", feedbackRepository.countByCategory("Bug Report"));
        stats.put("otherCount", feedbackRepository.countByCategory("Other"));
        
        // Average ratings
        stats.put("averageRating", feedbackRepository.getAverageRating());
        stats.put("uiUxRating", feedbackRepository.getAverageRatingByCategory("UI/UX"));
        stats.put("featuresRating", feedbackRepository.getAverageRatingByCategory("Features"));
        stats.put("performanceRating", feedbackRepository.getAverageRatingByCategory("Performance"));
        stats.put("bugReportRating", feedbackRepository.getAverageRatingByCategory("Bug Report"));
        stats.put("otherRating", feedbackRepository.getAverageRatingByCategory("Other"));
        
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}
