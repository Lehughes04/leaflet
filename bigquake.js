var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap
  var lightmap = L.tileLayer("http://api.mapbox.com/v4/mapbox.light.html?access_token=pk.eyJ1IjoibGVodWdoZXMwNCIsImEiOiJjamViam95dTMwZ21sMnpta3puMnk0bTNuIn0.Xmxmk_XBm7cKlyLgXqkbYg#3/0.00/0.00");
	
	var piratemap = L.tileLayer("http://api.mapbox.com/v4/mapbox.pirates.html?access_token=pk.eyJ1IjoibGVodWdoZXMwNCIsImEiOiJjamViam95dTMwZ21sMnpta3puMnk0bTNuIn0.Xmxmk_XBm7cKlyLgXqkbYg#3/0.00/0.00");

     // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Pirate Map": piratemap
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}