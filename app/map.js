class Map {
  constructor() { }

  init(id) {
    const parentELe = document.querySelector(id);
    const width = parentELe.clientWidth;
    const height = parentELe.clientHeight;
    const tooltip = d3.select(parentELe).append('div');
    tooltip.attr('id', 'tooltip');
    const svg = d3.select(parentELe).append('svg');
    const g = svg.attr('width', '100%').attr('height', '100%').attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .append('g');

    function update(mapData) {
      var projection = d3.geoMercator().fitSize([width, height], topojson.feature(mapData, mapData.objects.hubei));

      var geoGenerator = d3.geoPath().projection(projection);

      g.selectAll('path')
        .data(topojson.feature(mapData, mapData.objects.hubei).features)
        .enter()
        .append('path')
        .attr('d', geoGenerator)
        .attr('fill', 'transparent')
        .attr('stroke', '#154baa')
        .on('mouseover', function (d) {
          d3.select(this).attr('fill', '#154baa');
          var points = geoGenerator.centroid(d);

          d3.select('#tooltip').transition().duration(400).style('opacity', .9);
          d3.select('#tooltip').html(function() {
            return d.properties.name;
          }).style('left', points[0] + 'px').style('top', points[1] + 'px');
        })
        .on('mouseout', function (d) {
          d3.select(this).attr('fill', 'transparent');
          d3.select('#tooltip').transition().duration(400).style('opacity', 0);
        });
    }

    d3.json('./hubei-topo.json').then(function (mapData) {
      update(mapData);
    });
  }
}

export default Map;