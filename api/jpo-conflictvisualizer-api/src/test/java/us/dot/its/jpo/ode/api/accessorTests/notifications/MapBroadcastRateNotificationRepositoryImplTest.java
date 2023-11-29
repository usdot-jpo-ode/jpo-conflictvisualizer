package us.dot.its.jpo.ode.api.accessorTests.notifications;

import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import static org.assertj.core.api.Assertions.assertThat;
import us.dot.its.jpo.conflictmonitor.monitor.models.notifications.broadcast_rate.MapBroadcastRateNotification;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import us.dot.its.jpo.ode.api.accessors.notifications.MapBroadcastRateNotification.MapBroadcastRateNotificationRepositoryImpl;


@SpringBootTest
@RunWith(SpringRunner.class)
public class MapBroadcastRateNotificationRepositoryImplTest {

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private MapBroadcastRateNotificationRepositoryImpl repository;

    Integer intersectionID = 123;
    Long startTime = 1624640400000L; // June 26, 2021 00:00:00 GMT
    Long endTime = 1624726799000L; // June 26, 2021 23:59:59 GMT
    boolean latest = true;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetQuery() {

        Query query = repository.getQuery(intersectionID, startTime, endTime, latest);

        // Assert IntersectionID
        assertThat(query.getQueryObject().get("event.intersectionID")).isEqualTo(intersectionID);
        
        
        // Assert Start and End Time
        Document queryTimeDocument = (Document)query.getQueryObject().get("notificationGeneratedAt");
        assertThat(queryTimeDocument.getLong("$gte")).isEqualTo(startTime);
        assertThat(queryTimeDocument.getLong("$lte")).isEqualTo(endTime);


        // Assert sorting and limit
        assertThat(query.getSortObject().keySet().contains("notificationGeneratedAt")).isTrue();
        assertThat(query.getSortObject().get("notificationGeneratedAt")).isEqualTo(-1);
        assertThat(query.getLimit()).isEqualTo(1);

    }

    @Test
    public void testGetQueryResultCount() {
        Query query = new Query();
        long expectedCount = 10;

        Mockito.when(mongoTemplate.count(Mockito.eq(query), Mockito.any(), Mockito.anyString())).thenReturn(expectedCount);

        long resultCount = repository.getQueryResultCount(query);

        assertThat(resultCount).isEqualTo(expectedCount);
        Mockito.verify(mongoTemplate).count(Mockito.eq(query), Mockito.any(), Mockito.anyString());
    }

    @Test
    public void testFindMapBroadcastRateNotifications() {
        Query query = new Query();
        List<MapBroadcastRateNotification> expected = new ArrayList<>();

        Mockito.doReturn(expected).when(mongoTemplate).find(query, MapBroadcastRateNotification.class, "CmMapBroadcastRateNotifications");

        List<MapBroadcastRateNotification> results = repository.find(query);

        assertThat(results).isEqualTo(expected);
    }

}