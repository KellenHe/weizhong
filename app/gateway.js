import * as d3 from 'd3';

class GateWay {

  constructor() { }

  init(id) {
    const parentEle = document.querySelector(id);
    const width = parentEle.clientWidth;
    const height = parentEle.clientHeight;
    const radius = Math.min(width, height) / 2;
    const svg = d3.select(parentEle).append('svg').attr('width', '100%').attr('height', '100%')
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", "0 0 " + width + " " + height);
    const g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const color = d3.scaleOrdinal(["#14c6ca", "#6996f3", "#da6c75", "#feab67", "#43a8f0", "#ab90df"]);

    const pie = d3.pie().sort(null).value(function (d) { return d.population });

    const path = d3.arc().outerRadius(radius - 60).innerRadius(radius - 100);

    const label = d3.arc().outerRadius(radius - 60).innerRadius(radius - 60);
    const label2 = d3.arc().outerRadius(radius - 50).innerRadius(radius - 50);

    d3.csv('./data.txt', function (d) {
      d.population = +d.population;
      return d;
    }).then(function (data) {
      var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

      arc.append("path")
        .attr("fill", function (d) { return color(d.data.age); })
        .transition().duration(1000)
        .attrTween("d", function(d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            return path(interpolate(t));
          }
        });

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }

      arc.append("text")
        .attr("transform", function (d) {
          var pos = label2.centroid(d);
          pos[0] = (radius - 50) * (midAngle(d) < Math.PI ? 1 : -1);
          return "translate(" + pos + ")";
        })
        .attr('text-anchor', function (d) {
          return midAngle(d) < Math.PI ? 'start' : 'end';
        })
        .attr("dy", "0.35em")
        .text(function (d) { return d.data.age; });

      arc.append('polyline')
        .attr('points', function (d) {
          var pos = label2.centroid(d);
          pos[0] = (radius - 50) * (midAngle(d) < Math.PI ? 1 : -1);
          return [label.centroid(d), label2.centroid(d), pos];
        })
    });
  }
}

export default GateWay;