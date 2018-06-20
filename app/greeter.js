class Greeter {

  constructor() {}

  greeter() {
    let greet = document.createElement('div');
    greet.textContent = "Hi there and greetings!";
    return greet;
  }
}

export default Greeter;