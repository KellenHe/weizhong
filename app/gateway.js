import * as d3 from 'd3';

class GateWay {
  ownerEle;

  constructor() { }

  init(id) {
    var data = [1, 1, 2, 3, 5, 8, 13, 21];
    var arcDatas = d3.pie()(data);

    this.ownerEle = document.querySelector(id);
    let svg = d3.select(id).append('svg').attr('width', this.ownerEle.clientWidth).attr('height', this.ownerEle.clientHeight);

    const radius = d3.min(this.ownerEle.clientWidth, this.ownerEle.clientHeight) / 2;

    let arcGenerator = d3.arc();

    let pathData = arcGenerator({
      startAngle: 0,
      endAngle: 0.25 * Math.PI,
      innerRadius: radius - 50,
      outerRadius: radius
    });
  }
}

export default GateWay;