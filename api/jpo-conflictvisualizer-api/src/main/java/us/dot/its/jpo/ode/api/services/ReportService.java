package us.dot.its.jpo.ode.api.services;

import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import us.dot.its.jpo.conflictmonitor.monitor.models.assessments.LaneDirectionOfTravelAssessment;
import us.dot.its.jpo.conflictmonitor.monitor.models.assessments.LaneDirectionOfTravelAssessmentGroup;
import us.dot.its.jpo.conflictmonitor.monitor.models.events.StopLinePassageEvent;
import us.dot.its.jpo.conflictmonitor.monitor.models.events.StopLineStopEvent;
import us.dot.its.jpo.conflictmonitor.monitor.models.events.minimum_data.MapMinimumDataEvent;
import us.dot.its.jpo.conflictmonitor.monitor.models.events.minimum_data.SpatMinimumDataEvent;
import us.dot.its.jpo.geojsonconverter.pojos.geojson.LineString;
import us.dot.its.jpo.geojsonconverter.pojos.geojson.map.ProcessedMap;
import us.dot.its.jpo.ode.api.ReportBuilder;
import us.dot.its.jpo.ode.api.accessors.assessments.ConnectionOfTravelAssessment.ConnectionOfTravelAssessmentRepository;
import us.dot.its.jpo.ode.api.accessors.assessments.LaneDirectionOfTravelAssessment.LaneDirectionOfTravelAssessmentRepository;
import us.dot.its.jpo.ode.api.accessors.assessments.SignalStateAssessment.StopLineStopAssessmentRepository;
import us.dot.its.jpo.ode.api.accessors.assessments.SignalStateEventAssessment.SignalStateEventAssessmentRepository;
import us.dot.its.jpo.ode.api.accessors.events.ConnectionOfTravelEvent.ConnectionOfTravelEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.IntersectionReferenceAlignmentEvent.IntersectionReferenceAlignmentEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.LaneDirectionOfTravelEvent.LaneDirectionOfTravelEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.MapBroadcastRateEvents.MapBroadcastRateEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.MapMinimumDataEvent.MapMinimumDataEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.SignalGroupAlignmentEvent.SignalGroupAlignmentEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.SignalStateConflictEvent.SignalStateConflictEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.SignalStateEvent.SignalStateEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.SignalStateStopEvent.SignalStateStopEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.SpatBroadcastRateEvent.SpatBroadcastRateEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.SpatMinimumDataEvent.SpatMinimumDataEventRepository;
import us.dot.its.jpo.ode.api.accessors.events.TimeChangeDetailsEvent.TimeChangeDetailsEventRepository;
import us.dot.its.jpo.ode.api.accessors.map.ProcessedMapRepository;

import us.dot.its.jpo.ode.api.accessors.reports.ReportRepository;
import us.dot.its.jpo.ode.api.accessors.spat.ProcessedSpatRepository;
import us.dot.its.jpo.ode.api.models.ChartData;
import us.dot.its.jpo.ode.api.models.ConnectionData;
import us.dot.its.jpo.ode.api.models.ConnectionOfTravelData;
import us.dot.its.jpo.ode.api.models.DailyData;
import us.dot.its.jpo.ode.api.models.IDCount;
import us.dot.its.jpo.ode.api.models.LaneConnectionCount;
import us.dot.its.jpo.ode.api.models.LaneDirectionOfTravelReportData;
import us.dot.its.jpo.ode.api.models.ReportDocument;
import us.dot.its.jpo.ode.api.models.StopLinePassageReportData;
import us.dot.its.jpo.ode.api.models.StopLineStopReportData;

@Service
public class ReportService {

    @Autowired
    ProcessedMapRepository processedMapRepo;

    @Autowired
    ProcessedSpatRepository processedSpatRepo;

    @Autowired
    SignalStateEventRepository signalStateEventRepo;

    @Autowired
    SignalStateStopEventRepository signalStateStopEventRepo;

    @Autowired
    ConnectionOfTravelEventRepository connectionOfTravelEventRepo;

    @Autowired
    IntersectionReferenceAlignmentEventRepository intersectionReferenceAlignmentEventRepo;

    @Autowired
    LaneDirectionOfTravelEventRepository laneDirectionOfTravelEventRepo;

    @Autowired
    SignalGroupAlignmentEventRepository signalGroupAlignmentEventRepo;

    @Autowired
    SignalStateConflictEventRepository signalStateConflictEventRepo;

    @Autowired
    TimeChangeDetailsEventRepository timeChangeDetailsEventRepo;

    @Autowired
    LaneDirectionOfTravelAssessmentRepository laneDirectionOfTravelAssessmentRepo;

    @Autowired
    ConnectionOfTravelAssessmentRepository connectionOfTravelAssessmentRepo;

    @Autowired
    StopLineStopAssessmentRepository signalStateAssessmentRepo;

    @Autowired
    SignalStateEventAssessmentRepository signalStateEventAssessmentRepo;

    @Autowired
    SpatMinimumDataEventRepository spatMinimumDataEventRepo;

    @Autowired
    MapMinimumDataEventRepository mapMinimumDataEventRepo;

    @Autowired
    SpatBroadcastRateEventRepository spatBroadcastRateEventRepo;

    @Autowired
    MapBroadcastRateEventRepository mapBroadcastRateEventRepo;

    @Autowired
    ReportRepository reportRepo;

    private List<String> cleanMissingElements(List<String> elements, boolean isMap) {
        return elements.stream()
                .filter(element -> !(isMap && element.contains("connectsTo")))
                .map(element -> element.trim())
                .collect(Collectors.toList());
    }

    public ReportDocument buildReport(int intersectionID, String roadRegulatorID, long startTime, long endTime) {

        String reportName = "CmReport_" + intersectionID + "_" + roadRegulatorID + "_" + startTime + "_" + endTime;

        // Lane Direction of Travel Info
        List<IDCount> laneDirectionOfTravelEventCounts = laneDirectionOfTravelEventRepo
                .getLaneDirectionOfTravelEventsByDay(intersectionID, startTime, endTime);
        List<IDCount> laneDirectionOfTravelMedianDistanceDistribution = laneDirectionOfTravelEventRepo
                .getMedianDistanceByFoot(intersectionID, startTime, endTime);
        List<IDCount> laneDirectionOfTravelMedianHeadingDistribution = laneDirectionOfTravelEventRepo
                .getMedianDistanceByDegree(intersectionID, startTime, endTime);
        List<LaneDirectionOfTravelAssessment> laneDirectionOfTravelAssessmentCount = laneDirectionOfTravelAssessmentRepo
                .getLaneDirectionOfTravelOverTime(intersectionID, startTime, endTime);

        // Connection of Travel Info
        List<IDCount> connectionOfTravelEventCounts = connectionOfTravelEventRepo
                .getConnectionOfTravelEventsByDay(intersectionID, startTime, endTime);
        List<LaneConnectionCount> laneConnectionCounts = connectionOfTravelEventRepo
                .getConnectionOfTravelEventsByConnection(intersectionID, startTime, endTime);

        // Retrieve the most recent ProcessedMap
        List<ProcessedMap<LineString>> processedMaps = processedMapRepo
                .findProcessedMaps(processedMapRepo.getQuery(intersectionID, null, null, true, true));
        ProcessedMap<LineString> mostRecentProcessedMap = processedMaps.isEmpty() ? null : processedMaps.get(0);

        // Process connection of travel data
        List<ConnectionData> validConnectionOfTravelData = new ArrayList<>();
        List<ConnectionData> invalidConnectionOfTravelData = new ArrayList<>();
        if (mostRecentProcessedMap != null && !laneConnectionCounts.isEmpty()) {
            ConnectionOfTravelData connectionData = ConnectionOfTravelData
                    .processConnectionOfTravelData(laneConnectionCounts, mostRecentProcessedMap);
            validConnectionOfTravelData = connectionData.getValidConnections();
            invalidConnectionOfTravelData = connectionData.getInvalidConnections();
        }

        // Signal State Event Counts
        List<IDCount> signalstateEventCounts = signalStateEventRepo.getSignalStateEventsByDay(intersectionID, startTime,
                endTime);

        // Signal state Stop Events
        List<IDCount> signalStateStopEventCounts = signalStateStopEventRepo
                .getSignalStateStopEventsByDay(intersectionID, startTime, endTime);

        // Signal state Conflict Events
        List<IDCount> signalStateConflictEventCounts = signalStateConflictEventRepo
                .getSignalStateConflictEventsByDay(intersectionID, startTime, endTime);

        // Time Change Details Events
        List<IDCount> timeChangeDetailsEventCounts = timeChangeDetailsEventRepo
                .getTimeChangeDetailsEventsByDay(intersectionID, startTime, endTime);

        // Intersection Reference Alignment Event Counts
        List<IDCount> intersectionReferenceAlignmentEventCounts = intersectionReferenceAlignmentEventRepo
                .getIntersectionReferenceAlignmentEventsByDay(intersectionID, startTime, endTime);

        // Map / Spat counts
        List<IDCount> mapMinimumDataEventCount = mapMinimumDataEventRepo.getMapMinimumDataEventsByDay(intersectionID,
                startTime, endTime);
        List<IDCount> spatMinimumDataEventCount = spatMinimumDataEventRepo.getSpatMinimumDataEventsByDay(intersectionID,
                startTime, endTime);

        List<IDCount> mapBroadcastRateEventCount = mapBroadcastRateEventRepo
                .getMapBroadcastRateEventsByDay(intersectionID, startTime, endTime);
        List<IDCount> spatBroadcastRateEventCount = spatBroadcastRateEventRepo
                .getSpatBroadcastRateEventsByDay(intersectionID, startTime, endTime);

        List<SpatMinimumDataEvent> latestSpatMinimumdataEvent = spatMinimumDataEventRepo
                .find(spatMinimumDataEventRepo.getQuery(intersectionID, startTime, endTime, true));
        List<MapMinimumDataEvent> latestMapMinimumdataEvent = mapMinimumDataEventRepo
                .find(mapMinimumDataEventRepo.getQuery(intersectionID, startTime, endTime, true));

        // Parse missing elements from minimum data events
        List<String> latestMapMinimumDataEventMissingElements = latestMapMinimumdataEvent.isEmpty()
                ? Collections.emptyList()
                : cleanMissingElements(latestMapMinimumdataEvent.get(0).getMissingDataElements(), true);

        List<String> latestSpatMinimumDataEventMissingElements = latestSpatMinimumdataEvent.isEmpty()
                ? Collections.emptyList()
                : cleanMissingElements(latestSpatMinimumdataEvent.get(0).getMissingDataElements(), false);

        // Process lane direction of travel data
        List<LaneDirectionOfTravelReportData> laneDirectionOfTravelReportData = LaneDirectionOfTravelReportData
                .processLaneDirectionOfTravelData(laneDirectionOfTravelAssessmentCount);

        // Extract HeadingTolerance and DistanceTolerance from the most recent
        // assessment
        double headingTolerance = 0.0;
        double distanceTolerance = 0.0;
        if (!laneDirectionOfTravelAssessmentCount.isEmpty()) {
            LaneDirectionOfTravelAssessment mostRecentAssessment = laneDirectionOfTravelAssessmentCount.get(0);
            if (!mostRecentAssessment.getLaneDirectionOfTravelAssessmentGroup().isEmpty()) {
                LaneDirectionOfTravelAssessmentGroup group = mostRecentAssessment
                        .getLaneDirectionOfTravelAssessmentGroup().get(0);
                headingTolerance = group.getTolerance();
                distanceTolerance = group.getDistanceFromCenterlineTolerance();
            }
        }

        // Retrieve StopLineStopEvents
        List<StopLineStopEvent> stopLineStopEvents = signalStateStopEventRepo
                .find(signalStateStopEventRepo.getQuery(intersectionID, startTime, endTime, false));
        List<StopLineStopReportData> stopLineStopReportData = StopLineStopReportData
                .aggregateStopLineStopEvents(stopLineStopEvents);

        // Retrieve SignalStateEvents
        List<StopLinePassageEvent> signalStateEvents = signalStateEventRepo
                .find(signalStateEventRepo.getQuery(intersectionID, startTime, endTime, false));
        List<StopLinePassageReportData> stopLinePassageReportData = StopLinePassageReportData
                .aggregateSignalStateEvents(signalStateEvents);

        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        ReportBuilder builder = new ReportBuilder(stream);
        List<String> dateStrings = builder.getDayStringsInRange(startTime, endTime);
        builder.addTitlePage("Conflict Monitor Report", startTime, endTime);

        // Add Lane Direction of Travel Information
        builder.addTitle("Lane Direction of Travel");
        builder.addLaneDirectionOfTravelEvent(DailyData.fromIDCountDays(laneDirectionOfTravelEventCounts, dateStrings));
        builder.addLaneDirectionOfTravelMedianDistanceDistribution(
                ChartData.fromIDCountList(laneDirectionOfTravelMedianDistanceDistribution));
        builder.addLaneDirectionOfTravelMedianHeadingDistribution(
                ChartData.fromIDCountList(laneDirectionOfTravelMedianHeadingDistribution));
        builder.addDistanceFromCenterlineOverTime(laneDirectionOfTravelAssessmentCount);
        builder.addHeadingOverTime(laneDirectionOfTravelAssessmentCount);
        builder.addPageBreak();

        // Add Lane Connection of Travel Information
        builder.addTitle("Connection of Travel");
        builder.addConnectionOfTravelEvent(DailyData.fromIDCountDays(connectionOfTravelEventCounts, dateStrings));
        builder.addLaneConnectionOfTravelMap(laneConnectionCounts);
        builder.addPageBreak();

        // Add Signal State Events
        builder.addTitle("Signal State Events");
        builder.addSignalStateEvents(DailyData.fromIDCountDays(signalstateEventCounts, dateStrings));
        builder.addSignalStateStopEvents(DailyData.fromIDCountDays(signalStateStopEventCounts, dateStrings));
        builder.addSignalStateConflictEvent(DailyData.fromIDCountDays(signalStateConflictEventCounts, dateStrings));

        // Add Time Change Details
        builder.addSpatTimeChangeDetailsEvent(DailyData.fromIDCountDays(timeChangeDetailsEventCounts, dateStrings));
        builder.addPageBreak();

        // Add Intersection Reference Alignment Event Counts
        builder.addTitle("Intersection Reference Alignment Event Counts");
        builder.addIntersectionReferenceAlignmentEvents(
                DailyData.fromIDCountDays(intersectionReferenceAlignmentEventCounts, dateStrings));
        builder.addPageBreak();

        // Add Map Broadcast Rate Events
        builder.addTitle("MAP");
        builder.addMapBroadcastRateEvents(DailyData.fromIDCountDays(mapBroadcastRateEventCount, dateStrings));
        builder.addMapMinimumDataEvents(DailyData.fromIDCountDays(mapMinimumDataEventCount, dateStrings));
        builder.addPageBreak();
        builder.addMapMinimumDataEventErrors(latestMapMinimumdataEvent);
        builder.addPageBreak();

        // Add Map Broadcast Rate Events
        builder.addTitle("SPaT");
        builder.addSpatBroadcastRateEvents(DailyData.fromIDCountDays(spatBroadcastRateEventCount, dateStrings));
        builder.addSpatMinimumDataEvents(DailyData.fromIDCountDays(spatMinimumDataEventCount, dateStrings));
        builder.addPageBreak();
        builder.addSpatMinimumDataEventErrors(latestSpatMinimumdataEvent);
        builder.addPageBreak();

        builder.write();

        ReportDocument doc = new ReportDocument();
        doc.setIntersectionID(intersectionID);
        doc.setRoadRegulatorID(roadRegulatorID);
        doc.setReportGeneratedAt(Instant.now().toEpochMilli());
        doc.setReportStartTime(startTime);
        doc.setReportStopTime(endTime);
        doc.setReportContents(stream.toByteArray());
        doc.setReportName(reportName);
        doc.setLaneDirectionOfTravelEventCounts(laneDirectionOfTravelEventCounts);
        doc.setLaneDirectionOfTravelMedianDistanceDistribution(laneDirectionOfTravelMedianDistanceDistribution);
        doc.setLaneDirectionOfTravelMedianHeadingDistribution(laneDirectionOfTravelMedianHeadingDistribution);
        doc.setLaneDirectionOfTravelReportData(laneDirectionOfTravelReportData);
        doc.setHeadingTolerance(headingTolerance);
        doc.setDistanceTolerance(distanceTolerance);
        doc.setConnectionOfTravelEventCounts(connectionOfTravelEventCounts);
        doc.setValidConnectionOfTravelData(validConnectionOfTravelData);
        doc.setInvalidConnectionOfTravelData(invalidConnectionOfTravelData);
        doc.setSignalStateConflictEventCount(signalStateConflictEventCounts);
        doc.setSignalStateEventCounts(signalstateEventCounts);
        doc.setSignalStateStopEventCounts(signalStateStopEventCounts);
        doc.setTimeChangeDetailsEventCount(timeChangeDetailsEventCounts);
        doc.setIntersectionReferenceAlignmentEventCounts(intersectionReferenceAlignmentEventCounts);
        doc.setMapBroadcastRateEventCount(mapBroadcastRateEventCount);
        doc.setMapMinimumDataEventCount(mapMinimumDataEventCount);
        doc.setSpatBroadcastRateEventCount(spatBroadcastRateEventCount);
        doc.setSpatMinimumDataEventCount(spatMinimumDataEventCount);
        doc.setLatestMapMinimumDataEventMissingElements(latestMapMinimumDataEventMissingElements);
        doc.setLatestSpatMinimumDataEventMissingElements(latestSpatMinimumDataEventMissingElements);
        doc.setStopLineStopReportData(stopLineStopReportData);
        doc.setStopLinePassageReportData(stopLinePassageReportData);

        reportRepo.add(doc);

        return doc;
    }
}
