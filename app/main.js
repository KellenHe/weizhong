import Greeter from './greeter';
import 'bootstrap';

let greeter = new Greeter();
document.querySelector("#root").appendChild(greeter.greeter());