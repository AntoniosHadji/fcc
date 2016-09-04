function sumPrimes(num) {
  var sr = Math.sqrt(num);
  var result = 0;
  var arr = [2];
  for (var i=3; i<num+1; i+=2) {
    arr.push(i);
  }
  console.log(arr);
  console.log(i)
  for (i=1; i<arr.length; i++) {
    for (j=i+1; j<arr.length; j++) {
      if (arr[j] % arr[i] === 0) {
        console.log(arr[j], arr[i]);
        arr.splice(j,1);
        j = j - 1;
      }
    }
  }
  console.log(arr);
  return num;
}

sumPrimes(10);
