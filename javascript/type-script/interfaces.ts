// 接口初探
function printLabel(labelledObj: { label: string }) {
  console.log(labelledObj.label);
}
let obj = { size: 10, label: "chenzhuoqi" };
printLabel(obj);

// 可选属性
// 只是在可选属性名字定义的后面加一个 ? 符号。
interface SquareConfig {
  color?: string;
  width?: number;
}
function createAquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    // Error: Property 'clor' does not exist on type 'SquareConfig'
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}
// 只读属性
interface Point {
  readonly x: number;
  readonly y: number;
}

p1.x = 5; // error!

// /函数类型

interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch1: SearchFunc;
mySearch1 = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
};

// 函数的参数名不需要与接口里定义的名字相匹配。
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
};
