function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}
@classDecorator
class Greeter {
  greeting?: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
const greeter = new Greeter("czq");
console.log(greeter);
