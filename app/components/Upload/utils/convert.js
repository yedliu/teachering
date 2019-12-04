/**
 * number => english letter
 */
export const letterOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
export function isNumber(number) {
  return typeof number === 'number';
}
export const numberToLetter = (number) => {
  if (isNumber(number) && number >= 0) {
    return letterOptions[number % 26];
  }
  return number;
};