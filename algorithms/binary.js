
function binaryAgent(str) {
  // each array element is a string representing a binary number
  var arr = str.split(' ');
  //console.log(arr);

  var result = [];
  for (i=0; i<arr.length; i++) {
    var c = 0;
    var index = 1;
    for (j=arr[i].length-1; j>=0; j--) {
      c += arr[i].charAt(j).valueOf()*index;
      //console.log(c, index);
      index *= 2;
    }
    //console.log(c);
    result.push(String.fromCharCode(c));
  }
  //console.log(result.join(''));
  return result.join('');
}

binaryAgent("01000001 01110010 01100101 01101110 00100111 01110100 00100000 01100010 01101111 01101110 01100110 01101001 01110010 01100101 01110011 00100000 01100110 01110101 01101110 00100001 00111111");
