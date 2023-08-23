package us.dot.its.jpo.ode.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import us.dot.its.jpo.ode.api.accessors.bsm.OdeBsmJsonRepository;
import us.dot.its.jpo.ode.api.controllers.BsmController;
import us.dot.its.jpo.ode.mockdata.MockBsmGenerator;
import us.dot.its.jpo.ode.model.OdeBsmData;


@SpringBootTest
@RunWith(SpringRunner.class)
public class BsmTest {

  @Autowired
  BsmController controller;

  @MockBean
  OdeBsmJsonRepository odeBsmJsonRepository;
    


  @Test
  public void testBsmJson() {

    MockKeyCloakAuth.setSecurityContextHolder("cm_user", Set.of("USER"));

    List<OdeBsmData> list = MockBsmGenerator.getJsonBsms();

    ResponseEntity<List<OdeBsmData>> result = controller.findBSMs(null, null, null, null, null, null, false);
    assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(result.getBody()).isEqualTo(list);
  }
}