 
var assert = require('chai').assert


function permAlone1(s,p){

  return s.split('').reduce(
    (x,y,i)=> y==p ? x : s.length==1? 1 : x + permAlone(s.slice(0,i) + s.slice(i+1),y) ,0);
  
}


function permAlone2(str, p) {
    return str.split('').reduce(function(result, element, index) {
        if (element === p) {
            return result;
        } else {
            if (str.length === 1) {
                return 1;
            } else {
                return result + permAlone2(str.slice(0, index) + str.slice(index + 1), element);
            }
        }
    }, 0);
}



function permAlone(str) {
  var counter = 0;
  var heapPermutation = function(a, size, n) {
      if (size ===1) {
        var re = /(.)\1+/;
        if (!re.test(a.join(''))) { counter++; }
      }

      for (var i=0; i<size; i++) {
        heapPermutation(a, size-1, n);

        if (size % 2 === 1) {
          var tmp = a[0];
          a[0] = a[size-1];
          a[size-1] = tmp;
        } else {
          var tmp = a[i];
          a[i] = a[size-1];
          a[size-1] = tmp;
        }
      }
  }

  heapPermutation(str.split(''), str.length, str.length);
  return counter;
}

// n!-2*(n-1)!-2*(n-3)*(n-2)!-4*xx*(n-3)!
var t1 = Date.now();
assert.equal(permAlone("abcdefghi"), 362880); //9!
assert.equal(permAlone("abcdefgha"), 282240); // 9!-2*8!
assert.equal(permAlone("abcdefgab"), 221760); // 9!-2*8!-12*7!
assert.equal(permAlone("abcdefabc"), 175680); // 9!-2*8!-12*7!-4*16*6!
assert.equal(permAlone("abcdefgh"), 40320); //
assert.equal(permAlone("abcdefga"), 30240); // 8!-2*7!
assert.equal(permAlone("abcdefab"), 23040); // 8!-2*7!-10*6!
assert.equal(permAlone("abcdeabc"), 17760); // 8!-2*7!-10*6!-4*11*5!
assert.equal(permAlone("abcdabcd"), 13824); // 8!-2*7!-10*6!-4*11*5!-164*4!
assert.equal(permAlone("abcdefg"), 5040); //
assert.equal(permAlone("abcdefa"), 3600); // 7!-2*6!
assert.equal(permAlone("abcdeab"), 2640); // 7!-2*6!-8*5!
assert.equal(permAlone("abcdabc"), 1968); // 7!-2*6!-8*5!-4*7*4!
assert.equal(permAlone("abcdef"), 720); //
assert.equal(permAlone("abcdea"), 480); // 6!-2*5!
assert.equal(permAlone("abcdab"), 336); // 6!-2*5!-6*4!
assert.equal(permAlone("abcabc"), 240); // 6!-2*5!-6*4!-4*4*3!
assert.equal(permAlone('aaabtd'), 144 ); // 6!-4!^2
assert.equal(permAlone("abcde"), 120); //
assert.equal(permAlone("aacde"), 72); // 5!-2*4!
assert.equal(permAlone("accde"), 72); // 5!-2*4!
assert.equal(permAlone("abcda"), 72); // 5!-2*4!
assert.equal(permAlone("bbcda"), 72); // 5!-2*4!
assert.equal(permAlone("bccda"), 72); // 5!-2*4!
assert.equal(permAlone("abccb"), 48); // 5!-2*4!-4*3!
assert.equal(permAlone("abcab"), 48); // 5!-2*4!-4*3!
assert.equal(permAlone("aabbc"), 48); //
assert.equal(permAlone("aaade"), 12); // 5!-2*3^*3!
assert.equal(permAlone("aab"), 2)
assert.equal(permAlone("a"), 1); //
assert.equal(permAlone("aaaae"), 0); // 5!
assert.equal(permAlone("aaaaec"), 0); // 5!
assert.equal(permAlone("aaaaee"), 0); // 5!
assert.equal(permAlone("aaaaaeee"), 0); // 5!
assert.equal(permAlone("aaaaadef"), 0); // 5!
assert.equal(permAlone("aaab"), 0); //
assert.equal(permAlone("aaa"), 0); //
assert.equal(permAlone("zzzzzzzz"), 0); //
assert.equal(permAlone("aaabb"), 12); //
assert.equal(permAlone("aabb"), 8); //
var t2 = Date.now();
console.log('all tests passed: ', Date().toString(), t2-t1, 'ms');

