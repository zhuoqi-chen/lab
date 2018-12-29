var isDone = false;
var NAME = "chenzhuoqi";
var number = [1, 2, 3, 4];
var any = ["1", 2, 3, 4];
var list = [1, true, "free"];
var x;
x = [1, "cz"];
// 枚举
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;
// any
var notSure = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
// Void
function noreturn() {
    console.log("hi im chenzhuoqi");
}
