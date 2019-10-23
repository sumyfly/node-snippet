interface Person {
  name: string,
  age: number
}

class Greater {
  name: string;
  sayHello() {
    console.log('Hello' + name)
  }
}

enum Color { Red, Green, Blue }

function sortByName(a: Person[]) {
  var result = a.slice(0)
  result.sort((x, y) => {
    return x.name.localeCompare(y.name)
  })
  return result
}

let data = sortByName([{ name: "wong", age: 43 }, { name: 'Edward', age: 55 }])

export { Person, sortByName, Color }