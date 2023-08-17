import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";

import { Container, Col } from "reactstrap";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

type Props = {
  intersections: IntersectionReferenceData[];
  selectedIntersection: IntersectionReferenceData | undefined;
  onSelectIntersection: (id: number, roadRegulatorId?: number) => void;
};

const IntersectionMap = (props: Props) => {
  const MAPBOX_API_TOKEN = publicRuntimeConfig.MAPBOX_TOKEN!;
  const [selectedIntersection, setSelectedIntersection] = useState<IntersectionReferenceData | undefined>(
    props.selectedIntersection
  );
  const [viewState, setViewState] = useState({
    latitude: props.selectedIntersection?.latitude ?? 39.587905,
    longitude: props.selectedIntersection?.longitude ?? -105.0907089,
    zoom: 11,
  });

  const markers = props.intersections.map((intersection) => {
    return (
      <Marker
        key={intersection.intersectionID}
        latitude={intersection.latitude}
        longitude={intersection.longitude}
        onClick={(e) => {
          e.originalEvent.preventDefault();
          props.onSelectIntersection(intersection.intersectionID, intersection.roadRegulatorID);
          setSelectedIntersection(intersection);
        }}
      >
        <img src="/icons/intersection_icon.png" style={{ width: 70 }} />
      </Marker>
    );
  });

  return (
    <Container fluid={true} style={{ width: "100%", height: "100%", display: "flex" }}>
      <Col className="mapContainer" style={{ overflow: "hidden" }}>
        <Map
          {...viewState}
          mapStyle="mapbox://styles/tonyenglish/cld2bdrk3000201qmx2jb95kf"
          mapboxAccessToken={MAPBOX_API_TOKEN}
          attributionControl={true}
          customAttribution={['<a href="https://www.cotrip.com/" target="_blank">© CDOT</a>']}
          styleDiffing
          style={{ width: "100%", height: "100%" }}
          onMove={(evt) => setViewState(evt.viewState)}
        >
          {markers}
          {selectedIntersection && (
            <Popup
              latitude={selectedIntersection.latitude}
              longitude={selectedIntersection.longitude}
              closeOnClick={false}
              closeButton={false}
            >
              <div>SELECTED {selectedIntersection.intersectionID}</div>
            </Popup>
          )}
        </Map>
      </Col>
    </Container>
  );
};

export default IntersectionMap;
