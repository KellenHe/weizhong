import GateWay from './gateway';
import './css/common.css';
import Map from './map';

let gateway = new GateWay();
gateway.init('#gateway');

let map = new Map();
map.init('#map');
// document.querySelector("#root").appendChild(greeter.greeter());