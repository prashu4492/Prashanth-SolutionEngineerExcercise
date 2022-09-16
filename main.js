var dstPointLatLng = new Object;
var distanceElement = document.getElementById("distanceValue");
var durationElement = document.getElementById("durationValue");

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function searchInput(elementID, markUpPoint) {
    var tempRequestData;
    dstPointLatLng = new Object;
    $("#" + elementID).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "https://api.nextbillion.io/h/geocode?key=ca75452cbfff4d5585d9a376ab4b0d89&q=" + request.term + "&in=countryCode:IND",
                dataType: "json",
                success: function (data) {
                    tempRequestData = data;
                    var tempArr = new Array;
                        for (var i = 0; i < data.items.length; i++) {
                            var tempObj = {};
                                tempObj.value = data.items[i].title;
                                tempObj.label = tempObj.value;
                                tempObj.details = data.items[i];
                                tempArr.push(tempObj);
                        }
                    console.log("RevGeocode data ===> ",tempArr);
                response(tempArr);
                }
            });
        },
        focus: function (event, ui) {
            $("#" + elementID).val(ui.item.title);
            return false;
        },
        minLength: 3,
        select: function (event, ui) {
            console.log(ui);
            dstPointLatLng = ui.item.details.position;
            console.log("Destination Point Coordinates ===> ",dstPointLatLng);
        }
    });
}


function getCurrentPos(destinationLocation) {
    var checkDstPoint = isEmpty(destinationLocation);
    if (checkDstPoint == false){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showRoute);
          } else { 
            alert("Geolocation is not supported by this browser.");
          }
    }
    else{
        alert("Please select your destination from the searchbox!")
    }
  
  function showRoute(position) {
    console.log("Start Point Coordinates ===> ",position);
    var directionsService = new nextbillion.maps.DirectionsService();
        directionsService.route({
            origin: { lat: position.coords.latitude, lng: position.coords.longitude },
            destination: { lat: destinationLocation.lat, lng: destinationLocation.lng },
            steps: true,
            mode: 'car'
        })
        .then((response) => {
            console.log("Route Details ===> ",response);
            map.map.addSource("route", {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                type: "LineString",
                coordinates: nextbillion.utils.polyline
                    .decode(response.routes[0].geometry, 6)
                    .map((c) => c.reverse())
                }
            }
            });
        
            // Center map location as per route
            mapCenterLat = (response.routes[0].start_location.latitude + response.routes[0].end_location.latitude)/2;
            mapCenterLon = (response.routes[0].start_location.longitude + response.routes[0].end_location.longitude)/2;
            map.map.setCenter({lat:mapCenterLat, lng:mapCenterLon});

            // Add origin and destination point markers 
            const originElement = document.createElement('div');
            originElement.className = 'origin-marker';
            originElement.style.backgroundImage = 'url(https://img.icons8.com/emoji/344/red-circle-emoji.png)';
            originElement.style.backgroundSize = "cover";
            originElement.style.width = "36px";
            originElement.style.height = "36px";
            const originMarker = new nextbillion.maps.Marker({
                element: originElement
            })
                .setLngLat({lat:response.routes[0].start_location.latitude, lng:response.routes[0].start_location.longitude})
                .addTo(map.map);
            originMarker.togglePopup();

            const destinationElement = document.createElement('div');
                destinationElement.className = 'destination-marker';
                destinationElement.style.backgroundImage = 'url(https://img.icons8.com/small/344/filled-circle.png)';
                destinationElement.style.backgroundSize = "cover";
                destinationElement.style.width = "36px";
                destinationElement.style.height = "36px";
                const destinationMarker = new nextbillion.maps.Marker({
                    element: destinationElement
                })
                    .setLngLat({lat:response.routes[0].end_location.latitude, lng:response.routes[0].end_location.longitude})
                    .addTo(map.map);
                destinationMarker.togglePopup();
            
            // Add route layer on map
            map.map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round"
                },
                paint: {
                    "line-color": "#8D5A9E",
                    "line-width": 4
                }
            });

            // Update distance and duration element
            distanceElement.append((response.routes[0].distance / 1000).toFixed(2) + " Km"); 
            durationElement.append((response.routes[0].duration / 60).toFixed(2) + " Mins");
            document.getElementsByClassName("routeInfoContainer")[0].style.visibility = 'visible';
        });
    }
}

    function clearRoute(){
        document.querySelector(".origin-marker").remove();
        document.querySelector(".destination-marker").remove();
        map.map.removeLayer("route");
        map.map.removeSource("route");
        document.getElementById("dstPt").value = '';
        document.getElementsByClassName("routeInfoContainer")[0].style.visibility = 'hidden';
        distanceElement.innerHTML = "Distance: ";
        durationElement.innerHTML = "Duration: ";
        dstPointLatLng = new Object;
    }