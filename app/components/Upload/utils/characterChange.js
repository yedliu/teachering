const unescape = (str, dom) => {
  dom.innerHTML = str;
  return dom.innerText || dom.textContent;
};
const fromCodePoint = (str) => {
  return String.fromCodePoint(str);
};

export const characterChange = (str) => {
  let elem = document.createElement('div');
  const str1 = unescape((str || '').replace(/&nbsp;/g, ' '), elem);
  const str2 = str1.replace(/&#(\d+);/g, (e, $1) => fromCodePoint($1));
  elem = null;
  return str2;
};
