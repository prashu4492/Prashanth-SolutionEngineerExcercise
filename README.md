# Prashanth-SolutionEngineerExcercise
Web application to create a driving route using NextBillion.AI APIs

---------------------------------------------------------------------------------------------------------------------

Technologies used:

A simple Web Application to showcase NextBillion Routing API's capabilities was developed and the application is designed to display a route from the user's current location to a nearby Point of Interest. The technologies used to build the application are as follows.
- HTML
- CSS
- Javascript(includes NextBillion Javascript framework)
- JQuery

---------------------------------------------------------------------------------------------------------------------

How to run the file and check application capabilities/workflow:
- Open the index.html file on a web browser(Google Chrome is preferred).
- On load of the index.html file, you can view the NextBillion.AI map with a sidebar that allows user to search for a place name/POI.
- Use the search box to input text to search for place name/POI.
- Searchbox will provide suggestions through dropdown on entering a minimum of 3 characters based on NextBillion.AI geocode service.
- Based on the suggestions provided, user can choose a suggestion that matches with the matching place/POI they are looking for. 
- The selection will now be the destination point that the user wants to find the route.
- Once selected, user can click on "Show Route" button below the search box to get a route from his current location to the destination point.
- On clicking "Show Route" button, the user will be prompted by the web browser to allow detection of user's current location.
- On allowing the request, user's current location detected by the browser will be considered as the start point for the route.
- Based on the available start and end coordinates, NextBillion.AI DirectionService creates a route between the 2 points.
- The route is then displayed to the user in the fron-end application along with other route related information like the distance and duration in the sidebar.
- Once the route is displayed, user can also clear the route by clicking on the "Clear Route" button and repeat the route creation process 'n' number of times.

---------------------------------------------------------------------------------------------------------------------
