package us.dot.its.jpo.ode.api.models.reports;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import us.dot.its.jpo.ode.api.models.IDCount;

import java.util.List;

@ToString
@Setter
@EqualsAndHashCode
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class IntersectionReferenceAlignmentReport {
    private List<IDCount> eventCounts;
}
