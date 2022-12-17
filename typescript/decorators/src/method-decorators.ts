function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log({ target, propertyKey, descriptor });
    descriptor.value = () => "ty";
  };
}
class Font {
  greeting?: string;
  constructor(message: string) {
    this.greeting = message;
  }
  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
const font = new Font("czq");

console.log(Object.keys(font));
