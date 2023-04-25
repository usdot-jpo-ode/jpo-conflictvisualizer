package us.dot.its.jpo.ode.api.accessors.users;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;
import us.dot.its.jpo.conflictmonitor.monitor.models.config.IntersectionConfig;
import us.dot.its.jpo.conflictmonitor.monitor.models.config.UpdateType;

import us.dot.its.jpo.geojsonconverter.pojos.geojson.map.ProcessedMap;
import us.dot.its.jpo.ode.api.IntersectionReferenceData;

@Component
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private MongoTemplate mongoTemplate;
    private String collectionName = "CmUserCreationRequest";

    public Query getQuery(String id, String firstName, String lastName, String email, String role, Long startTime, Long endTime ) {
        Query query = new Query();

        if (id != null) {
            query.addCriteria(Criteria.where("_id").is(id));
        }

        if (firstName != null) {
            query.addCriteria(Criteria.where("firstName").is(firstName));
        }

        if (lastName != null) {
            query.addCriteria(Criteria.where("lastName").is(lastName));
        }

        if (email != null) {
            query.addCriteria(Criteria.where("email").is(email));
        }

        if(role != null){
            query.addCriteria(Criteria.where("role").is(role));
        }


        if (startTime == null) {
            startTime = 0L;
        }
        if (endTime == null) {
            endTime = Instant.now().toEpochMilli();
        }


        query.addCriteria(Criteria.where("requestSubmittedAt").gte(startTime).lte(endTime));
        return query;
    }

    public long getQueryResultCount(Query query) {
        return mongoTemplate.count(query, UserCreationRequest.class, collectionName);
    }

    public List<UserCreationRequest> find(Query query) {
        return mongoTemplate.find(query, UserCreationRequest.class, collectionName);
    }

    public void delete(Query query) {
        mongoTemplate.remove(query, UserCreationRequest.class, collectionName);
    }

    @Override
    public void save(UserCreationRequest request) {
        Query query = getQuery(null, null, null, request.getEmail(),null,  null, null);
        Update update = new Update();
        update.set("firstName", request.getFirstName());
        update.set("lastName", request.getLastName());
        update.set("email", request.getEmail());
        update.set("role", request.getRole());
        update.set("requestSubmittedAt",request.getRequestSubmittedAt());
        mongoTemplate.upsert(query, update, collectionName);
    }
}