var getParams = {maximumAge:60000, timeout:5000, enableHighAccuracy:true}; // Not currently used
var weatherURL = "https://dataservice.accuweather.com/locations/v1/cities/search?apikey=Kh2fOXMXIZS1geBmXqKnstfbbmOpW8up&q=RG306AF";
var serverURL = "https://server.local/cgi-bin/test.py?url=";
var echoURL = "https://server.local/cgi-bin/echo.py?url=";

function showPosition(position) {
  clearTimeout(getLocationTimeout);
  getLocationTimeout = 0;
  $('#demo').html("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude +
    "<br>Accuracy: " + position.coords.accuracy +
    "<br>Altitude: " + position.coords.altitude +
    "<br>AltAccuracy: " + position.coords.altitudeAccuracy +
    "<br>Heading: " + position.coords.heading +
    "<br>Speed: " + position.coords.speed +
    "<br>Timestamp: " + position.timestamp);
}

function errorPosition(error){
  clearTimeout(getLocationTimeout);
  getLocationTimeout = 0;
    switch(error.code) {
      case error.PERMISSION_DENIED:
        $('#demo').text("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        $('#demo').text("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        $('#demo').text("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        $('#demo').text("An unknown error occurred.");
        break;
    }
}

function getLocationFailed (){
  $('#demo').text("getCurrentPosition timed out!");
}

function getWeatherError(xhr, statusCode, error) {
  console.log("gWE:"+statusCode+error);
}

function getWeatherOk(result, statusCode, xhr){
  console.log("gWO:status:"+statusCode+":result:"+result[0]);
  if (statusCode == "success"){
//    console.log("gWO: values:"+Object.values(result[0]));
//    var resultJSON = JSON.parse(result);
    console.log ("Result:\n" + Object.entries(result[0]));
  } else {
    console.log("status:"+statusCode);
  }
}

function getEchoOk(result, statusCode, xhr){
  console.log("gEO:status:"+statusCode+":result:"+result);
  if (statusCode == "success"){
    console.log("gEO: values:"+Object.values(result[0]));
    $("#demo").html(result);
  } else {
    console.log("status:"+statusCode);
  }
}


let getLocationTimeout = 0;

$(document).ready(function() {
      console.log("Document ready!");
//      $('#demo').text("Geolocation is not supported by this browser.");

      $('#getLocation').click(function() {
        console.log("location requested");
          
          if (navigator.geolocation) {
            if (getLocationTimeout != 0) {
              clearTimeout(getLocationTimeout);
              getLocationTimeout = 0;
            }
            getLocationTimeout = setTimeout(getLocationFailed, 100000);
            navigator.geolocation.getCurrentPosition(showPosition, errorPosition, {timeout:90000});
          } else {
            $('#demo').text("Geolocation is not supported by this browser.");
          }
      });

      $('#getWeather').click(function() {
        console.log("URL: "+serverURL+escape(weatherURL));
        $.getJSON(serverURL+escape(weatherURL), getWeatherOk);
//        $.get(serverURL+escape(weatherURL), getWeatherOk);
        console.log("Sent request");
      });

      $('#getEcho').click(function() {
        console.log("URL: "+echoURL+escape(weatherURL));
        $.get(echoURL+escape(weatherURL), getEchoOk);
        console.log("Sent request");
      });


});
