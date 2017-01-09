var map = L.map('map', {
    center: [34, -13],
    zoom: 2.5,
});

//background
var tiles = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

//add background
tiles.addTo(map);

//add geojson, style it, add popup
function addDataToMap(data, map) {

    var dataLayer = L.geoJson(data, {
    
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: 'red',
                weight: 1,
                stroke: 2,
                //sets radius size based on maginude of earthquake
                radius: feature.properties.mag * 6
            });
        },
        onEachFeature: function (feature, layer) {
            var popupText = "<b>Magnitude:</b> " + feature.properties.mag +
                            "<br><b>Place:</b> " + feature.properties.place +
                            "<br><a href=" + feature.properties.url + ' target="_blank">More Details</a>';
            layer.bindPopup(popupText);
        },


    });
    
    //places smaller markers in front of larger ones
    data.features.sort(function (a, b) {
          return b.properties.mag - a.properties.mag;
      });
    
    dataLayer.addTo(map);
}

//get usgs earthquake geojson
$.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson", function (data) {
    addDataToMap(data, map);
});


//add explanation
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this._div.innerHTML = 'This map shows the earthquakes above a 1.0 magnitude that occurred today <br>' +
                        'Source: <a href="http://earthquake.usgs.gov/earthquakes/"target="_blank">USGS</a>';
    //this.update();
    return this._div;
};

info.addTo(map);