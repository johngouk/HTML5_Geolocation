function showPosition(position) {
  clearTimeout(getLocationTimeout);
  getLocationTimeout = 0;
  $('#demo').html("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude +
    "<br>Accuracy: " + position.coords.accuracy +
    "<br>Altitude: " + position.coords.altitude +
    "<br>AtlAccuracy: " + position.coords.altitudeAccuracy +
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

});
