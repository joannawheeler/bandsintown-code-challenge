    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    //localhost:3000/?artist=:url_escaped_artist_name
    //add this to the bandsintown api request in the GET path
    var urlArtist = getUrlParameter('artist');
    // console.log(urlArtist);

    // console.log(it.slice(1))

    var artistName = encodeURIComponent(urlArtist.slice(1));
    // console.log(artistName);

    var auth = "?app_id=bit_challenge";
    var requestURL = "https://rest.bandsintown.com/artists/" + artistName;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL + auth);
    request.responseType = "json";
    request.send();

    request.onload = function() {
        var artistData = request.response;
        var responseArtistName = artistData.name;
        var artistThumbUrl = artistData.thumb_url;
        document.getElementById("artistN").innerHTML = responseArtistName;
        document.getElementById("thumbImage").src = artistThumbUrl;
    };

    var secondRequest = new XMLHttpRequest();
    secondRequest.open('GET', requestURL + "/events" + auth);
    secondRequest.responseType = "json";
    secondRequest.send();

    secondRequest.onload = function() {
        var artistEvents = secondRequest.response;

        if (artistEvents.length >= 1) {
            for (var i = 0; i < artistEvents.length; i++) {
                var table = document.getElementById("table");
                table.className = "table";
                var row = document.createElement("div");
                row.className = "row";
                table.appendChild(row);

                var dateAndTime = artistEvents[i].datetime;
                var monthDate = moment(dateAndTime).format("MMM D");
                var newMonthDateNode = document.createElement("span");
                newMonthDateNode.className = "monthDate";
                newMonthDateNode.textContent = monthDate;
                row.appendChild(newMonthDateNode);

                var venueName = artistEvents[i].venue.name;
                var newVenueName = document.createElement("span");
                newVenueName.className = "venueName";
                newVenueName.textContent = venueName;
                row.appendChild(newVenueName);

                var venueLocation;
                if (artistEvents[i].venue.country === "United States") {
                    venueLocation = venue.city + ", " + venue.region;
                } else {
                    venueLocation = artistEvents[i].venue.city + ", " + artistEvents[i].venue.country;
                }
                var newVenueLocation = document.createElement("span");
                newVenueLocation.className = "venueLocation";
                newVenueLocation.textContent = venueLocation;
                row.appendChild(newVenueLocation);

                var newTicketButton;
                if (artistEvents[i].offers.length >= 1) {
                    var newButton = document.createElement("a");
                    newButton.textContent = "Tickets";
                    newButton.setAttribute('href', artistEvents[i].offers[0].url);
                    newTicketButton = document.createElement("span");
                    newTicketButton.className = "ticketsButton";
                    newTicketButton.appendChild(newButton);
                } else {
                    newTicketButton = document.createElement("span");
                    newTicketButton.className = "ticketsButton";
                    newTicketButton.textContent = "";
                }

                row.appendChild(newTicketButton);
            }
        } else {
            var tableElem = document.getElementById("table");
            tableElem.textContent = "No upcoming events.";
            tableElem.className = "noUpcomingEvents";
        }
    };