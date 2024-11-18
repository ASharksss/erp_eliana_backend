Array.prototype.sortedBy = function(fn) {
  return this.reduce((acc, value) => {
    let key = fn(value);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(value);

    return acc;
  }, {});
};

let arr = [3.3, 3, 1, 4, 5, 5.4, 3.1];
console.log(arr.sortedBy(Math.floor)); 