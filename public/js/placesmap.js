let map;
let infowindow;
let markers = [];
function initMap() {
  // displays info box above marker
  infowindow = new google.maps.InfoWindow();
  //sets default location for map
  let defaultLoc = new google.maps.LatLng(-23.536862, -46.576731);

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLoc,
    zoom: 15
  });
  // Autocomplete for input field
  let input = document.getElementById("address");
  autocomplete = new google.maps.places.Autocomplete(input);

  // Gets users location by browser and sets it on the map
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const user_location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Center map with user location
        map.setCenter(user_location);

        const myPlace = new google.maps.LatLng(
          user_location.lat,
          user_location.lng
        );
        // Request for a text based search in google maps
        const request = {
          location: myPlace,
          radius: 50,
          query: "jogos"
        };
        const service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
      },
      function() {
        console.log("Error in the geolocation service.");
      }
    );
  } else {
    // If the geolocation can't be activated
    const request = {
      location: home,
      radius: 50,
      query: "loja jogos"
    };
    const service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

    console.log("Browser does not support geolocation.");
  }

  // Searching places using input field for address
  const geocoder = new google.maps.Geocoder();

  document.getElementById("submit").addEventListener("click", function() {
    geocodeAddress(geocoder, map);
  });

  function geocodeAddress(geocoder, resultsMap) {
    let address = document.getElementById("address").value;

    geocoder.geocode({ address: address }, function(results, status) {
      if (status === "OK") {
        resultsMap.setCenter(results[0].geometry.location);

        let lat = results[0].geometry.location.lat();
        let long = results[0].geometry.location.lng();

        const addressLoc = new google.maps.LatLng(lat, long);
        const request = {
          location: addressLoc,
          radius: 50,
          query: "loja jogos"
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
      createMarker(place);
    }
  }
}

// Creates markers
function createMarker(place) {
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  // marker arrays for deleting themm later
  markers.push(marker);
  // adds info box above marker
  google.maps.event.addListener(marker, "click", function() {
  var contentString = `<h5> ${place.name}</h5>
                      <p> ${place.formatted_address}</p>`
                      console.log(place)
    infowindow.setContent(contentString);
    infowindow.open(map, this);
  });
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

initMap();
