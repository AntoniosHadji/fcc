var fibsFizzBuzz = function(n) {
    console.log(n);
    // Your code here.
    var fib = [];
    var p1 = 1;
    var p2 = 1;
    for (var i=0; i<n; i++) {
      if (i<2) fib.push(1);
      if (i>=2) {
        var next = p1 + p2;
        p1 = p2;
        p2 = next;
        if (next % 15 === 0) {
          fib.push('FizzBuzz');
        } else if (next % 5  === 0) {
          fib.push('Buzz');
        } else if (next % 3  === 0) {
          fib.push('Fizz');
        }else {
          fib.push(next);
        }
      }
    }
    return fib;
}
console.log(fibsFizzBuzz(5));
