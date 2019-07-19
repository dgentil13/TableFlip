function startMap() {
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  // Store Ironhack's coordinates
  const Brazil = { lat: -11.409874, lng: -41.280857 };

  // Initialize the map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: Brazil
  });

  function geocodeAddress(geocoder, resultsMap, user) {
    geocoder.geocode({ address: user.address }, function(results, status) {
      if (status === "OK") {
        let marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });

        const fullName = `${user.firstName} ${user.lastName} <br> ${
          user.email
        }`;

        google.maps.event.addListener(marker, "click", function() {
          infowindow.setContent(fullName);
          infowindow.open(map, this);
        });
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  const peopleList = document.getElementById("people-list");
  let people = ``;

  axios.get("http://tableflips.herokuapp.com/get-address").then(response => {
    let count = 1;
    response.data.forEach(element => {
      if (element.address) {
        people += `
                 <div class=" pb-4 friend d-flex flex-wrap mb-3">     
                 <img class="img-map rounded-circle col-lg-6 col-md-3 col-sm-4" src=${element.imageUrl}>
                   <div>
                      <h4 class="text-uppercase"> ${element.firstName} ${element.lastName}</h4>
                      <button type="button" class="btn btn-primary btn-sign mt-4" data-toggle="modal" data-target="#modalExemplo${count}"> Send Email! </button>
                    </div>   
                 </div>
                    
                    <!-- Modal -->
                    <div class="modal fade" id="modalExemplo${count}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                          <div class="email-name">
                            <h5 class="modal-title" id="exampleModalLabel">Send ${element.firstName} an email!</h5>
                          </div>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                              <span aria-hidden="true">&times;</span>
                            </button>
                            </div>

                          <div class="modal-body text-center">

                            <form action="/sendemail" method="POST" id="form-container">
                              <div class="sign-input form-group">
                                <label for="exampleInputEmail1">Email</label>
                                <input id="email" class="input-form form-control" type="text" name="email" value="${element.email}">
                              </div>
                              <div class="sign-input form-group">
                                <label for="email-body">Message</label>
                                <textarea id="message" class="input-form form-control" name="message" placeholder="Write a message!"></textarea>
                              </div>
                               <button type="submit" class="btn btn-primary btn-sign btn-email">Send</button>
                            </form>
                          </div>
                      </div>
                    </div>
                    </div>`;
                    }
                    geocodeAddress(geocoder, map, element);
                    count +=1;
                  });
    peopleList.innerHTML = people;

  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const user_location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Center map with user location
        map.setCenter(user_location);

        // Add a marker for your user location
        const userLocation = new google.maps.Marker({
          position: {
            lat: user_location.lat,
            lng: user_location.lng
          },
          map: map,
          title: "You are here."
        });
      }
    );
  } else {
    console.log("Browser does not support geolocation.");
  }
}

startMap();
