function truthCheck(collection, pre) {
  // Is everyone being true?
  for (i=0; i<collection.length; i++) {
    if (collection[i].hasOwnProperty(pre)) {
      if (collection[i][pre] === false) {
        return false;
      }
    }
  }
  return true;
}
console.assert("yes" === true, "yes broken");

truthCheck([{"user": "Tinky-Winky", "sex": "male"}, {"user": "Dipsy", "sex": "male"}, {"user": "Laa-Laa", "sex": "female"}, {"user": "Po", "sex": "female"}], "sex");
truthCheck([{"user": "Tinky-Winky", "sex": "male"}, {"user": "Dipsy"}, {"user": "Laa-Laa", "sex": "female"}, {"user": "Po", "sex": "female"}], "sex");
console.log(truthCheck([{"user": "Tinky-Winky", "sex": "male", "age": 0}, {"user": "Dipsy", "sex": "male", "age": 3}, {"user": "Laa-Laa", "sex": "female", "age": 5}, {"user": "Po", "sex": "female", "age": 4}], "age"));
truthCheck([{"name": "Pete", "onBoat": true}, {"name": "Repeat", "onBoat": true}, {"name": "FastFoward", "onBoat": null}], "onBoat");
truthCheck([{"name": "Pete", "onBoat": true}, {"name": "Repeat", "onBoat": true, "alias": "Repete"}, {"name": "FastFoward", "onBoat": true}], "onBoat");
truthCheck([{"single": "yes"}], "single");
truthCheck([{"single": ""}, {"single": "double"}], "single");
truthCheck([{"single": "double"}, {"single": undefined}], "single");
truthCheck([{"single": "double"}, {"single": NaN}], "single");
