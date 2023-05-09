# jpo-conflictvisualizer

The CIMMS Conflict Visualizer is a web-based user interface for configuring the [CIMMS Conflict Monitor](https://github.com/usdot-jpo-ode/jpo-conflictmonitor), as well as displaying notifications, downloading data, and visualizing conflicts. This repository also contains the associated API, which hosts endpoints for the GUI to access data from the jpo-conflicmonitor MongoDB database.

This application is fully dockerized, with the API and GUI alongside an instance of the [jpo-ode](https://github.com/usdot-jpo-ode/jpo-ode), [jpo-geojsonconverter](https://github.com/usdot-jpo-ode/jpo-geojsonconverter), [jpo-conflictmonitor](https://github.com/usdot-jpo-ode/jpo-conflictmonitor). Information on how to build and run those projects is available in their repositories. The docker-compose available in this repository will build three components: the conflictvisualizer-api, the conflictvisualizer-gui and a [Keycloak](https://www.keycloak.org/getting-started/getting-started-docker) server used to authenticate both.

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

Run ODE, then GeoJSONConverter, then ConflictMonitor. Please see the individual repositories for each for information on how to deploy each of these.

### 3. Configure Conflict Visualizer API

1. Make a copy of the sample properties file api/jpo-conflictvisualizer-api/src/main/resources/application.properties.example and configure it for deployment.
```
cp api/jpo-conflictvisualizer-api/src/main/resources/application.properties.example api/jpo-conflictvisualizer-api/src/main/resources/application.properties
```
2. Edit the newly created application.properties file. Configure, CORS and Email settings as needed.

### 4. Configure Conflict Visualizer GUI

1. Make a copy of the sample.env file gui/sample.env
```
cp gui/sample.env gui/.env
```
2. Modify the gui/.env file to match the desired environmental configuration.
3. Modify the src/pages/_app.tsx file and fill in the following values:
    - process.env.KEYCLOAk_CLIENT_ID
    - process.env.KEYCLOAK_REALM
    - process.env.KEYCLOAK_CLIENT_SECRET
    - process.env.DOCKER_HOST_IP


b. Run API

- from VS Code: (select C:\Users\rando\Github\jpo-conflictvisualizer\api\jpo-conflictvisualizer-api\src\main\java\us\dot\its\jpo\ode\api\ConflictApiApplication.java and Run)
- from Docker

### 5. Setup Docker Environment Variables
1. Make a copy of the sample.env file ./sample.env
```
cp sample.env .env
```
2. Modify the .env file and set the appropriate deployment variables 



### 6. Start Conflict Visualiser

There are two options to run the conflict visualizer, the first option is to run all components of the conflict visualizer together from docker-compose (recommended). The second option is to manually start up each component. This provides additional flexibility, but increases how much configuration is required.

#### Start all Components Together

```
docker-compose up --build -d
```



#### Start all Components Manually

To Start the Keycloak server
```
docker run -p 8084:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:20.0.2 start-dev
```

To Start the ConflictMonitor-API
```
cd api
docker-compose up --build -d
```

To Start the ConflictMonitor-GUI
```
cd gui
docker-compose up --build -d
```

## Development Environments

The below section provides additional instruction on how to setup the conflict visualizer components for development. This section describes how to run the components locally to allow for quick changes and rapid iteration.

### 1. Running Conflict Visualizer API Locally

The conflict visualizer API requires the following dependencies be installed to run locally
- Java 11
- Maven

Additionally there are other dependencies installed through maven. 
Before building the conflictvisualizer-api. Make sure that local copies of the ODE, JPO-GeoJsonConverter, and JPO-ConflictMonitor have been built and intalled on your system. For instructions on building these locally, please see each ones respective repository.

Once these components have been installed. Download and install additional dependencies for the conflict visualizer using the following:
```
cd api/jpo-conflictvisualizer-api
mvn clean install
```

### 2. Running Conflict Visualizer GUI Locally

The conflict visualizer Gui requires the following dependencies to be installed to run locally
- Node 17
- npm 8


To Install dependencies for the conflict monitor GUI run the following.
```
cd gui
npm install
```

Run GUI
```
npm run dev
```

### 3. Running MailHog

A Mailhog server can be used locally to test the Email capabilities of the conflict monitor API and GUI To configure Mailhog perform the following:

Run mailhog server

```
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

To Configure Keycloak to use Mailhog for sending emails: 

Login to the keycloak admin console at localhost:8084

1. Go to Realm Settings-->Email
2. Set host to DOCKER_HOST_IP
3. Set port to 1025

Mailhog will run on port 8025

To Configure the Conflict Monitor to use Mailhog for sending emails, modify the application.properties file and set the mailhog server location and port. Then rebuild the conflict monitor API.

## Current State of the Project

Currently the CIMMS Conflict Visualizer is under active development.

## License Information

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
file except in compliance with the License.
You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied. See the License for the specific language governing
permissions and limitations under the [License](http://www.apache.org/licenses/LICENSE-2.0).
