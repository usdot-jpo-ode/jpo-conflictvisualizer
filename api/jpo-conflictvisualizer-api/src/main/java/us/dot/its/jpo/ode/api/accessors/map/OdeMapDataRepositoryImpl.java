package us.dot.its.jpo.ode.api.accessors.map;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import us.dot.its.jpo.ode.model.OdeMapData;

@Component
public class OdeMapDataRepositoryImpl implements OdeMapDataRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    private String collectionName = "OdeMapJson";

    public Query getQuery(Integer intersectionID, Long startTime, Long endTime, boolean latest) {
        Query query = new Query();

        if (intersectionID != null) {
            query.addCriteria(Criteria.where("properties.intersectionId").is(intersectionID));
        }

        String startTimeString = Instant.ofEpochMilli(0).toString();
        String endTimeString = Instant.now().toString();

        if (startTime != null) {
            startTimeString = Instant.ofEpochMilli(startTime).toString();
        }
        if (endTime != null) {
            endTimeString = Instant.ofEpochMilli(endTime).toString();
        }

        if (latest) {
            query.with(Sort.by(Sort.Direction.DESC, "notificationGeneratedAt"));
            query.limit(1);
        }

        query.addCriteria(Criteria.where("properties.timeStamp").gte(startTimeString).lte(endTimeString));
        return query;
    }

    public long getQueryResultCount(Query query) {
        return mongoTemplate.count(query, OdeMapData.class, collectionName);
    }

    public List<OdeMapData> findMaps(Query query) {
        // return mongoTemplate.find(query, ProcessedMap.class, "OdeMapJson1234");
        return mongoTemplate.find(query, OdeMapData.class, collectionName);
    }

    @Override
    public void add(OdeMapData item) {
        System.out.println("Adding OdeMap Json");
        mongoTemplate.save(item, collectionName);
    }

    

}