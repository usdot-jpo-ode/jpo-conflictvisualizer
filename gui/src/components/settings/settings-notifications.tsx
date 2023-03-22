import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  Typography,
} from "@mui/material";

export const SettingsNotifications = (props) => (
  <form {...props}>
    <Card>
      <CardHeader subheader="Manage Notification Settings" title="Notifications" />
      <Divider />
      <CardContent>
        <Grid container spacing={6} wrap="wrap">
          <Grid
            item
            md={4}
            sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            xs={12}
          >
            <Typography color="textPrimary" gutterBottom variant="h6">
              Notification Message Rate
            </Typography>
            <FormControlLabel control={<Radio color="primary" />} label="All" />
            <FormControlLabel control={<Radio />} label="Once Per Hour" />
            <FormControlLabel
              control={<Radio color="primary" defaultChecked />}
              label="Once Per Day"
            />
            <FormControlLabel control={<Radio color="primary" />} label="Never" />
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            xs={12}
          >
            <Typography color="textPrimary" gutterBottom variant="h6">
              Cease Broadcast Recommendation Rate
            </Typography>
            <FormControlLabel control={<Radio color="primary" />} label="All" />
            <FormControlLabel control={<Radio />} label="Once Per Hour" defaultChecked />
            <FormControlLabel control={<Radio color="primary" />} label="Once Per Day" />
            <FormControlLabel control={<Radio color="primary" />} label="Never" />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <Button color="primary" variant="contained">
          Save
        </Button>
      </Box>
    </Card>
  </form>
);
