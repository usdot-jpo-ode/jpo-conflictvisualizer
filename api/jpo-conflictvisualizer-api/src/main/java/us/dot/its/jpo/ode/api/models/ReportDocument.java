package us.dot.its.jpo.ode.api.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import us.dot.its.jpo.ode.api.models.reports.ConnectionOfTravelReport;
import us.dot.its.jpo.ode.api.models.reports.IntersectionReferenceAlignmentReport;
import us.dot.its.jpo.ode.api.models.reports.LaneDirectionOfTravelReport;
import us.dot.its.jpo.ode.api.models.reports.MapBroadcastRateReport;
import us.dot.its.jpo.ode.api.models.reports.MapMinimumDataReport;
import us.dot.its.jpo.ode.api.models.reports.SignalStateConflictReport;
import us.dot.its.jpo.ode.api.models.reports.SignalStateReport;
import us.dot.its.jpo.ode.api.models.reports.SignalStateStopReport;
import us.dot.its.jpo.ode.api.models.reports.SpatBroadcastRateReport;
import us.dot.its.jpo.ode.api.models.reports.SpatMinimumDataReport;
import us.dot.its.jpo.ode.api.models.reports.TimeChangeDetailsReport;

import org.springframework.data.annotation.Id;

import lombok.EqualsAndHashCode;

@ToString
@Setter
@EqualsAndHashCode
@Getter
public class ReportDocument {
    
    @Id
    private String reportName;
    private int intersectionID;
    private String roadRegulatorID;
    private long reportGeneratedAt;
    private long reportStartTime;
    private long reportStopTime;
    private byte[] reportContents;


    private ConnectionOfTravelReport connectionOfTravel;
    private IntersectionReferenceAlignmentReport intersectionReferenceAlignment;
    private LaneDirectionOfTravelReport laneDirectionOfTravel;
    private SignalStateConflictReport signalStateConflict;
    private SignalStateReport signalState;
    private SignalStateStopReport signalStateStop;
    private TimeChangeDetailsReport timeChangeDetails;

    private MapBroadcastRateReport mapBroadcastRate;
    private MapMinimumDataReport mapMinimumData;

    private SpatBroadcastRateReport spatBroadcastRateReport;
    private SpatMinimumDataReport spatMinimumDataReport;

}

