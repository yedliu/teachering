import _ from 'lodash';

// 数组随机打乱
const randomArr = (arr) => {
  if (!_.isArray(arr) || arr.length <= 0) return [];
  if (arr.length <= 1) {
    return arr;
  }
  const index = Math.floor(Math.random() * arr.length);
  const resArr = arr.splice(index, 1);
  return resArr.concat(randomArr(arr));
};

export default {
  randomArr,
};