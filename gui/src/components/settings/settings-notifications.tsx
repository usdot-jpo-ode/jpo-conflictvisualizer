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
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";

export const SettingsNotifications = (props: { value?: EmailPreference; onSave: (v: EmailPreference) => void }) => {
  const [value, setValue] = React.useState<EmailPreference>(props.value ?? "NEVER");

  return (
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
                Notification Email Rate
              </Typography>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={(e, v) => setValue(v as EmailPreference)}
              >
                <FormControlLabel value="ALWAYS" control={<Radio />} label="Always" />
                <FormControlLabel value="ONCE_PER_HOUR" control={<Radio />} label="Once Per Hour" />
                <FormControlLabel value="ONCE_PER_DAY" control={<Radio />} label="Once Per Day" />
                <FormControlLabel value="NEVER" control={<Radio />} label="Never" />
              </RadioGroup>
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
          <Button color="primary" variant="contained" onClick={() => props.onSave(value)}>
            Save
          </Button>
        </Box>
      </Card>
    </form>
  );
};
