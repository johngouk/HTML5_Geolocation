var getParams = {maximumAge:60000, timeout:5000, enableHighAccuracy:true}; // Not currently used
var locationURL = "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=Kh2fOXMXIZS1geBmXqKnstfbbmOpW8up&q=";
var locationPlaceHolder= "XXXXXXX";
var weatherURL = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+locationPlaceHolder+"?apikey=Kh2fOXMXIZS1geBmXqKnstfbbmOpW8up&metric=true"
var iconPlaceHolder = "XX";
var iconURL = "https://developer.accuweather.com/sites/default/files/XX-s.png";
var serverURL = "https://server.local/cgi-bin/test.py?url=";
var echoURL = "https://server.local/cgi-bin/echo.py?url=";
var positionLat = "";
var positionLon = "";
var locationKey = "";

var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function showPosition(position) {
  clearTimeout(getPositionTimeout);
  getPositionTimeout = 0;
  $('#position').html("Latitude: " + position.coords.latitude +
    " Longitude: " + position.coords.longitude +
    " Accuracy: " + position.coords.accuracy +
    "<br>Altitude: " + position.coords.altitude +
    " AltAccuracy: " + position.coords.altitudeAccuracy +
    "<br>Heading: " + position.coords.heading +
    " Speed: " + position.coords.speed +
    "<br>Timestamp: " + position.timestamp);
    positionLat = position.coords.latitude;
    positionLon = position.coords.longitude;
}

function errorPosition(error){
  clearTimeout(getPositionTimeout);
  getPositionTimeout = 0;
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

function getPositionFailed (){
  $('#demo').text("getCurrentPosition timed out!");
}

function getLocationError(xhr, statusCode, error) {
  console.log("gWE:"+statusCode+error);
}

function getLocationOk(result, statusCode, xhr){
  console.log("gLO:status:"+statusCode+":result:"+result);
  if (statusCode == "success"){
    console.log ("gLO:\n" + Object.entries(result));
    $("#location").html("<b>Key:</b>"+result.Key+" <b>Name:</b>"+result.LocalizedName+" <b>CountryID:</b>"+result.Country.ID);
    locationKey = result.Key;
  } else {
    console.log("status:"+statusCode);
  }
}

function padZero(theNumber){
  var ns = theNumber.toString();
  if (ns.length<2) {
    ns = "0"+ns;
  }
  return ns;
}

function setTrValue(id, day, high, low, iconId, prec, phrase){
  var trValue = '<tr id="row-'+id+'">'+
                  '<td>'+day+'</td>'+
                  '<td>'+high+'</td>'+
                  '<td>'+low+'</td>'+
                  '<td><img src="'+iconURL.replace(iconPlaceHolder,padZero(iconId))+'" width="75" height="45" alt="'+phrase+'" title="'+phrase+'"></td>'+
                  '<td>'+phrase+'</td>'+
                  '</tr>';
    console.log("trValue:"+trValue);
  return trValue;
}


function getWeatherOk(result, statusCode, xhr){
  console.log("gWO:status:"+statusCode+":result:"+result);
  if (statusCode == "success"){

    for (var i = 0;i<result.DailyForecasts.length;i++){
      date = new Date(result.DailyForecasts[i].EpochDate*1000);
      $('#weather-table').append(setTrValue(i,
                          weekdays[date.getDay()], 
                          result.DailyForecasts[i].Temperature.Maximum.Value, 
                          result.DailyForecasts[i].Temperature.Minimum.Value, 
                          result.DailyForecasts[i].Day.Icon, 
                          result.DailyForecasts[i].Day.PrecipitationIntensity+" "+
                            result.DailyForecasts[i].Day.PrecipitationType+" "+
                            result.DailyForecasts[i].Day.IconPhrase, 
                          result.DailyForecasts[i].Day.IconPhrase));
    }
  } else {
    console.log("status:"+statusCode);
  }
}


let getPositionTimeout = 0;

$(document).ready(function() {
      console.log("Document ready!");

      $('#getPosition').click(function() {
        console.log("location requested");
          
          if (navigator.geolocation) {
            if (getPositionTimeout != 0) {
              clearTimeout(getPositionTimeout);
              getPositionTimeout = 0;
            }
            getPositionTimeout = setTimeout(getPositionFailed, 100000);
            navigator.geolocation.getCurrentPosition(showPosition, errorPosition, {timeout:90000});
          } else {
            $('#position').text("Geolocation is not supported by this browser.");
          }
      });

      $('#getLocation').click(function() {
        if (positionLat == "" && positionLon ==""){
          $('#location').text("Need to get GPS position first!");
        } else {
          var url = escape(locationURL+positionLat+","+positionLon);
          console.log("URL: "+serverURL+url);
          $.getJSON(serverURL+url, getLocationOk);
          console.log("Sent request");
        }
      });

      $('#getWeather').click(function() {
        var url = escape(weatherURL.replace(locationPlaceHolder, locationKey));
        console.log("URL: "+serverURL+url);
        $.getJSON(serverURL+url, getWeatherOk);
        console.log("Sent request");
      });


});
