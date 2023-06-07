import { Dialog, DialogTitle, Container, DialogActions, Button } from "@mui/material";
import IntersectionMap from "./intersection-selection-map";
import { useDashboardContext } from "../../contexts/dashboard-context";

type Props = {
  onClose: () => void;
  open: boolean;
  intersections: IntersectionReferenceData[];
};

const MapDialog = (props: Props) => {
  const { intersectionId, setIntersection } = useDashboardContext();
  const { onClose, intersections, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth={"lg"}>
        <DialogTitle>Select Intersection</DialogTitle>
        <Container sx={{ height: "60vh" }}>
          <IntersectionMap
            intersections={intersections}
            selectedIntersection={intersections.find((e) => e.intersectionID == intersectionId)}
            onSelectIntersection={setIntersection}
          />
        </Container>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MapDialog;
