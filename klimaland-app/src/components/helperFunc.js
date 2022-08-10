//modulo helper function
export function mod(n, m) {
  let result = n % m;
  return result >= 0 ? result : result + m;
}

export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function setStateAsync(scope, state) {
  return new Promise((resolve) => {
    scope.setState(state, resolve);
  });
}

export function isInt(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
}
