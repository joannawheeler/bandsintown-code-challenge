    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    var urlArtist = getUrlParameter('artist');

    var artistName = encodeURIComponent(urlArtist.slice(1));

    var auth = "?app_id=bit_challenge";
    var requestURL = "https://rest.bandsintown.com/artists/" + artistName;
    var artistRequest = new XMLHttpRequest();
    artistRequest.open('GET', requestURL + auth);
    artistRequest.responseType = "json";
    artistRequest.send();

    artistRequest.onload = function() {
        var artistData = artistRequest.response;
        var  resArtistName = artistData.name;
        var resArtistThumbUrl = artistData.thumb_url;
        document.getElementById("artistName").textContent =  resArtistName;
        document.getElementById("thumbImage").src = resArtistThumbUrl;
    };

    var eventsRequest = new XMLHttpRequest();
    eventsRequest.open('GET', requestURL + "/events" + auth);
    eventsRequest.responseType = "json";
    eventsRequest.send();

    eventsRequest.onload = function() {
        var artistEvents = eventsRequest.response;
        if (artistEvents.length >= 1) {
            for (var i = 0; i < artistEvents.length; i++) {
                var eventsTable = document.getElementById("eventsTable");
                var row = document.createElement("div");
                row.className = "row";
                eventsTable.appendChild(row);

                var dateAndTime = artistEvents[i].datetime;
                var monthDate = moment(dateAndTime).format("MMM D");
                var newMonthDate = document.createElement("span");
                newMonthDate.className = "monthDate";
                newMonthDate.textContent = monthDate;
                row.appendChild(newMonthDate);

                var venueName = artistEvents[i].venue.name;
                var newVenueName = document.createElement("span");
                newVenueName.className = "venueName";
                newVenueName.textContent = venueName;
                row.appendChild(newVenueName);

                var venueLocation;
                if (artistEvents[i].venue.country === "United States") {
                    venueLocation = artistEvents[i].venue.city + ", " + artistEvents[i].venue.region;
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
            var tableElem = document.getElementById("eventsTable");
            tableElem.textContent = "No upcoming events.";
            tableElem.className = "text-noUpcomingEvents";
        }
    };