/**
   * @description 用正则将字符串拆分为单词数组，并对每个单词进行首字母大写处理。
   *              这里简单的把字母、数字、下划线和单撇号都视为了单词成员
   * @return {void}
*/
export const titleCase = (s) => {
  return s
    .toLowerCase()
    .replace(/\b([\w|']+)\b/g, function (word) {
      // return word.slice(0, 1).toUpperCase() + word.slice(1);
      return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
    });
};

