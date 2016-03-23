var georgetownMap = {
  init: function() {
    // Set up the map.
    this.setupMap();
    var _this = this;

    // Get the GeoJSON file.
    $.ajax({
      url: 'geojson/export.geojson',

      // If successful, do a bunch of stuff.
      success: function(data) {
        dataObj = $.parseJSON(data);

        // Display building info on click.
        _this.displayBuildingInfo(dataObj);

        // Setup earch event.
        _this.setupSearch(dataObj, _this);
      }
    });
  },


  /* ***
   * Function to set up and display the Mapbox map.
   */

  setupMap: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoicmFwNDIiLCJhIjoiY2lsOW01N2VvMGxxYnc3a3J2MHBvNGNoYyJ9.vFDYQ6CFBZkadxV4D6mhaQ';

    this.map = L.mapbox.map('map').setView([38.9089,-77.0741], 16);
    L.mapbox.styleLayer('mapbox://styles/rap42/cim4034a500fqa0m47wrv44z9').addTo(this.map);

  },


  /* ***
   * Function to display building information on click.
   */

  displayBuildingInfo: function(data) {
    // var layer = L.mapbox.featureLayer().addTo(this.map);
    var georgetownLayer = L.geoJson(data, {
      style: L.mapbox.simplestyle.style,
      onEachFeature: onEachFeature
    }).addTo(this.map)
    var info = $('#info');

    // layer.setGeoJSON(data);

    function mousemove(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 3,
        color: '#867875',
        fillColor: '#011e41',
        fillOpacity: 0.9
      });
    }

    function mouseout(e) {
        georgetownLayer.resetStyle(e.target);
    }

    function showDetails(e) {
      var layer = e.target;

      var content = '';
      if (layer.feature.properties.name) {
        var content = '<div><strong>' + layer.feature.properties.name + '</strong><br />' + layer.feature.properties['addr:housenumber'] + ' ' + layer.feature.properties['addr:street'] + '</div>';
      }

      info.html(content);
    }

    // layer.on('click',function(e) {
    //   var feature = e.layer.feature;
    //
    //   var content = '';
    //   if (feature.properties.name) {
    //     var content = '<div><strong>' + feature.properties.name + '</strong>';
    //   }
    //
    //   info.html(content);
    // });

    function onEachFeature(feature, layer) {
      layer.on({
          mousemove: mousemove,
          mouseout: mouseout,
          click: showDetails
      });
    }
  },


  /* ***
   * Search
   */

  setupSearch: function(data, context) {
    $('#search').keyup(function() {
      var searchString = $(this).val().toLowerCase();

      $.each(data.features, function(i, obj) {
        if (obj.properties.name && obj.properties.name.toLowerCase() == searchString) {

          L.marker([obj.geometry.coordinates[0], obj.geometry.coordinates[1]], {
            icon: L.mapbox.marker.icon({
              'marker-color': '#fa0'
            })
          }).addTo(context.map);

          return;
        }
      });
    });
  }
};

georgetownMap.init();
