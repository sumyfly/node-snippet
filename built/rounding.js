const roundingToAmount = (amount, rounding) => {
    let roundedAmount;
    if (rounding > 0) {
        roundedAmount = Math.round(amount / rounding) * rounding;
    }
    else {
        roundedAmount = amount;
    }
    return roundedAmount;
};
console.log(roundingToAmount(4.444, 0.001));
console.log(roundingToAmount(4.444, 0.01));
//# sourceMappingURL=rounding.js.map