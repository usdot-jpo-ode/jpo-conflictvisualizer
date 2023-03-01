# jpo-cvportal

**US Department of Transportation (USDOT) Intelligent Transportation Systems (ITS) Joint Program Office (JPO) Connected Vehicle Portal**

The JPO Connected Vehicle Portal is a web-based portal that acts as a single application that is made up of multiple modular applications. Currently, these modular applications include the Connected Vehicle Manager (CV Manager) and the CIMMS Conflict Monitor. More modular applications can and will most likely be added in the future. The JPO CV Portal can be deployed with a customized subset of these modular applications based on the needs of the user or organization. 

Each modular application has a corresponding API that is deployed alongside the web portal to serve as a backend. The APIs may have third party requirements associated with them to take full advantage of their functionality. Examples of possible requirements could be a required backend database or OAuth2.0 provider. Exact requirements and limitations for each application can be found in the README of their API directory.

To provide feedback, we recommend that you create an "issue" in this repository (<https://github.com/usdot-jpo-ode/jpo-cvportal/issues>). You will need a GitHub account to create an issue. If you don’t have an account, a dialog will be presented to you to create one at no cost.

## Modular Applications
The JPO CV Portal is capable of hosting the full set or a subset of the following modular applications.

### CV Manager
<b>GUI:</b> ReactJS with Redux Toolkit and Mapbox GL

<b>API:</b> Python

<b>Description:</b> An application that helps an organization manage their deployed CV devices (Roadside Units and Onboard Units) through an interactive, graphical user interface using Mapbox. 

<b>Features:</b>
- Visualize devices on a Mapbox map
- Display the current statuses of devices 
  - Latest online status
  - ISS SCMS certificate expiration
  - Other identifying values tracked on a PostgreSQL database
- jpo-ode supported message counts, sorted by RSU IP (BSM, MAP, SPaT, SRM, SSM, TIM)
- Visualize an RSU's currently active MAP message
- Visualize Basic Safety Messages (BSMs) relative to a specified geofence and time period
- Device configuration over SNMP (v3) for message forwarding
- Device firmware upgrade support for Kapsch, Commsignia and Yunex devices
- Admin controls for adding, modifying and removing devices and users

### CIMMS Conflict Monitor
<b>GUI:</b> ReactJS with Redux Toolkit and Mapbox GL

<b>API:</b> Java Spring Boot

<b>Description:</b> An application that helps an organization monitor their connected intersections alerting when conflicts occur and visualizing the conflicts to identify real vehicle incidents and issues within RSU message configuration.

<b>Features:</b>
- Visualize MAP and SPaT messages for a specified conflict on a Mapbox map
- Alert users when conflicts occur

## Current State of the Project
Currently the JPO CV Portal is broken into two independent projects. The CV Manager is being developed for CDOT and the CIMMS Conflict Monitor is being developed for CIMMS. The goal of this project is to combine these into a single portal solution that allows users to take advantage of both applications in one project, as described in the sections above. The current state of the project is missing the portal component so the two applications function as two separate applications. This will be implemented in the near future and both modular applications will see their GUIs receive streamlining changes to ensure they are being developed in the same framework. Eventually, the APIs may also be streamlined to a single language, but this is not a priority.

## License Information

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
file except in compliance with the License.
You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied. See the License for the specific language governing
permissions and limitations under the [License](http://www.apache.org/licenses/LICENSE-2.0).
