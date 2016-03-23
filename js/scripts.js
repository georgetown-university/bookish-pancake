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
    // L.mapbox.styleLayer('mapbox://styles/rap42/cim4034a500fqa0m47wrv44z9').addTo(this.map);
    L.mapbox.styleLayer('mapbox://styles/mapbox/basic-v8').addTo(this.map);
  },


  /* ***
   * Function to display building information on click.
   */

  displayBuildingInfo: function(data) {
    var bldgData = {
      'way/66347994': {
        'photo': 'http://farm5.static.flickr.com/4010/4388956834_898ea621ff.jpg',
        'history': 'The original foundation on which the Car Barn rests was constructed in 1761.  Formerly a tobacco warehouse, this building was also once used as a turn-around and maintenance facility for electric street cars (trolleys).'
      },
      'way/67521384': {
        'photo': 'http://farm2.static.flickr.com/1274/4680198840_1d601b5027.jpg',
        'history': 'Healy Hall is on the National Register of Historic Places and is also a National Historic Landmark. It is named after Patrick F. Healy, S.J., Georgetown president from 1873 to 1882 and the first African-American to head a major, predominantly white university. Work began on the building in 1877 and much of the interior was completed by the 1881-1882 academic year. Gaston Hall was completed in 1901.'
      }
    };
    // var layer = L.mapbox.featureLayer().addTo(this.map);
    var georgetownLayer = L.geoJson(
      data, {
        style: L.mapbox.simplestyle.style,
        onEachFeature: onEachFeature
      })
      .addTo(this.map);

    var walksLayer = L.mapbox.featureLayer()
      .loadURL('geojson/walks.geojson')
      .on('ready', function(layer) {
        this.setStyle({
          weight: 6,
          'dashArray': '3, 2',
          opacity: .7,
          'lineCap': 'butt',
          color: '#002269',
        })
      })
      .addTo(this.map);

    georgetownLayer.setStyle({
      color: '#867875',
      weight: 2,
      fillColor: '#c6bcb6'
    });

    var info = $('#info');

    // layer.setGeoJSON(data);

    function mousemove(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 3,
        color: '#867875',
        // fillColor: '#011e41',
        fillOpacity: 0.9
      });
    }

    function mouseout(e) {
      var layer = e.target;

      georgetownLayer.setStyle({
        weight: 2,
        color: '#867875',
        // fillColor: '#c6bcb6'
      });
    }

    function showDetails(e) {
      var layer = e.target;

      georgetownLayer.setStyle({
        fillColor: '#c6bcb6'
      });
      layer.setStyle({
        fillColor: '#8a2432'
      });

      var content = '';
      if (layer.feature.properties.name) {
        var content = '<h2>' + layer.feature.properties.name + '</h2>';
        var dataID = layer.feature.properties['@id'];
        if (bldgData[dataID]) {
          if (bldgData[dataID].photo) {
            content += '<img src="' + bldgData[dataID].photo + '" />';
          }
          if (bldgData[dataID].history) {
            content += '<p>' + bldgData[dataID].history + '</p>';
          }
        }
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
      // layer.bindPopup(feature.properties.name);
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
      $.each(data, function(i, obj) {
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
