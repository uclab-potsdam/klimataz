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

/**
 * conversion to %
 * @param {*} partialValue value to calculate
 * @ param {*} totalValue total
 * @returns Will return x that is x%
 */

export function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

/**
 * Turns first letter of string to uppercase string -> String
 * @param {*} string string that needs to be converted
 * @returns returns same string with first letter uppercase
 */

export function firstToUppercase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Shortens and formats numbers
 * @param {*} numberValue number as input
 * @returns returns same number formated from 1400000 to 1,4 M and adds thousand separator
 */
export function formatNumber(numberValue) {
  const sign = Math.sign(Number(numberValue));
  // Nine Zeroes for Billions
  return Math.abs(Number(numberValue)) >= 1.0e9
    ? sign * (Math.abs(Number(numberValue)) / 1.0e9).toFixed(1) + ' Mrd'
    : // Six Zeroes for Millions
    Math.abs(Number(numberValue)) >= 1.0e6
    ? sign * (Math.abs(Number(numberValue)) / 1.0e6).toFixed(1) + ' M'
    : // : // Three Zeroes for Thousands
      // Math.abs(Number(numberValue)) >= 1.0e3
      // ? sign * (Math.abs(Number(numberValue)) / 1.0e3).toFixed(2) + 'k'
      Math.abs(Number(numberValue))
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // adds dot . after 3 digits -> 1.000
}
