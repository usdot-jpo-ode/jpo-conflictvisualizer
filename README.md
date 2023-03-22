# jpo-conflictvisualizer

The CIMMS Conflict Visualizer is a web-based user interface for configuring the [CIMMS Conflict Monitor](https://github.com/usdot-jpo-ode/jpo-conflictmonitor), as well as displaying notifications, downloading data, and visualizing conflicts. This repository also contains the associated API, which hosts endpoints for the GUI to access data from the jpo-conflicmonitor MongoDB database.

This application is fully dockerized, with the API and GUI expected to be deployed separately, alongside an instance of the [jpo-ode](https://github.com/usdot-jpo-ode/jpo-ode), [jpo-geojsonconverter](https://github.com/usdot-jpo-ode/jpo-geojsonconverter), [jpo-conflictmonitor](https://github.com/usdot-jpo-ode/jpo-conflictmonitor), and [Keycloak](https://www.keycloak.org/getting-started/getting-started-docker). Information on how to build and run those projects is available in their repositories.

This application is a part of the [JPO Connected Vehicle Portal](https://github.com/usdot-jpo-ode/jpo-cvportal), which is made up of this repository and others, to provide a single application with access to other connected intersection tools.

To provide feedback, we recommend that you create an "issue" in this repository (<https://github.com/usdot-jpo-ode/jpo-conflictvisualizer/issues>). You will need a GitHub account to create an issue. If you don’t have an account, a dialog will be presented to you to create one at no cost.

## Repository Contents

<b>GUI:</b> ReactJS with Typescript, NextJS,

<b>API:</b> Java Spring Boot REST application. Contains submodule of [jpo-conflictmonitor](https://github.com/usdot-jpo-ode/jpo-conflictmonitor) repo

<b>Description:</b> An application that helps an organization monitor their connected intersections alerting when conflicts occur and visualizing the conflicts to identify real vehicle incidents and issues within RSU message configuration.

<b>Features:</b>

- Login Authentication hosted by
- View and accept Notifications
- View and update configuration parameters
- Visualize Notifications (SPATs, MAPs, and BSMs)
- Query and download data (events/assessments/SPATs/MAPs/BSMs)

## Installation

### 1. Initialize and update submodules

```
git submodule update --init --recursive
```

### 2. Clone and Run jpo-ode, jpo-geonjsonconverter, and jpo-conflictmonitor docker images

Run ODE, then GeoJSONConverter, then ConflictMonitor

### 3. Run Keycloak Server

a. Run Keycloak Server Docker Image

```
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:20.0.2 start-dev
```

b. Configure keycloak server

- https://www.keycloak.org/getting-started/getting-started-docker

### 4. Configure and Run API

a. Create application.properties file in api/jpo-conflictvisualizer-api/src/main/resources

b. Run API

- from VS Code: (select C:\Users\rando\Github\jpo-conflictvisualizer\api\jpo-conflictvisualizer-api\src\main\java\us\dot\its\jpo\ode\api\ConflictApiApplication.java and Run)
- from Docker

```
cd api
docker compose up -d
```

### 5. Configure and Run GUI

a. Create .env file in gui
b. Install node modules

```
cd gui
npm install
```

c. Run GUI

```
npm run dev
```

## Current State of the Project

Currently the CIMMS Conflict Visualizer is under active development.

## License Information

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
file except in compliance with the License.
You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied. See the License for the specific language governing
permissions and limitations under the [License](http://www.apache.org/licenses/LICENSE-2.0).
