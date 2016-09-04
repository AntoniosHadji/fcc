function unique(arr) {
        var result = [];
        arr.sort();
        result.push(arr[0]);
        for (i=1; i<arr.length; i++) {
          if (arr[i-1] !== arr[i]) result.push(arr[i]);
        }
        return result;
}

function sym(args) {

  var symdiff = Array.from(arguments)
    .reduce(
      function(a, b) {
        var tmp = unique(a).concat(unique(b)).sort();
        var result = [];
        if (tmp[0] !== tmp[1]) result.push(tmp[0]);
        if (tmp[tmp.length-1] !== tmp[tmp.length-2]) result.push(tmp[tmp.length-1]);
        for (i=1; i<tmp.length-1; i++) {
          if (tmp[i-1] !== tmp[i] && tmp[i] !== tmp[i+1]) result.push(tmp[i]);
        }
        return result;
      });

  return symdiff.sort();
}

console.log(unique([1, 1, 2, 5]));
console.log(unique([2, 2, 3, 5]));
console.log(unique([3, 4, 5, 5]));
console.log(sym([1, 1, 2, 5], [2, 2, 3, 5]));
console.log(sym([1, 1, 2, 5], [2, 2, 3, 5], [3, 4, 5, 5]));
