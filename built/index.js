"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
console.log(main_1.Color.Green);
let data = main_1.sortByName([{ name: "wong", age: 43 }, { name: 'Edward', age: 55 }]);
for (let d in data) {
    console.log(d);
}
//# sourceMappingURL=index.js.map