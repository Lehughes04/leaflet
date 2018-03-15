var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var plate = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});



var plates = new L.layerGroup();
 d3.json(plate, function (response) {
    function styling(feature) {
      return {
        fillColor: 'steelblue',
        weight: 1,
        opacity: .7,
        color: 'yellow', 
        fillOpacity: 0.2
      };
    }

    L.geoJSON(response, {
      style: styling
    }).addTo(plates);
	plates.addTo(myMap);
})

function createFeatures(earthquakeData) {

  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  
  createMap(earthquakes);
}

function createMap(earthquakes) {

  
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibGVodWdoZXMwNCIsImEiOiJjamVxaWxvenYwcG4wMnZwZ3plYjdmYjNwIn0.1DDfAxtSM5ipCStcNLNCvA");
	
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibGVodWdoZXMwNCIsImEiOiJjamVxaWxvenYwcG4wMnZwZ3plYjdmYjNwIn0.1DDfAxtSM5ipCStcNLNCvA");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibGVodWdoZXMwNCIsImEiOiJjamVxaWxvenYwcG4wMnZwZ3plYjdmYjNwIn0.1DDfAxtSM5ipCStcNLNCvA");
	
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibGVodWdoZXMwNCIsImEiOiJjamVxaWxvenYwcG4wMnZwZ3plYjdmYjNwIn0.1DDfAxtSM5ipCStcNLNCvA");
	
  
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
	"Light Map": lightmap,
	"Sat Map": satellitemap
  };

  
  var overlayMaps = {
    Earthquakes: earthquakes,
	"Tectonic Plates": plates
  };

  
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [lightmap, earthquakes, plates]
  });

  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
