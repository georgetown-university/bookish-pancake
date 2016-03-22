var georgetownMap = {
  init: function() {
    var _this = this;

    // Set up the map.
    this.setupMap();

    // Get the GeoJSON file.
    $.ajax({
      url: 'geojson/export.geojson',

      // If successful, do a bunch of stuff.
      success: function(data) {
        dataObj = $.parseJSON(data);

        // Display building info on click.
        _this.displayBuildingInfo(dataObj);

        // Setup earch event.
        _this.setupSearch(dataObj);
      }
    });
  },


  /* ***
   * Function to set up and display the Mapbox map.
   */

  setupMap: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYWNwODgiLCJhIjoiY2ltMmd2ZzRpMDAwdDVsa3NnYzM3ajRhOSJ9.RPCYqcmXqi2GJR1LyRjXWQ';

    this.map = L.mapbox.map('map').setView([38.9089,-77.0741], 16);
    L.mapbox.styleLayer('mapbox://styles/acp88/cim2j5njp009t9jm08o7xzp9c').addTo(this.map);
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

  setupSearch: function(data) {
    $('#search').keyup(function() {
      var searchString = $(this).val().toLowerCase();

      $.each(data.features, function(i, obj) {
        if (obj.properties.name && obj.properties.name.toLowerCase() == searchString) {
          var marker = L.mapbox.marker.icon({
            'marker-color': '#fa0'
          });
          console.log('found');

          /*
          L.marker([37.9, -77], {
              icon: L.mapbox.marker.icon({
                  'marker-size': 'large',
                  'marker-symbol': 'bus',
                  'marker-color': '#fa0'
              })
          }).addTo(map);
          */
          return;
        }
      });
    });
  }
};

georgetownMap.init();
