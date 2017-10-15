function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $("#weather").text("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    
    $.get( "https://fcc-weather-api.glitch.me/api/current", { lat: position.coords.latitude, lon: position.coords.longitude } )
    .done(function( data ) {
      
      var whtml = data.name + 
        "<br>"+data.weather[0].main;

      $("#weather").html(whtml);

      var temp = "Temperature: <span id=\"temp-nb\">"+
        Math.round(data.main.temp)+
        "</span>°C";

      $("#temp").html(temp);
      $("#temp").css("display: inline");
      
      $("#pic").attr("src", data.weather[0].icon);


    });
}

getLocation();

$(document).ready(function () {

  $('#Fahrenheit').on('click', function() {
    if($(this).hasClass('active')) {
  
    }
    else {
    var temp = "Temperature: <span id=\"temp-nb\">"+
        Math.round(Number($("#temp-nb").text())*1.8 + 32)+
        "</span>°F";
    $("#temp").html(temp);
    }
  });
  

  $('#Celsius').on('click', function() {
    if($(this).hasClass('active')) {
  
    }
    else {
      var temp = "Temperature: <span id=\"temp-nb\">"+
          Math.round((Number($("#temp-nb").text())-32)/1.8)+
          "</span>°C";
      $("#temp").html(temp);
    }
  });
});



