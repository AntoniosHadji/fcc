
function matchCap(before, after) {
  if (before.charAt(0).toUpperCase() === before.charAt(0)) {
    return after.charAt(0).toUpperCase() + after.slice(1);
  }
  return after;
}


function myReplace(str, before, after) {
  after = matchCap(before, after);
  return str.replace(before, after);
}

myReplace("A quick brown fox jumped over the lazy dog", "jumped", "leaped");
