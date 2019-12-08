function* gen(fnParam) {
  console.log('come in');
  const a = yield 1;
  console.log('a in gen:' + a, fnParam);
  const b = yield 2;
  console.log('b in gen:' + b, fnParam);
  const c = yield 3;
  console.log('c in gen:' + c, fnParam);
}

const g = gen('I am function scope param'); // 注意：这里只是初始化了环境，没有进入函数执行代码。只有调用next才会在函数中执行。
console.log(g.next('a'));
console.log(g.next('b'));
console.log(g.next('c'));
console.log(g.next('d'));

function call_emulator(fn) {
  return fn();
}

function* f1() {
  return 1 + 1;
}

function* t() {
  const f = yield call_emulator(f1);
  console.log('f', f);
  // return f;
}

const r = t();
console.log(r.next());
console.log(r.next());
console.log(r.next());

console.log('------------------gen2------------------');
function* gen2(x) {
  // y 根本不是 yield x +2 的返回值，它是下一个next的实参。假如没有yield之前的y这个内部变量，就不会接受下个next的实参，这里的迷惑性很大。
  // yield是程序内部中断点，①它可以返回参数，②也可以接受下个next的实参。
  const y = yield x + 2;
  console.log('y', y);
  return y;
}

const g2 = gen2(1);
const p2 = g2.next();
console.log('p2', p2);
console.log(g2.next(p2.value));

console.log('------------------gen3------------------');
function* gen3(x) {
  yield x + 2; // 没有y 就不可以接受下一个next的实参。
  return x;
}

const g3 = gen3(1);
const p3 = g3.next();
console.log('p3', p2);
console.log(g3.next(p3.value));

console.log('------------------gen4------------------');
function* gen4(x) {
  let y = x;
  while (true) {
    y += 1;
    const z = yield y;
    console.log('z', z);
    if (y == 10) {
      return 'y reached 10';
    }
  }
}

const g4 = gen4(0);
for (let i = 0; i < 10; i++) {
  console.log('i: ' + i + ', g4: ', g4.next(i).value);
}

const g4_2 = gen4(0);
// let t
while (true) {
  let t = g4_2.next();
  if (t.done) {
    console.log('t is done: ', t.value);
    break;
  } else {
    console.log('t: ', t.value);
  }
}

const g4_3 = gen4(0);
for (let v of g4_3) {
  console.log('v', v);
}

console.log('------------------iterator------------------');
function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}
let jane: any = { first: 'Jane', last: 'Doe' };
jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}

console.log('------------------error handler------------------');
// Generator函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在Generator函数体内捕获。
// https://www.jianshu.com/p/112373662dff

const gen5 = function*() {
  try {
    console.log('come in');
    yield; // 位置A
    console.log('I never run');
  } catch (e) {
    console.log('internal error: ', e);
  }
  yield 'Position B'; // 位置B, 被手动throw中的next执行到位置B停止
};

const g5 = gen5();
g5.next(); // 返回位置A的值 undefined, 函数体当前运行位置停留在位置A

try {
  const p = g5.throw('a'); // ① 在位置A throw一个error, 所以这个时候是internal error。 ②throw方法被捕获以后，会附带执行到下一条yield语句。（他就是它本身带了一个next方法）
  console.log('positon is: ', p.value);
  g5.throw('b'); // 由于函数已经返回，这里的error被external error handler捕获。这个难道是generator帮我们throw出来的？
} catch (e) {
  console.log('external error: ', e);
}
// internal error:  a
// external error:  b

console.log('------------------return------------------');
// 如果Generator函数内部有try...finally代码块，那么当遇到return时候，不会立刻结束，而是会把finally代码块中的执行完，然后再return
function* numbers() {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g6 = numbers();
g6.next(); // { value: 1, done: false }
g6.next(); // { value: 2, done: false }
g6.return(7); // { value: 4, done: false }
g6.next(); // { value: 5, done: false }
const r6 = g6.next(); // { value: 7, done: true }
console.log('r6', r6);

console.log('------------------yield * ------------------');
// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}

// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}

console.log('result', result);
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']

console.log('------------------auto run thunk------------------');
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen7 = function*() {
  var r1 = yield readFileThunk('/etc/afpovertcp.cfg');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};

// 现在我们有Thunk函数，有了Generator函数，关键就是，自动执行的函数怎么写。
// 我们的目的是，在Thunk的回调函数与Generator之间进行切换
// 也就是说，异步操作的回调函数，用来控制流程，并且将数据原封不动的传回给gen7函数。真正对请求数据的操作不是在回调函数里做的，而是在gen7函数里。

function run(fn) {
  const gen = fn();

  function customize_next(err?: Error, data?: any) {
    const result = gen.next(data); // customize_next为回调函数，把data赋给了r1,r2。在递归调用中继续调用gen的next，直至它状态为done.
    console.log('data', data);
    console.log('result', result);
    if (result.done) {
      return;
    }
    result.value(customize_next);
    // 注意这一步，result.value是gen函数中的readFileThunk，
    // 它是一个Thunk函数，也就是说，这一步等价于readFileThunk(file1)(customize_next)
  }

  customize_next();
}

run(gen7);
