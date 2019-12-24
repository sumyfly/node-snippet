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
