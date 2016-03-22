var georgetownMap = {
  init: function() {
    var _this = this;

    this.setupMap();

    $.ajax({
      url: 'geojson/export.geojson',
      success: function(data) {
        var dataObj = $.parseJSON(data)
        _this.displayBuildingInfo(dataObj);
      }
    });
  },

  setupMap: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiYWNwODgiLCJhIjoiY2ltMmd2ZzRpMDAwdDVsa3NnYzM3ajRhOSJ9.RPCYqcmXqi2GJR1LyRjXWQ';

    this.map = L.mapbox.map('map').setView([38.9089,-77.0741], 16);
    L.mapbox.styleLayer('mapbox://styles/acp88/cim2j5njp009t9jm08o7xzp9c').addTo(this.map);
  },

  displayBuildingInfo: function(data) {
    var layer = L.mapbox.featureLayer().addTo(this.map);
    var info = $('#info');

    layer.setGeoJSON(data);

    layer.on('click',function(e) {
      //console.log('clicked');
      // Force the popup closed.
      //e.layer.closePopup();

      var feature = e.layer.feature;
      var content = '<div><strong>' + feature.properties.title + '</strong>' +
                    '<p>' + feature.properties.description + '</p></div>';

      info.innerHTML = content;
    });
  }
};

georgetownMap.init();
