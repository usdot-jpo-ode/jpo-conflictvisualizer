# Conflict Visualizer GUI

This is a front end application built off of the jpo-conflictmonitor, which allows users view notifications, visualize events, and update configuration parameters.

## Authentication

This application uses [nextauth](https://next-auth.js.org/) configured to connect to a keycloak instance for authentication. It also utilizes the keycloak admin rest api to list and edit users.

## Running

This application is intended to be run through docker, alongside the API and Keyloak servers. See instructions for this in the root [README.md](../README.md)

### Running Locally (no docker)

The conflict visualizer Gui requires the following dependencies to be installed to run locally

- Node 17
- npm 8

Copy the .env from the root to the gui directory (or create a .env file from the local sample.env)

```
cd ..
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

## Java Classes

This application utilizes typescript. To allow for typing of many of the data classes, a python script is used to convert the java classes from the conflictmonitor into typescript classes. This is located in [./src/models/convert_java_to_ts.py](./src/models/convert_java_to_ts.py). This python script reads the local [jpo-conflictmonitor](../api/jpo-conflictmonitor) submodule to get the java classes. If these classes change, then this python script should be re-run with

```
cd ./src/models
python convert_java_to_ts.py
```
