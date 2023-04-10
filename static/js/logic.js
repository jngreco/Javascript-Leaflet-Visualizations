// Store url in a variable
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(url).then(function (data) {
  // Check console
  console.log(data);
  newFeature(data.features);
});

// Set marker size
function markerSize(magnitude) {
  return magnitude * 25000;
};

// Function to determine marker color by depth
function color(depth){
    if (depth < 10) return "#2AA10F";
    else if (depth < 30) return "#92E000";
    else if (depth < 50) return "#E1FF00";
    else if (depth < 70) return "#F58B00";
    else if (depth < 90) return "#DE3700";
    else return "#B20000";
  }



function newFeature(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth (Km): ${feature.geometry.coordinates[2]}</p>`);
  }

  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, point) {

      // Create marker style based on depth and magnitude
      let markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: color(feature.geometry.coordinates[2]),
        fillOpacity: 0.65,
        color: "blue",
        stroke: true,
        weight: 0.5
      }
      return L.circle(point,markers);
    }
  });
  createMap(earthquakes);
}

// SOLVED WITH HELP FROM ASKBCS 
function createMap(earthquakes) {

  // Create tile layer
  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

  let myMap = L.map("map", {
    center: [8.5380, -80.7821], //Panama
    zoom: 4,
    layers: [street, earthquakes]
  });

// Here we create a legend control object.
    var legend = L.control({
        position: "bottomleft"
    });
    // Then add all the details for the legend
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = [
        "#2AA10F",
        "#92E000",
        "#E1FF00",
        "#F58B00",
        "#DE3700",
        "#B20000",
        ];
        div.innerHTML += "<h3 style='text-align: center'>Earthquake Depth (Km)</h3>"
        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
    return div;
  };
  // Finally, we our legend to the map.
  legend.addTo(myMap)};