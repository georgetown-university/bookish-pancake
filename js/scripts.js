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
    L.mapbox.accessToken = 'pk.eyJ1IjoiYWNwODgiLCJhIjoiY2ltMmd2ZzRpMDAwdDVsa3NnYzM3ajRhOSJ9.RPCYqcmXqi2GJR1LyRjXWQ';

    this.map = L.mapbox.map('map').setView([38.9089,-77.0741], 16);
    L.mapbox.styleLayer('mapbox://styles/acp88/cim41zb3600fl9jkpjno0y6as').addTo(this.map);
  },


  /* ***
   * Function to display building information on click.
   */

  displayBuildingInfo: function(data) {
    var layer = L.mapbox.featureLayer().addTo(this.map);
    var info = $('#info');

    layer.setGeoJSON(data);

    layer.on('click',function(e) {
      var feature = e.layer.feature;

      var content = '';
      if (feature.properties.name) {
        var content = '<div><strong>' + feature.properties.name + '</strong>';
      }

      info.html(content);
    });
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
