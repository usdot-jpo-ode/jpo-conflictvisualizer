## JPO COnflict Visualizer Release Notes

## Version 1.0.0

### **Summary**

The first release for the jpo-conflictvisualizer, version 1.0.0, includes a fully functioning GUI and associated API which display data from the jpo-conflictmonitor. This infludes displaying notifications, visualizing SPAT/MAP/BSM, generating PDF reports, and updating system/intersection configuration parameters. These applications also support viewing and downloading events, assessments, and notifications. These are authenticated by a keycloak server. Read more about the jpo-conflictvisualizer in the [main README](../README.md).

Enhancements in this release:

- PR13: Adding counds graphs and documentation
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
