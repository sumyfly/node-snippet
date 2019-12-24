// 既然可迭代对象的规则必须在对象上部署Symbol.iterator属性，那么我们基本上就可以通过此属来判断对象是否为可迭代对象，
// 然后就可以知道是否能使用 for of 取值了。

function isIterable(object) {
  return typeof object[Symbol.iterator] === 'function';
}

var iterableObj = {
  items: [100, 200, 300],
  [Symbol.iterator]: function() {
    var self = this;
    var i = 0;
    return {
      next: function() {
        var done = i >= self.items.length;
        var value = !done ? self.items[i++] : undefined;
        return {
          done: done,
          value: value,
        };
      },
    };
  },
};

//遍历它
for (var item of iterableObj) {
  console.log(item); //100,200,300
}

// 链接：https://juejin.im/post/5dfcbc8c6fb9a0165e33172c

// yield* 关键字
// yield*后面跟的是一个可遍历的结构，执行时也会调用迭代器函数。

let foo = function*() {
  yield 1;
  yield* [2, 3, 4];
  yield 5;
};

const g = foo();
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());

var iterableObj = {
  items: [100, 200, 300],
  [Symbol.iterator]: function() {
    var self = this;
    var i = 0;
    return {
      next: function() {
        var done = i >= self.items.length;
        var value = !done ? self.items[i++] : undefined;
        return {
          done: done,
          value: value,
        };
      },
      return() {
        console.log('提前退出');
        return {
          //必须返回一个对象
          done: true,
        };
      },
    };
  },
};

for (var item of iterableObj) {
  console.log(item);
  if (item === 200) {
    break;
  }
}

for (var item of iterableObj) {
  console.log(item);
  throw new Error();
}
