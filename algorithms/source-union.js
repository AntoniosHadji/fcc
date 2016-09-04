function uniteUnique(arr) {
  var unique = [];
  for (var i=0; i<arguments.length; i++) {
    console.log(arguments[i]);
    unique = unique.concat(arguments[i]);
  }
  console.log(unique);

  return unique.filter(function(elem, index, arr) {
    return arr.indexOf(elem) === index;
  });
}

console.log(uniteUnique([1, 3, 2], [5, 2, 1, 4], [2, 1]));
