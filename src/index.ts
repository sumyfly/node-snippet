import { Person, sortByName, Color } from './main'

console.log(Color.Green)
let data = sortByName([{ name: "wong", age: 43 }, { name: 'Edward', age: 55 }])
for (let d in data) {
  console.log(d)
}