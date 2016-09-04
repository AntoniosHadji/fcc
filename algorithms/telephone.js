function telephoneCheck(str) {
  // Good luck!
  var re = new RegExp(/^([0-9]{0,2})\D{0,2}[0-9]{3}\D{0,2}[0-9]{3}\D?[0-9]{4}/, 'g');
  
  var result = re.exec(str);
  console.log(result);
  if (result === null) {
    console.log('f');
    return false;
  } else if (result.length >= 2) {
    if (parseInt(result[1]) !== 1) {
      console.log('f');
      return false;
    }
    console.log('t');
    return true;
  }
  
}

console.log(telephoneCheck("5555555555"));
console.log(telephoneCheck("555-555-5555"));
console.log(telephoneCheck("(555)555-5555"));
console.log(telephoneCheck("1 555)555-5555"));
