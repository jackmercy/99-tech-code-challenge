// Iterative - naive solution - O(n)
// This solution is straightforward and easy to understand.
const sum_to_n_a = (n: number) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
      sum += i;
  }
  return sum;
};
console.log(sum_to_n_a(5)); // Output: 15
console.log(sum_to_n_a(10)); // Output: 55
console.log(sum_to_n_a(20)); // Output: 210 