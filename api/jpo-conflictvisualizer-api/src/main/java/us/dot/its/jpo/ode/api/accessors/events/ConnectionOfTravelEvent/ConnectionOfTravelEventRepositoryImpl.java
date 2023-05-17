
package us.dot.its.jpo.ode.api.accessors.events.ConnectionOfTravelEvent;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import us.dot.its.jpo.conflictmonitor.monitor.models.events.ConnectionOfTravelEvent;
import org.springframework.data.domain.Sort;

import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import us.dot.its.jpo.ode.api.models.IDCount;
import us.dot.its.jpo.ode.api.models.LaneConnectionCount;

@Component
public class ConnectionOfTravelEventRepositoryImpl implements ConnectionOfTravelEventRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public Query getQuery(Integer intersectionID, Long startTime, Long endTime, boolean latest) {
        Query query = new Query();

        if (intersectionID != null) {
            query.addCriteria(Criteria.where("intersectionID").is(intersectionID));
        }
        Date startTimeDate = new Date(0);
        Date endTimeDate = new Date();

        if (startTime != null) {
            startTimeDate = new Date(startTime);
        }
        if (endTime != null) {
            endTimeDate = new Date(endTime);
        }

        query.addCriteria(Criteria.where("eventGeneratedAt").gte(startTimeDate).lte(endTimeDate));
        if (latest) {
            query.with(Sort.by(Sort.Direction.DESC, "notificationGeneratedAt"));
            query.limit(1);
        }
        return query;
    }

    public long getQueryResultCount(Query query) {
        return mongoTemplate.count(query, ConnectionOfTravelEvent.class, "CmConnectionOfTravelEvent");
    }

    public List<ConnectionOfTravelEvent> find(Query query) {
        return mongoTemplate.find(query, ConnectionOfTravelEvent.class, "CmConnectionOfTravelEvent");
    }

    public List<IDCount> getConnectionOfTravelEventsByDay(int intersectionID, Long startTime, Long endTime){
        if (startTime == null) {
            startTime = 0L;
        }
        if (endTime == null) {
            endTime = Instant.now().toEpochMilli();
        }

        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("intersectionID").is(intersectionID)),
            Aggregation.match(Criteria.where("timestamp").gte(startTime).lte(endTime)),
            Aggregation.project("timestamp"),
            Aggregation.project()
                .and(ConvertOperators.ToDate.toDate("$timestamp")).as("date"),
            Aggregation.project()
                .and(DateOperators.DateToString.dateOf("date").toString("%Y-%m-%d")).as("dateStr"),
            Aggregation.group("dateStr").count().as("count")
        );

        AggregationResults<IDCount> result = mongoTemplate.aggregate(aggregation, "CmConnectionOfTravelEvent", IDCount.class);
        List<IDCount> results = result.getMappedResults();

        return results;
    }

    public List<LaneConnectionCount> getConnectionOfTravelEventsByConnection(int intersectionID, Long startTime, Long endTime){
        if (startTime == null) {
            startTime = 0L;
        }
        if (endTime == null) {
            endTime = Instant.now().toEpochMilli();
        }

        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("intersectionID").is(intersectionID)),
            Aggregation.match(Criteria.where("timestamp").gte(startTime).lte(endTime)),
            Aggregation.project("ingressLaneID", "egressLaneID"),
            Aggregation.group("ingressLaneID", "egressLaneID").count().as("count"),
            Aggregation.sort(Sort.Direction.ASC, "ingressLaneID", "egressLaneID"),
            Aggregation.project("ingressLaneID", "egressLaneID", "count")
        );

        AggregationResults<LaneConnectionCount> result = mongoTemplate.aggregate(aggregation, "CmConnectionOfTravelEvent", LaneConnectionCount.class);
        List<LaneConnectionCount> results = result.getMappedResults();

        return results;
    }

}
