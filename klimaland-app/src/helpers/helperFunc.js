import { useEffect, useLayoutEffect, useState } from 'react';
import DynamicTextJson from '../data/textData.json';

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
        .replace(' ', ' ') // replace whitespace with no linebreak whitespace
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // adds dot . after 3 digits -> 1.000
}

export function useCardSize(target, cardNumber) {
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
  }, [cardNumber]);
  return dimension;
}

export function mobileCheck() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(ref, close) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        event.preventDefault();
        close();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

/**
 * get LK name with name addition from LK Seleciton Element
 * @param {} element with label,value and nameAddition in landkreisSelection
 * @returns
 */
export function getTotalLKName(element) {
  let name = element.label;
  if (element.nameAddition !== undefined) {
    //special case: Bremen Stadt
    if (element.value === 4011) {
      name = element.label + ' (Stadt)';
    }
    //only label landkreise, no kreisfreie städte
    if (element.nameAddition === '(Landkreis)') {
      name = 'Landkreis ' + element.label;
    }
  }
  return name;
}

export function getRanking(ags, section) {
  if (
    DynamicTextJson[ags] !== undefined &&
    DynamicTextJson[ags][section] !== undefined &&
    DynamicTextJson[ags][section]['third'] !== undefined
  ) {
    return DynamicTextJson[ags][section]['third'];
  }
  return '';
}
