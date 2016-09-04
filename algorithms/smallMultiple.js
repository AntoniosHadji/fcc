function smallestCommons(arr) {

  var lo = Math.min(arr[0], arr[1]);
  var hi = Math.max(arr[0], arr[1]);
  var r = [];
  var maxm = 1;
  for (i=lo; i<=hi; i++ ) {
    r.push(i);
    maxm *= i;
  }

  var m = hi;
  if (hi % 2 === 1) m = hi+1;
  var remainder = 0;
  while (m <= maxm) {
  //  console.log(m);
    for (i=0; i<r.length; i++) {
      remainder += m % r[i];
      if (remainder > 0) {
        break;
      }
    }
    if (remainder === 0) {
      console.log(m);
      return m;
    } else {
      remainder = 0;
    }
    m+=2;
  }
  console.log('fail');
}


smallestCommons([23,18]);
