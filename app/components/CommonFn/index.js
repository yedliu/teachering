/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
import _ from 'lodash';
import { fromJS } from 'immutable';
import { changeAlertShowOrHideAction, setAlertStatesAction } from '../../containers/LeftNavC/actions';
import { AppLocalStorage } from '../../utils/localStorage';
import { backfromZmStand, backfromZmStandPrev, renderToKatex, mathToUnify, } from 'zm-tk-ace/utils';
import {
  englishAbilities,
  mathAbilities,
  integratedAbilities,
  chineseAbilities,
  minorAbilities,
} from '../../utils/zmConfig';
/**
 * 判断数据类型
 * @param {any} data 需要判断类型的数据
 * @returns {string} 'Null | Undefined | Number | String | Boolean | Array | Object | RegExp | Function '
 */
export const typeOf = (data) => {
  return Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
};

/**
 * 判断是否为数组
 * @param {any} param 需要判断的参数
 */
export function isArray(param) {
  return Array.isArray(param);
}
/**
 * 判断是否为对象
 * @param {any} param 需要判断的参数
 */
export function isObj(param) {
  return (typeof param === 'object' && !(param instanceof Array));
}
/**
 * 判断是否为字符串
 * @param {any} param 需要判断的参数
 */
export function isString(param) {
  return typeof param === 'string';
}
/**
 * 判断是否为数字
 * @param {any} param 需要判断的参数
 */
export function isNumber(param) {
  return typeof param === 'number';
}
/**
 * 判断是否为NaN
 * @param {any} param 需要判断的参数
 */
export function isNaN(param) {
  return Number.isNaN(param);
}
/**
 * 判断是否为布尔值
 * @param {any} param 需要判断的参数
 */
export function isBool(param) {
  return typeof param === 'boolean';
}
/**
 * 判断是否为函数
 * @param {any} param 需要判断的参数
 */
export function isFunc(param) {
  return typeof param === 'function';
}

/**
 * 返回数组第 index 项内容的字符串
 * @param {*} value : 必填，输入的数据
 * @param {*} index : 必填，对应数组的下标(如果 val 时数组的话)
 */
export function outValue(value, index) {
  let res = '';
  if (isArray(value)) {
    res = String(value[index]);
  } else if (isNumber(value)) {
    res = String(value);
  }
  return res;
}

/**
 * 根据输入状态返回值
 * @param {*} val : 必填，输入的数据
 * @param {*} index : 必填，对应数组中的下标(如果 val 时数组的话)
 */
export const outChild = (val, index) => {
  let res = outValue(val, index);
  if (!res) {
    res = val;
  }
  return res;
};

/**
 * 过滤当前是否为个位数，个位数则加上0到前面
 * @param {*} num : 必填，要与 10 比较的数字
 */
export const ifLessThan = (num) => {
  let res = '';
  if (typeof (num) === 'string') {
    const newNum = Number(num);
    res = newNum > 9 ? newNum : `0${newNum}`;
  } if (num < 0) {
    res = String(num);
  } else {
    res = num > 9 ? num : `0${num}`;
  }
  return res;
};

/**
 * 格式化时间，返回格式化后时间字符串
 * @param {*} str ：必填，格式化时的格式（字符串）
 * @param {*} timeobj ：选填，不传入时间对象则默认获取当前时间
 */
export const formatDate = (str, timeobj = new Date()) => {
  if (typeof str !== 'string' || !str.charAt) {
    window.console.warn(`${str}: is not a string`);
  }
  const year = String(timeobj.getFullYear());
  const month = String(timeobj.getMonth() + 1);
  const date = String(timeobj.getDate());
  const hours = String(timeobj.getHours());
  const minutes = String(timeobj.getMinutes());
  const milliseconds = String(timeobj.getSeconds());
  return str.replace(/yyyy/, year).replace(/M{2}/, ifLessThan(month)).replace(/d{2}/, ifLessThan(date)).replace(/H{2}/, ifLessThan(hours)).replace(/m{2}/, ifLessThan(minutes)).replace(/s{2}/, ifLessThan(milliseconds));
};

// 获取时间的时分秒对象
/**
 * @param {number} time // 参数为时间的毫秒数
 */
export const costTimeObj = (time = 0) => {
  const timeobj = {
    h: Math.floor(time / (60 * 60 * 1000)),
    m: Math.floor(time / 60000) % 60,
    s: Math.floor(time / 1000) % 60,
  };
  return timeobj;
};

/**
 * 添加图片 oss 前缀
 * @param {*} htmlStr 题目的字符串
 * @param {*} type 题目数据类型
 */
export const addImgSrc = (htmlStr, type) => {
  if (typeof htmlStr !== 'string') return;
  let showImgSrc = '';
  if (type === 'stuAnswer') {
    showImgSrc = htmlStr.replace(/src="((https?):)?(\/\/oss-cn-hangzhou\.aliyuncs\.com\/zm-chat-interview)*/g, 'src="//oss-cn-hangzhou.aliyuncs.com/zm-chat-interview')
      .replace(/background: url\('/g, 'background: url(\'//oss-cn-hangzhou.aliyuncs.com/zm-chat-interview');
  } else {
    showImgSrc = htmlStr;
    // showImgSrc = htmlStr.replace(/src="/g, `src="${Config.tklink}/api/jyeoo/proxyImage?urlImage=`)
    //   .replace(/background: url\('/g, `background: url('${Config.tklink}/api/jyeoo/proxyImage?urlImage=`);
  }
  return showImgSrc;
};

// 上传图片后将编辑器内的base64图片保存时替换为在线地址
/**
 * 对编辑器内 base64 图片进行替换
 * @param {*} html 当前编辑器内 html 内容
 * @param {*} url 上传的图片返回的 url
 * @param {*} remove 是否移除调 oss 连接的前缀部分
 */
export const changeImgSrc = (html = '', url = '', remove = false) => {
  if (typeof html !== 'string') return '';
  let newHtml = html;
  if (remove) {
    newHtml = String(newHtml).replace(/src="((https?):)?(\/\/oss-cn-hangzhou\.aliyuncs\.com\/zm-chat-interview)*/g, 'src="');
  } else {
    newHtml = String(newHtml).replace(/(src="data:.+")/g, `src="${url}" `);
  }
  return newHtml;
};

/**
 * 上传图片
 * @param {*} url 图片的上传地址
 * @param {*} blob 图片的数据
 * @param {*} callback 上传图片的回调
 * @param {*} errFn 上传报错后的回调
 */
export const fetchUpdateImg = (url, blob, callback, errFn) => {
  const formDate = new FormData();
  formDate.append('file', blob, `${Math.ceil(Math.random() * 1000000000)}.jpeg`);
  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'image/jpeg,image/apng,image/*,*/*;',
      mobile: AppLocalStorage.getMobile(),
      password: AppLocalStorage.getPassWord(),
    },
    body: formDate,
  }).then((res) => res.json()).then((json) => {
    callback(json);
  }).catch((err) => errFn(err));
};

/**
 * 上传图片
 * @param {string} url 图片的上传地址
 * @param {*} blob 图片的数据
 * @param {fn} callback 上传图片的回调
 * @param {fn} errFn 上传报错后的回调
 */
export const fetchUpdateImgByToken = (url, blob, callback, errFn) => {
  const formDate = new FormData();
  formDate.append('file', blob, `${Math.ceil(Math.random() * 1000000000)}.jpeg`);
  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'image/jpeg,image/apng,image/*,*/*;',
      accessToken: AppLocalStorage.getOauthToken(),
    },
    body: formDate,
  }).then((res) => res.json()).then((json) => {
    callback(json);
  }).catch((err) => errFn(err));
};

/**
 * 转换成 string
 * @param {any} value 需要转换成 string 的数据
 */
export const toString = (value) => String(value || '');
/**
 * 转换成 number
 * @param {any} number 需要转化成 number 的数据
 */
export const toNumber = (number) => (isNumber(number) ? number : Number(number));
/**
 * 转换成 boolean
 * @param {*} bol 需要转换成 boolean 的数据
 */
export const toBoolean = (bol) => (isBool(bol) ? bol : Boolean(bol));
/**
 * 转换成 json
 * @param {*} json 需要转换成 json 的数据
 */
export const toJson = (json) => {
  if (isObj(json)) {
    return JSON.stringify(json);
  } else {
    window.console.warn(`${json} is not a object, can not to transform!`);
    return json;
  }
};

/**
 * 对某个方法或函数进行延迟执行
 * @param {() => void} func 需要延迟执行的方法
 * @param {number} lazyTime 延迟的时间（毫秒）
 */
export const lazyFn = (func, lazyTime) => {
  setTimeout(() => func, lazyTime || 30);
};

/**
 * number => Chinese Number
 * @param {number} number 需要转换成中文的数字
 */
export const numberToChinese = (number) => {
  if (Number(number) >= 0 && Number(number) <= 99) {
    return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十',
      '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十',
      '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九', '五十',
      '五十一', '五十二', '五十三', '五十四', '五十五', '五十六', '五十七', '五十八', '五十九', '六十',
      '六十一', '六十二', '六十三', '六十四', '六十五', '六十六', '六十七', '六十八', '六十九', '七十',
      '七十一', '七十二', '七十三', '七十四', '七十五', '七十六', '七十七', '七十八', '七十九', '八十',
      '八十一', '八十二', '八十三', '八十四', '八十五', '八十六', '八十七', '八十八', '八十九', '九十',
      '九十一', '九十二', '九十三', '九十四', '九十五', '九十六', '九十七', '九十八', '九十九', '一百',
    ][number - 1];
  }
  return number;
};
/**
 * english letterList
 * @type string[] 英文字母集合
 */
export const letterOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
/**
 * number => English Letter
 * @param {number} number 需要转换成英文字母的数字
 */
export const numberToLetter = (number) => {
  if (isNumber(number) && number >= 0) {
    return letterOptions[number % 26];
  }
  return number;
};

function convert(num) {
  const newArr = [];
  let newStr;
  // 先把数字转化为相应的罗马字母
  /* eslint-disable no-param-reassign */
  while (num > 0) {
    if (num - 1000 >= 0) {
      newArr.push('M');
      num -= 1000;
    } else if (num - 500 >= 0) {
      newArr.push('D');
      num -= 500;
    } else if (num - 100 >= 0) {
      newArr.push('C');
      num -= 100;
    } else if (num - 50 >= 0) {
      newArr.push('L');
      num -= 50;
    } else if (num - 10 >= 0) {
      newArr.push('X');
      num -= 10;
    } else if (num - 5 >= 0) {
      newArr.push('V');
      num -= 5;
    } else if (num - 1 >= 0) {
      newArr.push('I');
      num -= 1;
    }
  }
  /* eslint-enable no-param-reassign */
  newStr = newArr.join('');
  // 将4和9的情况进行替换
  newStr = newStr.replace(/VI{4}|LX{4}|DC{4}|I{4}|X{4}|C{4}/g, (match) => {
    switch (match) {
      case 'VIIII':
        return 'IX';
      case 'LXXXX':
        return 'XC';
      case 'DCCCC':
        return 'CM';
      case 'IIII':
        return 'IV';
      case 'XXXX':
        return 'XL';
      case 'CCCC':
        return 'CD';
      default:
        break;
    }
  });
  return newStr;
}
/**
 * number => roma
 * @param {number} number 需要转换成罗马数字的数字
 */
export const numberToRome = (number) => {
  if (Number(number) >= 0 && Number(number) <= 30) {
    return convert(number - 1);
  }
  return number;
};

/**
 * 获取到对应的 letterOptions 中下标
 * @param {string} letter 需要搜寻下标的字母
 */
export const LettersInOptionsIndex = (letter) => {
  let res = 0;
  if (isString(letter)) {
    res = letterOptions.findIndex(letter);
  }
  return res > -1 ? res : 0;
};

/**
 * @type {{
 * 0: '带领取',
 * 1: '已被切割领取',
 * 2: '切割待审核',
 * 3: '切割审核未通过',
 * 4: '切割审核通过',
 * 5: '已被录入领取',
 * 6: '录入待审核',
 * 7: '录入审核未通过',
 * 8: '录入审核通过',
 * 9: '已被标注领取',
 * 10: '标注待审核',
 * 11: '标注已审核',
 * 12: '切割审核中',
 * 13: '录入审核中',
 * 14: '贴标签审核中',
 * 15: '试卷转化中',
 * 16: '试卷转化失败',
 * 17: '终审审核中',
 * 18: '试卷已入库',
 * }} 试卷录入流程中试卷状态对应关系
 */
export const paperStates = {
  0: '带领取',
  1: '已被切割领取',
  2: '切割待审核',
  3: '切割审核未通过',
  4: '切割审核通过',
  5: '已被录入领取',
  6: '录入待审核',
  7: '录入审核未通过',
  8: '录入审核通过',
  9: '已被标注领取',
  10: '标注待审核',
  11: '标注已审核',
  12: '切割审核中',
  13: '录入审核中',
  14: '贴标签审核中',
  15: '试卷转化中',
  16: '试卷转化失败',
  17: '终审审核中',
  18: '试卷已入库',
};
/**
 * @type {{[key:number]: '— —'}} 试卷录入流程中对应状态的操作项文案
 */
export const paperStatesControl = {
  0: '— —',
  1: '— —',
  2: '— —',
  3: '— —',
  4: '— —',
  5: '— —',
  6: '— —',
  7: '— —',
  8: '— —',
  9: '— —',
  10: '— —',
  11: '— —',
  12: '— —',
  13: '— —',
  14: '— —',
  15: '— —',
  16: '— —',
  17: '— —',
  18: '— —',
};

/**
 * @type <object>[] 制作作业时用的难度选择。
 */
export const diffList = [{
  id: 4,
  name: '全部',
}, {
  id: 1,
  name: '基础',
}, {
  id: 2,
  name: '中档',
}, {
  id: 3,
  name: '困难',
}];

/**
 * @type {{[key:string]: number}} 学科枚举
 */
export const ESubjects = {
  语文: 1,
  数学: 2,
  英语: 3,
  物理: 4,
  化学: 5,
  生物: 6,
  政治: 7,
  历史: 8,
  地理: 9,
  科学: 10,
  奥数: 11,
  信息: 12,
  文综: 13,
  理综: 14,
  文数: 15,
  理数: 16,
  学习力训练: 17,
  钢琴陪练: 21,
};

/**
 * @type {{[key:string]: number}} 题目类型
 */
export const QuestionType = {
  单选题: 1,
  多选题: 2,
  填空题: 3,
  解答题: 4,
  翻译题: 5,
  判断题: 6,
  连线题: 7,
  实验题: 8,
  实践探究: 9,
  句子变形: 10,
  作图题: 11,
  口算题: 12,
  计算题: 13,
  应用题: 14,
  完形填空: 15,
  阅读理解: 16,
  句型转换: 17,
  书面表达: 18,
  七选五: 19,
  任务型阅读: 20,
  短文改错: 21,
  句子改错: 22,
  听力: 23,
  问答题: 24,
  材料题: 25,
  填表题: 26,
  简答题: 27,
  排序题: 28,
};


/**
 * 寻找父级，直到找到 div 为止，返回 div 的 dom 对象
 * @param {HTMLElement} dom 需要进行搜寻的 DOM
 * @returns {HTMLDivElement} resDom 需找到父级第一个 div
 */
export const findParentIsDiv = (dom) => {
  let resDom = null;
  if (dom.nodeName === 'DIV') {
    resDom = dom;
  } else {
    resDom = findParentIsDiv(dom.parentNode);
  }
  return resDom;
};

/**
 * 当前元素的父级中是否存在某个出现了指定的 className
 * @param {HTMLElement} dom 需要进行搜寻的 DOM
 * @param {string} classType 指定的 calssName
 * @returns {boolean} flag 是否含有指定 className
 */
export const findParentHasClass = (dom, classType) => {
  if (dom.nodeName === 'BODY' || dom.nodeName === 'HTML') {
    return false;
  }
  let flag = false;
  dom.classList.forEach((it) => {
    if (it === classType) {
      flag = true;
    }
  });
  if (flag) {
    return true;
  } else {
    return findParentHasClass(dom.parentNode, classType);
  }
};

/**
 * 过滤除了图片外的 html 格式
 * @param {string} value 需要过滤的 html 字符串
 */
export const filterHtmlForm = (value) => {
  let res = '';
  if (isString(value)) {
    res = value.replace(/<(?!img)[^>]*>|&nbsp;|\s/g, '');
  } else {
    res = value;
  }
  return res;
};

/**
 * 将img HTMLElement 替换成"图片"
 * @param {string} value 需要过滤的 html 字符串
 */
export const transImgToText = (value = '') => {
  return value.replace(/<img[^>]*>|<\/img>/g, ',图片,');
};

/**
 * 将zmblank HTMLElement 过滤掉
 * @param {string} value 需要过滤的 html 字符串
 */
export const filterBlank = (value = '') => {
  return value.replace(/<zmblank[^>]*>.*?<\/zmblank>/g, '');
};
/**
 * zmsubline HTMLElement 过滤掉
 * @param {string} value 需要过滤的 html 字符串
 */
export const filterSubline = (value = '') => {
  return value.replace(/<zmsubline[^>]*>.*?<\/zmsubline>/g, '');
};
/**
 * zmindent HTMLElement 过滤掉
 * @param {string} value 需要过滤的 html 字符串
 */
export const filterIndent = (value = '') => {
  return value.replace(/<zmindent[^>]*>.*?<\/zmindent>/g, '');
};
/**
 * 将zmlatex HTMLElement 过滤掉
 * @param {string} value 需要过滤的 html 字符串
 */
export const transLatexToText = (value = '') => {
  return value.replace(/<zmlatex[^>]*>.*?<\/zmlatex>/g, ',公式,');
};

/**
 * 将 HTMLElement 标签去掉，只保留纯文本信息
 * @param {string} value 需要过滤的 html 字符串
 */
export const filterHTML = (value = '') => {
  return value.replace(/<(\S*?)[^>]*>|<\/\S*?>|<.*?\/>|&lt;(\S*?).*?&gt;/g, ',');
};

/**
 * 将 HTMLElement 标签去掉，只保留纯文本信息
 * @param {string} value 需要过滤的 html 字符串
 */
export const filterSpace = (value = '') => {
  return value.replace(/&nbsp;/g, '');
};

/**
 * 将 HTMLElement 统一处理成纯文本信息
 * @param {string} value 需要过滤的 html 字符串
 */


export const filterToText = (value) => {
  return filterHTML(filterSubline(filterBlank(filterIndent(filterSpace(transLatexToText(transImgToText(value || ''))))))).replace(/,{2,}/, ',');
};


// 对题型进行分类
export const chooseTypeList = [1, 2, 6, 23, 38, 48, 49];  // 选择题
export const vacancyTypeList = [3, 12, 32, 39];  // 填空题
export const simpleTypeList = [5, 11, 18, 27, 28, 34, 40, 46];  // 简答题
export const complexTypeList = [4, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 24, 25, 26, 33, 41, 42, 43, 44, 45];  // 复合题
export const classifyList = [36]; // 配对题
export const matchList = [7, 37]; // 配对题型模版
export const fillTypeList = [35, 19]; // 选词填空
export const subjectivityChooseList = [47]; // 主观选择题
export const interactiveJudgeList = [52]; // 互动判断题
export const interactiveOrderList = [51]; // 互动排序题
export const listenList = [50]; // 听力题
let downloadFlag = false;
/**
 * 下载文件
 * @param {{ url: string, fileName: string, startLoad: () => void, endLoad: () => void }} obj
 * @param {() => void} dispatch 组件的 dispatch 方法
 */
export const downloadFile = (obj, dispatch) => {
  if (downloadFlag) {
    return;
  }
  downloadFlag = true;
  if (!obj.fileUrl || typeof obj.fileUrl !== 'string') return;
  if (obj.startLoad && typeof startLoad === 'function') {
    obj.startLoad();
  } else if (dispatch) {
    dispatch(changeAlertShowOrHideAction(true));
    dispatch(setAlertStatesAction(fromJS({
      title: '试卷下载中...',
      imgType: 'loading',
    })));
  }
  try {
    fetch(obj.fileUrl).then((res) => res.blob()).then((blob) => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
      a.href = url;
      a.download = toString(obj.fileName) || new Date().toLocaleDateString();
      a.click();
      window.URL.revokeObjectURL(url);
      if (obj.endLoad && obj.endLoad === 'function') {
        obj.endLoad();
      } else {
        dispatch(setAlertStatesAction(fromJS({
          buttonsType: '1',
          title: '下载完成，开始保存到本地',
          imgType: 'success',
        })));
      }
      downloadFlag = false;
    });
  } catch (err) {
    dispatch(setAlertStatesAction(fromJS({
      buttonsType: '2',
      title: '下载失败',
      imgType: 'error',
      warningMsg: err.message,
    })));
    downloadFlag = false;
  }
};

/**
 * 对字符串末尾的换行进行过滤
 * @param {string} str 要过滤的字符串
 */
export const filterquestion = (str) => (str || '').replace(/<br\s?\/?>/gi, '');

/**
 * 如果 flag 为 true 返回 cb 的返回值，否则返回空数组
 * @param {boolean} flag 是否返回 cb 的返回值
 * @param {() => any[]} cb 返回一个数组的方法
 */
export const backArr = (flag, cb) => {
  let res = [];
  if (flag) {
    res = cb();
  }
  return res;
};

/**
 * @type number
 */
export const limitCount = 3;  // 知识点和考点的限制数量

/**
 * 获取题型的中文描述
 * @param {{id:number,name:string}[]} questionTypeList 题型数据列表
 * @param {number} currenId 选择的题型的 id
 */
export const getQuestionType = (questionTypeList, currenId) => {
  const idItemList = questionTypeList.filter((item) => item.get('id') === toNumber(currenId));
  let res = '';
  if (idItemList.count() > 0) {
    res = idItemList.get(0).get('name');
  } else {
    res = '*';
  }
  return res;
};

/**
 * 字符串转数组
 * @param {string} str 需要转换成数组的字符串
 * @param {string} flag 进行转换的匹配字符
 */
export const strToArr = (str, flag) => {
  let res = [];
  if (typeof str === 'string' && str.length > 0) {
    res = str.split(flag);
  }
  return res;
};

// withId 携带id
/**
 * 返回当前树种选中的包含所有子集节点的 idList
 * @param {{id:number,name:string,children:{id:number,name:string}[]}} treeData 树状数据
 * @param {number[]} idList 当前选择的节点的 id 的 List
 * @param {{id?:number,name:string}[]} backRes 最终要返回的数组
 * @param {any} type 类型标识
 * @param {boolean} withId 是否返回 id
 */
export const backChooseItem = (treeData, idList, backRes = [], type, withId) => {
  const res = backRes;
  const iIdList = idList;
  if (iIdList.length <= 0) {
    return res;
  }
  treeData.forEach((item) => {
    const children = item.get('children');
    if (children && children.count() > 0) {
      res.concat(backChooseItem(children, idList, res, type, withId));
    } else {
      const signIndex = idList.indexOf(item.get('id'));
      if (signIndex > -1) {
        res.push(withId ? { name: item.get('name'), id: item.get('id') } : item.get('name'));
        idList.splice(signIndex, 1);
      }
    }
  });
  return res;
};

export const backFlatMap = (treeData, idList, backRes = [], type, withId) => {
  const res = backRes;
  const iIdList = idList;
  if (iIdList.length <= 0) {
    return res;
  }
  treeData.forEach((item) => {
    const children = item.get('children');
    const signIndex = idList.indexOf(item.get('id'));
    if (signIndex > -1) {
      res.push(withId ? { name: item.get('name'), id: item.get('id') } : item.get('name'));
      idList.splice(signIndex, 1);
    }
    if (children && children.count() > 0) {
      res.concat(backFlatMap(children, idList, res, type, withId));
    }
  });
  return res;
};

/**
 * @type {string[]} 表格中列的对应数据 key
 */
export const trItemList = ['paperName', 'questionCount', 'insertPerson', 'refleshTime', 'paperState', 'control'];
/**
 * @types {{name:string,scale:number}[]} rowList 表格中的列的 head 内容及宽度占比
 */
export const rowList = [{
  name: '试卷名称',
  scale: 4,
}, {
  name: '题目数量',
  scale: 1,
}, {
  name: '上传者',
  scale: 1.5,
}, {
  name: '更新时间',
  scale: 1.5,
}, {
  name: '状态',
  scale: 1.5,
}, {
  name: '操作',
  scale: 2,
}];

/**
 * 是否需要增加序号
 * @param {number} subject 学科 id
 * @param {number} questionType 题型 id
 */
// function isNeedIndexNo(subject, questionType) {
//   if (subject && ESubjects.英语 === subject) {
//     //
//     if ([QuestionType['完形填空'], QuestionType['七选五'], QuestionType['任务型阅读']].includes(questionType)) {
//       return true;
//     }
//   }
//   return false;
// }



/**
 * 针对不同年级选择不同的字体
 * @param {*} id 学科 id
 */
export const chooseFont = (id) => {
  let res = '"KaTeX_Math", "思源黑体 CN Normal", "Microsoft YaHei"';
  if (id === 1) {
    res = '"思源黑体 CN Normal", "Microsoft YaHei"';
  } else if (id === 3) {
    res = '"Arial", "思源黑体 CN Normal", "Microsoft YaHei"';
  }
  return res;
};

/**
 * @types {RegExp[]} regList
 */
const regList = [
  /style="color:\s?(#[^;]{3,6});?"|style="color:\s?(rgb([^)]+))"/g,
  /style="text-align: left;?"/g,
  /style="text-align:\s?center;?"/g,
  /style="text-align:\s?right;?"/g,
  /style="text-align:\s?justify;?"/g,
  /\s?contenteditable="false"/g,
  />空类?\d+</g,
  /<img\s[^>]+alt="学科网[^>]+>/g,
  /<img\s?[^>]+C:[^>]+>/gi,
];

/**
 * 对 regList 匹配的内容进行格式化
 * @param {string} str 需要格式化的字符串
 * @returns {string} newStr 格式化后的字符串
 */
export const formatZmStand = (str) => {
  const newStr = str
    .replace(regList[0], 'zmcolor="$1$2"')
    .replace(regList[1], 'zmalign="left"')
    .replace(regList[2], 'zmalign="center"')
    .replace(regList[3], 'zmalign="right"')
    .replace(regList[4], 'zmalign="justify"')
    .replace(regList[5], '')
    .replace(regList[6], '><')
    .replace(regList[7], '')
    .replace(regList[8], '');
  return newStr;
};
/**
 * 对匹配的内容从zm自定义属性转回 html 格式
 * @param {string} str 需要格式化的字符串
 * @returns {string} newStr 格式化后的字符串
 */
export const ZmToHtml = (str) => {
  console.log('ZmToHtml', str);
  const newStr = str
    .replace(/zmalign="left"/g, 'style="text-align: left;"')
    .replace(/zmalign="center"/g, 'style="text-align: center;"')
    .replace(/zmalign="right"/g, 'style="text-align: right;"')
    .replace(/zmalign="justify"/g, 'style="text-align: justify;"');
  return newStr;
};

/**
 * @types {RegExp[]} regbackList
 */
// const regbackList = [
//   /zmcolor="(#[^"]{3,6})"/g,
//   /zmalign="([a-zA-Z]+)"/g,
//   /<zmindent[^>]*>.*?<\/zmindent>/g,
//   /<zmblank[^>]*>.*?<\/zmblank>/g,
//   /<zmsubline[^>]*>.*?<\/zmsubline>/g,
//   /<img[^>]+file:[^>]+>/g,
// ];



/**
 * katex 转换 htmlString 的一步调用
 * @param {string} str 需要转换的字符串
 * @returns {string} str
 */
export const renderKatex = (str) => {
  if (!str) return '';
  return renderToKatex(backfromZmStandPrev(str, 'createHw'));
};

/**
 * 根据关键字获取其父级的 idList
 * @param {{id:number,name:string,children:{id:number,name:string}[]}} data 树状数据
 * @param {string} keyword 关键字
 * @param {number[]} List 收集目标节点的数组
 * @returns {number[]}
 */
export const getParentKeyForKeyword = (data, keyword, List = []) => {
  let res = List;
  data.forEach((item) => {
    const children = item.children;
    if (children && children.length > 0) {
      if (children.some((it) => it.name.includes(keyword))) {
        res.push(item.id);
      }
      res = res.concat(getParentKeyForKeyword(children, keyword));
    }
  });
  return res;
};

/**
 * 根据 id 获取父级 idList
 * @param {{id:number,name:string,children:{id:number,name:string}[]}} data 树状数据
 * @param {*} idList 需要进行查找的 id 数组
 * @param {number[]} List 收集目标节点的数组
 * @returns {number[]}
 */
export const getParentKeyForIdList = (data, idList, List = []) => {
  let res = List;
  data.forEach((item) => {
    const children = item.children;
    if (children && children.length > 0) {
      if (children.some((it) => idList.includes(it.id))) {
        res.push(item.id);
      }
      res = res.concat(getParentKeyForIdList(children, idList));
    }
  });
  return res;
};
/**
 * 获取到拥有关键字的节点有多少个
 * @param {{id:number,name:string,children:{id:number,name:string}[]}} data 树状数据
 * @param {string} keyword 关键字
 * @param {number} count 找到的节点数
 * @returns {number} count
 */
export const searchCount = (data, keyword, count = 0) => {
  if (!keyword) return 0;
  let res = count;
  data.forEach((item) => {
    if (item.name.includes(keyword)) res += 1;
    const children = item.children;
    if (children && children.length > 0) {
      res = searchCount(children, keyword, res);
    }
  });
  return res;
};

/**
 * 用于在标注时过滤已删除的标签id
 * @param {number[]} data 所有 id
 * @param {number[]} idList 选中的 id
 * @returns {number[]}
 */
export const filterTreeNode = (data, idList = []) => {
  const res = [];
  idList.map((it) => toNumber(it)).forEach((id) => {
    if (data.includes(id)) res.push(id);
  });
  return Array.from(new Set(res));
};

/**
 * 获取到树种所有节点的 id
 * @param {{id:number,name:string,children:{id:number,name:string}[]}} data TreeData
 * @reutrns {number[]} res
 */
export const ingadoToArr = (data) => {
  let res = [];
  if (!data || data.length <= 0) return res;
  data.forEach((item) => {
    res.push(item.id);
    const children = item.children;
    if (children && children.length > 0) {
      res = res.concat(ingadoToArr(children, res));
    }
  });
  return res;
};


/**
 * 根据年级 id 返回学段 id
 * @param {number} id 年级 id
 * @returns {number} res;
 */
export const backPhaseId = (id) => {
  let res = 1;
  if (id > 6 && id < 10) res = 2;
  if (id > 9 && id < 13) res = 3;
  return res;
};

/**
 * 判断是否为语文、英语、奥数
 * @param {*} id 学科 Id
 */
export const pointToUnity = (id) => [1, 3, 11].includes(id);

/**
 * 抽取出当前学段的年级
 * @param {{id:number,name:string,phaseId:number}} gradeList 年级列表
 * @param {{id:number,name:string,gradeId:number,subjectId:number,phaseId:number}} selectPhaseSubject phaseSubject 列表
 */
export const homeworkGradeList = (gradeList = fromJS([]), selectPhaseSubject) => {
  const phaseId = selectPhaseSubject.get('phaseId') || -1;
  const res = gradeList.filter((item) => item.get('phaseId') === phaseId).map((item) => fromJS({ id: item.get('id'), name: item.get('name'), phaseId: item.get('phaseId') })).unshift(fromJS({ id: -1, name: '全部' }));
  return res;
};

/**
 * 时间戳转日期
 * @param {*} timestamp 时间戳
 * @param {*} withTime 是否跟上时分
 * @param {*} withSecond 是否跟上秒
 * @returns {string}
 */
export const timestampToDate = (timestamp, withTime, withSecond) => {
  let len = String(timestamp).length;
  if (!timestamp) return '时间为空';
  if (len === 10) {
    // eslint-disable-next-line no-param-reassign
    timestamp *= 1000;
    len = 13;
  }
  if (len === 13) {
    const date = formatDate(`yyyy-MM-dd${withTime ? ' HH:mm' : ''}${withSecond ? ':ss' : ''}`, new Date(timestamp));
    return date;
  } else {
    return '时间格式不正确';
  }
};

export const getyearList = () => {
  const nowYear = new Date().getFullYear();
  const yearList = new Array(11)
    .fill({})
    .map((item, index) => { return ({ id: nowYear - index, name: String(nowYear - index) }) });
  return yearList;
};

export const getYearListArray = () => {
  const yearList = [];
  const curYear = new Date().getFullYear();
  for (let i = 0; i < 10; i++) {
    yearList.push(String(curYear - i));
  }
  return yearList;
};
// 根据不同学科获取不同的能力维度
/**
 * 根据不同学科获取不同的能力维度
 * @param {*} subject 学科id
 * @param {*} withValue 是否以 {label, value} 形势返回数据
 * @returns {string|{value:string,label:string}} abilities
 */
export const getAbility = (subject, withValue) => {
  if (!subject) return null;
  let subjectId = Number(subject);
  let abilities = null;
  if (subjectId == 3) {
    abilities = englishAbilities;
  } else if (subjectId == 2) {
    abilities = mathAbilities;
  } else if ([4, 5, 6, 10].includes(subjectId)) {
    abilities = integratedAbilities;
  } else if (subjectId == 1) {
    abilities = chineseAbilities;
  } else if ([7, 8, 9].includes(subjectId)) {
    abilities = minorAbilities;
  }
  if (withValue && abilities) {
    abilities = abilities.map((it, index) => {
      return {
        value: String(index),
        label: it,
      };
    });
  }
  return abilities;
};

/**
 * 需要打乱几个数 返回打乱后的数组
 * @param {number} num 数组长度
 * @returns {number[]} randomList
 */
export const randomWithNum = (num) => {
  if (num <= 1) return [0];
  const numList = new Array(num).fill('').map((it, index) => index);
  const randomList = numList.sort(() => (Math.random() > 0.5 ? -1 : 1));
  // 顺序没打乱就重新打乱
  let mess = randomList.some((it, index) => it != (index));
  return !mess ? randomWithNum(num) : randomList;
};

/**
 * 数组随机打乱
 * @param {any[]} arr 需要打乱的数组
 * @returns {any[]} resArr
 */
export const randomArr = (arr) => {
  if (!_.isArray(arr) || arr.length <= 0) return [];
  if (arr.length <= 1) {
    return arr;
  }
  const index = Math.floor(Math.random() * arr.length);
  const resArr = arr.splice(index, 1);
  return resArr.concat(randomArr(arr));
};

/**
 * 判断是否有某一个权限
 * @param {string} permission 需要校验的权限
 * @returns {boolean} isAuthorised
 */
export const isAuthorised = (permission) => {
  if (!permission) {
    return true; // 没有传默认不设权限
  }
  const userInfo = AppLocalStorage.getUserInfo();
  const permissionList = userInfo.permissionList;
  return permissionList.indexOf(permission) > -1;
};

export { backfromZmStand, backfromZmStandPrev, renderToKatex, mathToUnify };
