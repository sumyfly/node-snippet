function* gen() {
    const a = yield 1;
    console.log('a in gen:' + a);
    const b = yield 2;
    console.log('b in gen:' + b);
    const c = yield 3;
    console.log('c in gen:' + c);
}
const g = gen();
console.log(g.next('a'));
console.log(g.next('b'));
console.log(g.next('c'));
console.log(g.next('d'));
//# sourceMappingURL=generator_test.js.map