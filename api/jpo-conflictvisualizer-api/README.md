# Conflict Visualizer

The Conflict Visualizer enables users to see events and assessments generated by the conflict monitor application. 


# Dependencies

The conflict Visualizer is dependent on the jpo-conflictmonitor, the jpo-geojsonconverter, and the jpo-ode.


# Setup
To setup the Conflict Monitor API, rename the application.properties.example file to application.properties
Fill in any missing data in the file before running the API to ensure proper operation.

# Swagger API

The conflict visualizer API utilizes swagger for viewing and testing api endpoints. The Swagger endpoint can be accessed here:
http://localhost:8088/swagger-ui/index.html


To facilitate easy development of front-end applications, the Conflict Visualizer API is equipped with the capability to provide testData from each of its endpoints. To retrieve test data, set the url param testData to True when making the request.

