const o = {
  a: 1,
  b: 'b',
  c: {
    c: [1, 2, 3],
  },
};

const f = new Object(o);
f.e = o;

for (let key in f) {
  if (!f.hasOwnProperty(key)) {
    console.log('not own key', key);
    continue;
  }
  console.log('key', key);
  console.log('key: ' + key + ', value: ' + f[key]);
}

// for (let v of o) {
//   console.log('v', v);
// }
