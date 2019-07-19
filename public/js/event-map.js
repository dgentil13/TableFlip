

function startMap() {
    const addressMap = document.getElementById('addressMap').value;
  // Autocomplete for input field


    const geocoder = new google.maps.Geocoder();
    // Store Ironhack's coordinates
    const Brazil = { lat: -11.409874,  lng: -41.280857 };
  
    // Initialize the map
    const map = new google.maps.Map(document.getElementById('map'), 
      {
        zoom: 12,
        center: Brazil
      }
    );
  
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