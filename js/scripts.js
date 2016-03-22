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
        var dataObj = $.parseJSON(data)
        _this.displayBuildingInfo(dataObj);
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
  }
};

georgetownMap.init();
