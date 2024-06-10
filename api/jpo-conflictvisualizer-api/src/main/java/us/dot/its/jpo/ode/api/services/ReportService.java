package us.dot.its.jpo.ode.api.services;

import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import us.dot.its.jpo.conflictmonitor.monitor.models.assessments.LaneDirectionOfTravelAssessment;
import us.dot.its.jpo.conflictmonitor.monitor.models.events.broadcast_rate.SpatBroadcastRateEvent;
import us.dot.its.jpo.conflictmonitor.monitor.models.events.minimum_data.MapMinimumDataEvent;
import us.dot.its.jpo.conflictmonitor.monitor.models.events.minimum_data.SpatMinimumDataEvent;
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
import us.dot.its.jpo.ode.api.models.DailyData;
import us.dot.its.jpo.ode.api.models.IDCount;
import us.dot.its.jpo.ode.api.models.LaneConnectionCount;
import us.dot.its.jpo.ode.api.models.ReportDocument;
import us.dot.its.jpo.ode.api.models.reports.ConnectionOfTravelReport;
import us.dot.its.jpo.ode.api.models.reports.IntersectionReferenceAlignmentReport;
import us.dot.its.jpo.ode.api.models.reports.LaneDirectionOfTravelReport;
import us.dot.its.jpo.ode.api.models.reports.SignalStateConflictReport;
import us.dot.its.jpo.ode.api.models.reports.SignalStateReport;
import us.dot.its.jpo.ode.api.models.reports.SignalStateStopReport;
import us.dot.its.jpo.ode.api.models.reports.TimeChangeDetailsReport;
import us.dot.its.jpo.ode.api.models.reports.MapBroadcastRateReport;
import us.dot.its.jpo.ode.api.models.reports.SpatBroadcastRateReport;
import us.dot.its.jpo.ode.api.models.reports.MapMinimumDataReport;
import us.dot.its.jpo.ode.api.models.reports.SpatMinimumDataReport;


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
    


    public ReportDocument buildReport(int intersectionID, String roadRegulatorID, long startTime, long endTime){




        String reportName = "CmReport_"+ intersectionID + "_" + roadRegulatorID + "_" + startTime + "_" + endTime;

        // Lane Direction of Travel Info
        List<IDCount> laneDirectionOfTravelEventCounts = laneDirectionOfTravelEventRepo.getLaneDirectionOfTravelEventsByDay(intersectionID, startTime, endTime);
        List<IDCount> laneDirectionOfTravelMedianDistanceDistribution = laneDirectionOfTravelEventRepo.getMedianDistanceByFoot(intersectionID, startTime, endTime);
        List<IDCount> laneDirectionOfTravelMedianHeadingDistribution = laneDirectionOfTravelEventRepo.getMedianDistanceByDegree(intersectionID, startTime, endTime);
        List<LaneDirectionOfTravelAssessment> laneDirectionOfTravelAssessmentCount = laneDirectionOfTravelAssessmentRepo.getLaneDirectionOfTravelOverTime(intersectionID, startTime, endTime);
        LaneDirectionOfTravelReport laneDirectionOfTravelReport = new LaneDirectionOfTravelReport(laneDirectionOfTravelEventCounts, laneDirectionOfTravelMedianDistanceDistribution, laneDirectionOfTravelMedianHeadingDistribution);

        // Connection of Travel Info
        List<IDCount> connectionOfTravelEventCounts = connectionOfTravelEventRepo.getConnectionOfTravelEventsByDay(intersectionID, startTime, endTime);
        List<LaneConnectionCount> laneConnectionCounts = connectionOfTravelEventRepo.getConnectionOfTravelEventsByConnection(intersectionID, startTime, endTime);
        ConnectionOfTravelReport connectionOfTravelReport = new ConnectionOfTravelReport(connectionOfTravelEventCounts, laneConnectionCounts);

        // Signal State Event Counts
        List<IDCount> signalstateEventCounts = signalStateEventRepo.getSignalStateEventsByDay(intersectionID, startTime, endTime);
        SignalStateReport signalStateReport = new SignalStateReport(signalstateEventCounts);

        // Signal state Stop Events
        List<IDCount> signalStateStopEventCounts = signalStateStopEventRepo.getSignalStateStopEventsByDay(intersectionID, startTime, endTime);
        SignalStateStopReport signalStateStopReport = new SignalStateStopReport(signalStateStopEventCounts);

        // Signal state Conflict Events
        List<IDCount> signalStateConflictEventCounts = signalStateConflictEventRepo.getSignalStateConflictEventsByDay(intersectionID, startTime, endTime);
        SignalStateConflictReport signalStateConflictReport = new SignalStateConflictReport(signalStateConflictEventCounts);
        
        // Time Change Details Events
        List<IDCount> timeChangeDetailsEventCounts = timeChangeDetailsEventRepo.getTimeChangeDetailsEventsByDay(intersectionID, startTime, endTime);
        TimeChangeDetailsReport timeChangeDetailsReport = new TimeChangeDetailsReport(timeChangeDetailsEventCounts);

        // Intersection Reference Alignment Event Counts
        List<IDCount> intersectionReferenceAlignmentEventCounts = intersectionReferenceAlignmentEventRepo.getIntersectionReferenceAlignmentEventsByDay(intersectionID, startTime, endTime);
        IntersectionReferenceAlignmentReport intersectionReferenceAlignmentReport = new IntersectionReferenceAlignmentReport(intersectionReferenceAlignmentEventCounts);



        // Map / Spat counts
        // List<IDCount> mapCounts = processedMapRepo.getMapBroadcastRates(intersectionID, startTime, endTime);
        // List<IDCount> spatCounts = processedSpatRepo.getSpatBroadcastRates(intersectionID, startTime, endTime);

        List<IDCount> mapMinimumDataEventCount = mapMinimumDataEventRepo.getMapMinimumDataEventsByDay(intersectionID, startTime, endTime);
        MapMinimumDataReport mapMinimumDataReport = new MapMinimumDataReport(mapMinimumDataEventCount);

        List<IDCount> spatMinimumDataEventCount = spatMinimumDataEventRepo.getSpatMinimumDataEventsByDay(intersectionID, startTime, endTime);
        SpatMinimumDataReport spatMinimumDataReport = new SpatMinimumDataReport(spatMinimumDataEventCount);

        List<IDCount> mapBroadcastRateEventCount = mapBroadcastRateEventRepo.getMapBroadcastRateEventsByDay(intersectionID, startTime, endTime);
        MapBroadcastRateReport mapBroadcastRateReport = new MapBroadcastRateReport(mapBroadcastRateEventCount);

        List<IDCount> spatBroadcastRateEventCount = spatBroadcastRateEventRepo.getSpatBroadcastRateEventsByDay(intersectionID, startTime, endTime);
        SpatBroadcastRateReport spatBroadcastRateReport = new SpatBroadcastRateReport(spatBroadcastRateEventCount);

        List<SpatMinimumDataEvent> latestSpatMinimumdataEvent = spatMinimumDataEventRepo.find(spatMinimumDataEventRepo.getQuery(intersectionID, startTime, endTime, true));
        List<MapMinimumDataEvent> latestMapMinimumdataEvent = mapMinimumDataEventRepo.find(mapMinimumDataEventRepo.getQuery(intersectionID, startTime, endTime, true));



        

        // Map / Spat Message Rate Distributions
        // List<IDCount> spatCountDistribution = processedSpatRepo.getSpatBroadcastRateDistribution(intersectionID, startTime, endTime);
        // List<IDCount> mapCountDistribution = processedMapRepo.getMapBroadcastRateDistribution(intersectionID, startTime, endTime);
        
        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        ReportBuilder builder = new ReportBuilder(stream);
        List<String> dateStrings = builder.getDayStringsInRange(startTime, endTime);
        builder.addTitlePage("Conflict Monitor Report", startTime, endTime);

        // Add Lane Direction of Travel Information
        builder.addTitle("Lane Direction of Travel");
        builder.addLaneDirectionOfTravelEvent(DailyData.fromIDCountDays(laneDirectionOfTravelEventCounts, dateStrings));
        builder.addLaneDirectionOfTravelMedianDistanceDistribution(ChartData.fromIDCountList(laneDirectionOfTravelMedianDistanceDistribution));
        builder.addLaneDirectionOfTravelMedianHeadingDistribution(ChartData.fromIDCountList(laneDirectionOfTravelMedianHeadingDistribution));
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
        builder.addIntersectionReferenceAlignmentEvents(DailyData.fromIDCountDays(intersectionReferenceAlignmentEventCounts, dateStrings));
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



            
        // builder.addTitle("Map");
        // builder.addMapBroadcastRate(mapCounts);
        // builder.addMapBroadcastRateDistribution(mapCountDistribution, startTime, endTime);
        
        // builder.addPageBreak();

        // builder.addTitle("SPaT");
        // builder.addSpatBroadcastRate(spatCounts);
        // builder.addSpatBroadcastRateDistribution(spatCountDistribution, startTime, endTime);
        
        // builder.addPageBreak();
            
            
        

        builder.write();

        ReportDocument doc = new ReportDocument();
        doc.setIntersectionID(intersectionID);
        doc.setRoadRegulatorID(roadRegulatorID);
        doc.setReportGeneratedAt(Instant.now().toEpochMilli());
        doc.setReportStartTime(startTime);
        doc.setReportStopTime(endTime);
        doc.setReportContents(stream.toByteArray());
        doc.setReportName(reportName);
        

        doc.setLaneDirectionOfTravel(laneDirectionOfTravelReport);
        doc.setConnectionOfTravel(connectionOfTravelReport);
        doc.setSignalState(signalStateReport);
        doc.setSignalStateStop(signalStateStopReport);
        doc.setSignalStateConflict(signalStateConflictReport);
        doc.setTimeChangeDetails(timeChangeDetailsReport);
        doc.setIntersectionReferenceAlignment(intersectionReferenceAlignmentReport);
        doc.setMapMinimumData(mapMinimumDataReport);
        doc.setSpatMinimumDataReport(spatMinimumDataReport);
        doc.setMapBroadcastRate(mapBroadcastRateReport);
        doc.setSpatBroadcastRateReport(spatBroadcastRateReport);

        reportRepo.add(doc);

        return doc;

    }
}
