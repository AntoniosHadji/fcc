
function steamrollArray(arr) {
  // I'm a steamroller, baby
  var result = [];
  while (arr.length > 0) {
    var e = arr.shift();
    console.log(e);
    if (Array.isArray(e)) {
      for (i=e.length-1; i>=0; i--) {
        arr.unshift(e[i]);
      }
    } else {
     result.push(e);
    }
  }
  console.log(result);
  return result;
}
steamrollArray([[["a"]], [["b"]]]);
steamrollArray([1, [2], [3, [[4]]]]);
steamrollArray([1, [], [3, [[4]]]]);
steamrollArray([1, {}, [3, [[4]]]]);
