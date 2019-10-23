"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Greater {
    sayHello() {
        console.log('Hello' + name);
    }
}
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
exports.Color = Color;
function sortByName(a) {
    var result = a.slice(0);
    result.sort((x, y) => {
        return x.name.localeCompare(y.name);
    });
    return result;
}
exports.sortByName = sortByName;
let data = sortByName([{ name: "wong", age: 43 }, { name: 'Edward', age: 55 }]);
//# sourceMappingURL=main.js.map