function isVowel(character) {
  console.log('character='+character);
  var vowels = ['a', 'o', 'e', 'u', 'i'];
  for (var i=0; i<vowels.length; i++) {
    if (vowels[i] == character) { 
      console.log('isVowel==true');
      return true;
    }
  }
  console.log('isVowel==false');
  return false;
}

function firstVowel(str) {
  // split str into array
  var arr = str.split('');
  for (var i=0; i<arr.length; i++) {
    console.log(arr[i]);
    // check each value of array for isVowel, return index
    if (isVowel(arr[i])) {
      console.log(i);
      return i;
    }
  }
}

function translatePigLatin(str) {
  var vpos = firstVowel(str);
  var first = str.slice(0, vpos);

  if (vpos === 0) {
    return str + 'way';
  }

  return str.slice(vpos) + first + 'ay';
}

console.log(translatePigLatin("california") === "aliforniacay");
console.log(translatePigLatin("paragraphs") === "aragraphspay");
console.log(translatePigLatin("glove") === "oveglay");
console.log(translatePigLatin("algorithm") === "algorithmway");
console.log(translatePigLatin("eight") === "eightway");
