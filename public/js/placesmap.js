let map;
let infowindow;
let home;
function initMap() {
  // let home = new google.maps.LatLng(-23.536862, -46.576731);
  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: home,
    zoom: 15
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const user_location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        home = new google.maps.LatLng(user_location.lat, user_location.lng);
        // Center map with user location
        map.setCenter(user_location);

        const request = {
          location: home,
          radius: "600",
          query: ["loja jogos"]
        };

        const service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
      },
      function() {
        console.log("Error in the geolocation service.");
      }
    );
  } else {
    const request = {
      location: home,
      radius: "600",
      query: ["loja jogos"]
    };

    const service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
    console.log("Browser does not support geolocation.");
  }

  const geocoder = new google.maps.Geocoder();

  document.getElementById("submit").addEventListener("click", function() {
    console.log('foi')
    geocodeAddress(geocoder, map);
  });

  function geocodeAddress(geocoder, resultsMap) {
    let address = document.getElementById("address").value;

    geocoder.geocode({ address: address }, function(results, status) {
      if (status === "OK") {
        resultsMap.setCenter(results[0].geometry.location);
        // let marker = new google.maps.Marker({
        //   map: resultsMap,
        //   position: results[0].geometry.location
        // });
        let lat = results[0].geometry.location.lat();
        let long = results[0].geometry.location.lng();

        home = new google.maps.LatLng(lat, long);
        // Center map with user location

        const request = {
          location: home,
          radius: "600",
          query: ["loja jogos"]
        };

    const service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      let place = results[i];

      createMarker(results[i]);
    }
  }
}
function createMarker(place) {
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

initMap();
