// Iterative - naive solution - O(n)
// This solution is straightforward and easy to understand.
const sum_to_n_a = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
      sum += i;
  }
  return sum;
};
console.log(sum_to_n_a(5)); // Output: 15
console.log(sum_to_n_a(10)); // Output: 55
console.log(sum_to_n_a(20)); // Output: 210 

// Recursive - O(n)
// This solution is more elegant and concise, but it may be less efficient for large values of n due to the overhead of recursive calls.
const sum_to_n_b = (n) => {
  if (n === 0) {
      return 0;
  } else {
      return n + sum_to_n_b(n - 1);
  }
};
console.log(sum_to_n_b(5)); // Output: 15
console.log(sum_to_n_b(10)); // Output: 55
console.log(sum_to_n_b(20)); // Output: 210 

// Mathematical formula - O(1)
// This solution is the most efficient in terms of time complexity, as it runs in constant time regardless of the value of n.
const sum_to_n_c = (n) => {
  return (n * (n + 1)) / 2;
 };
 
 console.log(sum_to_n_c(5)); // Output: 15
 console.log(sum_to_n_c(10)); // Output: 55
 console.log(sum_to_n_c(20)); // Output: 210 
 console.log(sum_to_n_c(1000000000)); // Output: 500000000500000000