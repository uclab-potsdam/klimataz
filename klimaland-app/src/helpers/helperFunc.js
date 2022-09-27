import { update } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';

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
  return !isNaN(value) && parseInt(Number(value)) === value && !isNaN(parseInt(value, 10));
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
 * @returns returns number as string formatted from 1400000 to 1,4 M and adds thousand separator and comma as decimal separator
 */
export function formatNumber(numberValue) {
  let num;
  if (numberValue % 1 === 0) {
    num = numberValue;
  } else {
    num = Number(numberValue).toFixed(1); // max one decimal
  }

  return Math.abs(Number(num)) >= 1.0e9
    ? (Math.abs(Number(num)) / 1.0e9).toFixed(1).replace('.', ',') + ' Mrd'
    : Math.abs(Number(num)) >= 1.0e6
    ? (Math.abs(Number(num)) / 1.0e6).toFixed(1).replace('.', ',') + ' Mio'
    : Math.abs(Number(num)) >= 1.0e3
    ? (Math.abs(Number(num)) / 1.0e3).toFixed(1).replace('.', ',') + ' Tsd'
    : Math.abs(Number(num))
        .toString()
        .replace('.', ',') // replaces . with comma for decimal separator
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // adds dot . after 3 digits -> 1.000
}

export function useCardSize(target) {
  const [dimension, setDimensions] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    function updateSize() {
      if (target.current) {
        setDimensions({
          width: target.current.offsetWidth,
          height: target.current.offsetHeight,
        });
      }
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return dimension;
}
