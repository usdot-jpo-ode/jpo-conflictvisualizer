## JPO COnflict Visualizer Release Notes

## Version 1.3.0

### **Summary**

Enhancements in this release:

- Added vehicle activity chart to map page
- Added message count API endpoints
- Added message count widgets
- Improved chart rendering
- Added auto reconnect to web sockets
- Fixed time serialization on STOMP endpoints
- Added deterministic vehicle color rendering
- Removed public keycloak client secrets
- Fixed Swagger Dashboard compatibility issues with updated Spring Versions
- Added endpoint to get BSM events
- Added intersection names to UI
- Bug Fixes

## Version 1.2.0

### **Summary**


Enhancements in this release:

- Added STOMP websocket support to Conflict Visualizer API
- Added Live Message Viewer (CV-TV) to Conflict Visualizer
- Converted Configuration Endpoints to call Conflict Monitor API
- Improved Legends to include better intersection descriptions
- Fixed bugs preventing report generation
- Added Page to view previously generated reports


## Version 1.0.0

### **Summary**

The first release for the jpo-conflictvisualizer, version 1.0.0, includes a fully functioning GUI and associated API which display data from the jpo-conflictmonitor. This includes displaying notifications, visualizing SPAT/MAP/BSM messages, generating PDF reports, and updating system/intersection configuration parameters. These applications also support viewing and downloading events, assessments, and notifications. They are authenticated by a keycloak server. Read more about the jpo-conflictvisualizer in the main [README](../README.md)

Enhancements in this release:

- PR14: Adding additional project documentation
- PR13: Adding counts graphs and documentation
- PR11/12: Adding additional MAP and SPAT DB entries
- PR10: Fixing types in API properties
- PR9: Creating data loader
- PR8: Adding intersection selection map dialog
- PR7: Generating PDF reports from counts data
- PR6: README updates
- PR5: Passing environment variables to NextJS config
- PR4: Creating main dashboard page and fixing docker integration
- PR3: Adding user creation API endpoints
- PR2: Fixing MongoDB URL resolution
- PR1: Integrating Keycloak into API
- Initial Commit: Adding codebase for GUI and API. GUI is capable of authentication to keycloak, visualizing MAP/SPAT/BSM messages, viewing notifications, and updating configuration parameters. API is capable of querying MongoDB data for Events, Assessments, Notifications, and MAP/SPAT/BSM messages, and hosts swagger documentation.
