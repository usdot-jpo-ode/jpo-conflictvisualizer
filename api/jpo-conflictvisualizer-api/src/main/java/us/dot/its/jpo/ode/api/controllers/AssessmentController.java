package us.dot.its.jpo.ode.api.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.fasterxml.jackson.databind.ObjectMapper;

import us.dot.its.jpo.conflictmonitor.monitor.models.assessments.ConnectionOfTravelAssessment;
import us.dot.its.jpo.conflictmonitor.monitor.models.assessments.LaneDirectionOfTravelAssessment;
import us.dot.its.jpo.conflictmonitor.monitor.models.assessments.SignalStateAssessment;
import us.dot.its.jpo.conflictmonitor.monitor.models.assessments.StopLinePassageAssessment;
import us.dot.its.jpo.ode.api.ConflictMonitorApiProperties;
import us.dot.its.jpo.ode.api.accessors.assessments.ConnectionOfTravelAssessment.ConnectionOfTravelAssessmentRepository;
import us.dot.its.jpo.ode.api.accessors.assessments.LaneDirectionOfTravelAssessment.LaneDirectionOfTravelAssessmentRepository;
import us.dot.its.jpo.ode.api.accessors.assessments.SignalStateAssessment.StopLinePassageAssessmentRepository;
import us.dot.its.jpo.ode.api.accessors.assessments.SignalStateEventAssessment.SignalStateEventAssessmentRepository;
import us.dot.its.jpo.ode.mockdata.MockAssessmentGenerator;

@RestController
public class AssessmentController {

    @Autowired
    LaneDirectionOfTravelAssessmentRepository laneDirectionOfTravelAssessmentRepo;

    @Autowired
    ConnectionOfTravelAssessmentRepository connectionOfTravelAssessmentRepo;

    @Autowired
    StopLinePassageAssessmentRepository signalStateAssessmentRepo;

    @Autowired
    SignalStateEventAssessmentRepository signalStateEventAssessmentRepo;

    @Autowired
    ConflictMonitorApiProperties props;

    private static final Logger logger = LoggerFactory.getLogger(AssessmentController.class);

    ObjectMapper objectMapper = new ObjectMapper();

    public String getCurrentTime() {
        return ZonedDateTime.now().toInstant().toEpochMilli() + "";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/assessments/connection_of_travel", method = RequestMethod.GET, produces = "application/json")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    public ResponseEntity<List<ConnectionOfTravelAssessment>> findConnectionOfTravelAssessment(
            @RequestParam(name = "road_regulator_id", required = false) Integer roadRegulatorID,
            @RequestParam(name = "intersection_id", required = false) Integer intersectionID,
            @RequestParam(name = "start_time_utc_millis", required = false) Long startTime,
            @RequestParam(name = "end_time_utc_millis", required = false) Long endTime,
            @RequestParam(name = "latest", required = false, defaultValue = "false") boolean latest,
            @RequestParam(name = "test", required = false, defaultValue = "false") boolean testData) {

        if (testData) {
            List<ConnectionOfTravelAssessment> list = new ArrayList<>();
            list.add(MockAssessmentGenerator.getConnectionOfTravelAssessment());
            return ResponseEntity.ok(list);
        } else {
            Query query = connectionOfTravelAssessmentRepo.getQuery(intersectionID, startTime, endTime, latest);
            long count = connectionOfTravelAssessmentRepo.getQueryResultCount(query);
            logger.info("Returning ProcessedMap Response with Size: " + count);
            return ResponseEntity.ok(connectionOfTravelAssessmentRepo.find(query));
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/assessments/lane_direction_of_travel", method = RequestMethod.GET, produces = "application/json")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    public ResponseEntity<List<LaneDirectionOfTravelAssessment>> findLaneDirectionOfTravelAssessment(
            @RequestParam(name = "road_regulator_id", required = false) Integer roadRegulatorID,
            @RequestParam(name = "intersection_id", required = false) Integer intersectionID,
            @RequestParam(name = "start_time_utc_millis", required = false) Long startTime,
            @RequestParam(name = "end_time_utc_millis", required = false) Long endTime,
            @RequestParam(name = "latest", required = false, defaultValue = "false") boolean latest,
            @RequestParam(name = "test", required = false, defaultValue = "false") boolean testData) {

        if (testData) {
            List<LaneDirectionOfTravelAssessment> list = new ArrayList<>();
            list.add(MockAssessmentGenerator.getLaneDirectionOfTravelAssessment());
            return ResponseEntity.ok(list);
        } else {
            Query query = laneDirectionOfTravelAssessmentRepo.getQuery(intersectionID, startTime, endTime, latest);
            long count = laneDirectionOfTravelAssessmentRepo.getQueryResultCount(query);
            logger.info("Returning LaneDirectionOfTravelAssessment Response with Size: " + count);
            return ResponseEntity.ok(laneDirectionOfTravelAssessmentRepo.find(query));
        }

    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/assessments/signal_state_assessment", method = RequestMethod.GET, produces = "application/json")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    public ResponseEntity<List<SignalStateAssessment>> findSignalStateAssessment(
            @RequestParam(name = "road_regulator_id", required = false) Integer roadRegulatorID,
            @RequestParam(name = "intersection_id", required = false) Integer intersectionID,
            @RequestParam(name = "start_time_utc_millis", required = false) Long startTime,
            @RequestParam(name = "end_time_utc_millis", required = false) Long endTime,
            @RequestParam(name = "latest", required = false, defaultValue = "false") boolean latest,
            @RequestParam(name = "test", required = false, defaultValue = "false") boolean testData) {

        if (testData) {
            List<SignalStateAssessment> list = new ArrayList<>();
            list.add(MockAssessmentGenerator.getSignalStateAssessment());
            return ResponseEntity.ok(list);
        } else {
            
            Query query = signalStateAssessmentRepo.getQuery(intersectionID, startTime, endTime, latest);
            long count = signalStateAssessmentRepo.getQueryResultCount(query);
            System.out.println("Returning SignalStateAssessment Response with Size: " + count);
            logger.info("Returning SignalStateAssessment Response with Size: " + count);
            return ResponseEntity.ok(signalStateAssessmentRepo.find(query));
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/assessments/signal_state_event_assessment", method = RequestMethod.GET, produces = "application/json")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    public ResponseEntity<List<StopLinePassageAssessment>> findSignalStateEventAssessment(
            @RequestParam(name = "road_regulator_id", required = false) Integer roadRegulatorID,
            @RequestParam(name = "intersection_id", required = false) Integer intersectionID,
            @RequestParam(name = "start_time_utc_millis", required = false) Long startTime,
            @RequestParam(name = "end_time_utc_millis", required = false) Long endTime,
            @RequestParam(name = "latest", required = false, defaultValue = "false") boolean latest,
            @RequestParam(name = "test", required = false, defaultValue = "false") boolean testData) {

        if (testData) {
            List<StopLinePassageAssessment> list = new ArrayList<>();
            list.add(MockAssessmentGenerator.getSignalStateEventAssessment());
            return ResponseEntity.ok(list);
        } else {
            Query query = signalStateEventAssessmentRepo.getQuery(intersectionID, startTime, endTime, latest);
            long count = signalStateEventAssessmentRepo.getQueryResultCount(query);
            logger.info("Returning SignalStateEventAssessment Response with Size: " + count);
            return ResponseEntity.ok(signalStateEventAssessmentRepo.find(query));
        }
    }

}