var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// perform a GET request to the URL
d3.json(queryUrl,function(data){
    // Sending data.features objects to the createFeature function
    // console.log(data.features)
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    function onEachFeature(feature, layer){
        layer.bindPopup("<p>" + feature.properties.place + "</p><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function style(feature){
        return {
            radius: 4 * feature.properties.mag,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
            
        };
    }
     function chooseColor(mag){
        switch(true){
            case mag>5:
                return "#f03b20";
            case mag>4:
                return "#fd8d3c";
            case mag>3:
                return "#fecc5c";
            case mag>2:
                return "#ffffb2";
            case mag>1:
                return "#99d594";
            default:
                return "#2ca25f";
        }
    };

 var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
     pointToLayer: function (feature, latlng) {
         return L.circleMarker(latlng);
     },
    style: style


});
    
    // Create a GeoJSON layer containing the features array on the earthquakeData object 
    createMap(earthquakes)
};

// Sending earthquakes layer to the createMap function
function createMap(earthquakes){

    // Set up the legend
    
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 10,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    function getColor(d){
        return d > 5 ? "#f03b20" :
            d > 4 ? "#fd8d3c" :
            d > 3 ? "#fecc5c" :
            d > 2 ? "#ffffb2" :
            d > 1 ? "#99d594":
            d > 0 ? "#2ca25f" :
                    '#FFEDA0';
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0,1,2,3,4,5],
            labels = [];    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }   
        return div;
    };

    legend.addTo(myMap); 
};


