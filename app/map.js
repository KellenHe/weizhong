import * as d3 from 'd3';

class Map {
  constructor() { }

  init(id) {
    const parentELe = document.querySelector(id);
    const width = parentELe.clientWidth;
    const height = parentELe.clientHeight;
    const svg = d3.select(parentELe).append('svg');
    const g = svg.attr('width', '100%').attr('height', '100%').attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .append('g').attr('class', 'map');

    const filter = svg.append('defs').append('filter');
    filter.attr('id', 'shadow')
      .append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('result', 'color')
      .attr('values', '0 0 0 0 0 0 0 0 0.9 0 0 0 0.9 0 0 0 1 0');
    filter.append('feGaussianBlur')
      .attr('in', 'color')
      .attr('stdDeviation', '40')
      .attr('result', 'blur');
    filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', '5')
      .attr('dy', '5')
      .attr('result', 'offset');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'bg');
    feMerge.append('feMergeNode').attr('in', 'offset');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    g.attr('filter', 'url(#shadow)');

    function getGeoJSONWithResults(csv, geojson) {
      var featureLookup = {};
      geojson.features.forEach(function (feature) {
        featureLookup[feature.properties['pcon16cd']] = feature;
      })

      var newGeojson = { type: 'FeatureCollection', features: [] };

      csv.forEach(function (c) {
        var feature = featureLookup[c.ons_id];
        if (feature) {
          newGeojson.features.push({
            type: 'Feature',
            geometry: feature.geometry,
            properties: { fill: partyColours[c.first_party.toLowerCase()] }
          });
        }
      })

      return newGeojson;
    }

    function update(geojson) {
      var projection = d3.geoMercator().fitSize([width, height], geojson);

      var geoGenerator = d3.geoPath().projection(projection);

      g.selectAll('path')
        .data(geojson.features)
        .enter()
        .append('path')
        .on('mouseover', function(d) {
          this.attr('fill', '#78b7ff');
        })
        .on('mouseleave', function(d) {
          this.attr('fill', 'none');
        })
        .attr('d', geoGenerator);
    }

    d3.json('./hubei.json').then(function (geojson) {
      update(geojson);
    });
  }
}

export default Map;