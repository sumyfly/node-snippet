const rounding = (value, rounding) => {
  let result;
  if (rounding > 0) {
    result = Math.round(value / rounding) * rounding;
  } else {
    result = value;
  }
  return result;
};

console.log(rounding(4.444, 0.001));
console.log(rounding(4.444, 0.01));
