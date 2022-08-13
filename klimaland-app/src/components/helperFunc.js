/**
 * modulo helper function
 * @param {*} n
 * @param {*} m
 * @returns modulo
 */
export function mod(n, m) {
  let result = n % m;
  return result >= 0 ? result : result + m;
}

/**
 * randomizer of array elements
 * @param {} array array with possible selections
 * @returns random element in this array
 */
export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * React setState Function wrapped in promise.
 * @param {*} scope "this" in react class component
 * @param {*} state state to update
 * @returns
 */
export function setStateAsync(scope, state) {
  return new Promise((resolve) => {
    scope.setState(state, resolve);
  });
}

/**
 * checks if value is Integer
 * @param {*} value value to test
 * @returns true if value is int, else false
 */
export function isInt(value) {
  return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}