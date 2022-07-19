//modulo helper function
export function mod(n, m) {
  let result = n % m;
  return result >= 0 ? result : result + m;
}
