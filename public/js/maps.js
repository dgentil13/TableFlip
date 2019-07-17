
function startMap() {
    const ironhackBCN = {
        lat: -23.464146,
        lng: -46.878412
    };
    const map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 15,
        center: ironhackBCN
      }
    );

    const myMarker = new google.maps.Marker({
        position: {
            lat: -23.464146,
            lng: -46.878412
        },
        map: map,
        title: "House"
      });
  }
  
  startMap();