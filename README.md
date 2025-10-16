<span style="color:red">
<H1>
Deprecation Notice - October 2025
</H1>
This repository has been deprecated as the features used here are better encapsulated in the jpo-cvmanager project. All future development and deployments should be conducted using the cv-manager.
<ref>https://github.com/usdot-jpo-ode/jpo-cvmanager</ref>
</span>



# jpo-conflictvisualizer

The CIMMS Conflict Visualizer is a web-based user interface for configuring the [CIMMS Conflict Monitor](https://github.com/usdot-jpo-ode/jpo-conflictmonitor), as well as displaying notifications, downloading data, and visualizing conflicts. This repository also contains the associated API, which hosts endpoints for the GUI to access data from the jpo-conflictmonitor MongoDB database.

This application is fully dockerized, with the API and GUI alongside an instance of the [jpo-ode](https://github.com/usdot-jpo-ode/jpo-ode), [jpo-geojsonconverter](https://github.com/usdot-jpo-ode/jpo-geojsonconverter), [jpo-conflictmonitor](https://github.com/usdot-jpo-ode/jpo-conflictmonitor). Information on how to build and run those projects is available in their repositories. The docker-compose available in this repository will build three components: the conflictvisualizer-api, the conflictvisualizer-gui and a [Keycloak](https://www.keycloak.org/getting-started/getting-started-docker) server used to authenticate both.

This application is a part of the [JPO Connected Vehicle Portal](https://github.com/usdot-jpo-ode/jpo-cvportal), which is made up of this repository and others, to provide a single application with access to other connected intersection tools.

To provide feedback, we recommend that you create an "issue" in this repository (<https://github.com/usdot-jpo-ode/jpo-conflictvisualizer/issues>). You will need a GitHub account to create an issue. If you don’t have an account, a dialog will be presented to you to create one at no cost.

## Repository Contents

<b>GUI:</b> ReactJS web app with Typescript, NextJS, and Mapbox

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

Clone the repository and initialize sub-modules

```
git clone --recurse-submodules https://github.com/usdot-jpo-ode/jpo-conflictvisualizer
```

Alternatively, clone the repository first, then import submodules second

```
git submodule update --init --recursive
```

### 2. Build and Run jpo-ode, jpo-geojsonconverter, and jpo-conflictmonitor docker images

Run [ODE](https://github.com/usdot-jpo-ode/jpo-ode#step-2---build-and-run-the-application), then [GeoJSONConverter](https://github.com/usdot-jpo-ode/jpo-geojsonconverter#step-2---build-and-run-jpo-ode-application), then [ConflictMonitor](https://github.com/usdot-jpo-ode/jpo-conflictmonitor#step-2---build-and-run-jpo-ode-application). Each can be built and run by navigating to their respective directories that contain a pom.xml, then running:

```
mvn install
```

or to skip the tests:

```
mvn install -DskipTests
```


### 3. Configure Conflict Visualizer API

1. Make a copy of the sample properties file api/jpo-conflictvisualizer-api/src/main/resources/application.properties.example and configure it for deployment.

```
cp api/jpo-conflictvisualizer-api/src/main/resources/application.properties.example api/jpo-conflictvisualizer-api/src/main/resources/application.properties
```

2. Edit the newly created application.properties file. Configure, CORS and Email settings as needed.

### 4. Configure Conflict Visualizer GUI

No configuration is explicitly required for the GUI, all environment variables are passed down from the root docker image.

### 5. Setup Docker Environment Variables

1. Make a copy of the sample.env file ./sample.env

```
cp sample.env .env
```

2. Modify the .env file and set the appropriate deployment variables

### 6. Start Conflict Visualizer

There are two options to run the conflict visualizer, the first option is to run all components of the conflict visualizer together from docker-compose (recommended). The second option is to manually start up each component. This provides additional flexibility, but increases how much configuration is required.

#### Start all Components Together

Note: The environment variables for the GUI need to be defined before building the docker images (these are set in the root .env). This is a requirement from Next.js.

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

To Start the ConflictMonitor-GUI (make sure the .env at the root has been copied into the gui directory)

```
cd gui
docker-compose up --build -d
```

## Development Environments

The below section provides additional instruction on how to setup the conflict visualizer components for development. This section describes how to run the components locally to allow for quick changes and rapid iteration.

### 1. Running Conflict Visualizer API Locally

The conflict visualizer API requires the following dependencies be installed to run locally

- Java 21
- Maven

Additionally there are other dependencies installed through maven.
Before building the conflictvisualizer-api. Make sure that local copies of the ODE, JPO-GeoJsonConverter, and JPO-ConflictMonitor have been built and installed on your system. For instructions on building these locally, please see each ones respective repository.

Once these components have been installed. Download and install additional dependencies for the conflict visualizer using the following:

```
cd api/jpo-conflictvisualizer-api
mvn clean install
mvn spring-boot:run
```

### 2. Running Conflict Visualizer GUI Locally

The conflict visualizer Gui requires the following dependencies to be installed to run locally

- Node 17
- npm 8

Copy the .env from the root to the gui directory

```
cp .env ./gui/.env
```

To Install dependencies for the conflict monitor GUI run the following.

```
cd gui
npm install
```

Run GUI

```
npm run dev
```

### 3. Running Smtp4dev

An Smtp4dev server can be used locally to test the Email capabilities of the conflict monitor API and GUI: [smtp4dev](https://github.com/rnwood/smtp4dev). Once running, this server can be connected to the api and GUI.

## Current State of the Project

Currently the CIMMS Conflict Visualizer is under active development.

## License Information

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
file except in compliance with the License.
You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied. See the License for the specific language governing
permissions and limitations under the [License](http://www.apache.org/licenses/LICENSE-2.0).
