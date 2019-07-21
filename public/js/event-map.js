function startMap() {
    const addressMap = document.getElementById('addressMap').value;

    // Sets the center of the map
    const geocoder = new google.maps.Geocoder();
    const Brazil = { lat: -11.409874,  lng: -41.280857 };
  
    // Initialize the map
    const map = new google.maps.Map(document.getElementById('map'), 
      {
        zoom: 12,
        center: Brazil
      }
    );

    // Gets the address from the edit event form and positions a marker.
    function geocodeAddress(geocoder, resultsMap, address) {
            
      geocoder.geocode({ 'address': address }, function (results, status) {
      
          if (status === 'OK') {
              let marker = new google.maps.Marker({
                  map: resultsMap,
                  position: results[0].geometry.location
              });
  
              map.setCenter(marker.position);
          } else {
          alert('Geocode was not successful for the following reason: ' + status);
          }
      });
    };
    geocodeAddress(geocoder, map, addressMap);
};
  
  startMap();