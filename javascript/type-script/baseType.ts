let isDone: boolean = false;
const NAME: string = "chenzhuoqi";
let number: Array<number> = [1, 2, 3, 4];
let any: Array<any> = ["1", 2, 3, 4];
let list: any[] = [1, true, "free"];
let x: [number, string];
x = [1, "cz"];

// 枚举
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;
// any
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean

// Void
function noreturn(): void {
  console.log("hi im chenzhuoqi");
}
// 声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
let unusable: void = undefined;
