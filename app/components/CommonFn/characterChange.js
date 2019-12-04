/**
 * 字符实体转换成字符
 * @param {*} str
 * @param {*} dom
 */
const unescape = (str, dom) => {
  dom.innerHTML = str;
  return dom.innerText || dom.textContent;
};

/**
 * 从字符编码转换成字符
 * @param {*} str 字符编码
 */
const fromCodePoint = (str) => {
  return String.fromCodePoint(str);
};

/**
 * 对字符进行转换，转化为页面可显示的字符
 * @param {string} str 需要进行转换的字符串
 * @returns {string} str2
 */
export const characterChange = (str) => {
  let elem = document.createElement('div');
  const str1 = unescape((str || '').replace(/&nbsp;/ig, ' '), elem);
  const str2 = str1.replace(/&#(\d+);/g, (e, $1) => fromCodePoint($1));
  elem = null;
  return str2;
};
