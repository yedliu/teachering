import { backfromZmStandPrev, renderToKatex } from 'zm-tk-ace/utils';
let baseId = Number(`${Number(new Date())}`.slice(3, -3));  // 本地生成 id 起始值
const idHash = window._h5UniqueIdHash = {}; // 当前所有 id 记录

const noop = () => { };
const appInfo = {};
appInfo.questionHeaderNumber = {};

window.disableLogLine = location.host === 'tr.zmlearn.com';

const formatSlide = { // 课件一级key：content 数据格式规则（必有字段）
  data: [],
  defaultTheme: 'default', // 课件主题 只影响题目
  defaultPageBackground: {}, // 课件默认背景 影响所有page
  defaultLogo: {}, // 课件logo 影响所有page|包括切片
};
const formatList = { // 课件一级key：data：children 数据格式规则（必有字段）
  dir: {
    children: [],
    name: ''
  },
  slide: {
    children: [],
    name: ''
  },
  page: {
    containerStyle: {},
    elements: [],
    config: {
      isLockBackgroundImg: false,
      isLockLogo: false,
    },
    logo: {},
    remark: {}
  }
};
// window.disableLogLine = true;
export default appInfo;

// log with title
export function makeLog(title, isDisplayAll = false) {
  let lastTime;
  return (...args) => {
    const LogAreaInZml = document.getElementsByClassName('logArea')[0];
    if (LogAreaInZml) {
      LogAreaInZml.innerHTML = `<br><br>${LogAreaInZml.innerHTML}`;
      let thisLog = '';
      for (let item in args) {
        if (isDisplayAll) {
          thisLog += `${typeof (args[item]) === 'object' ? JSON.stringify(args[item]) : args[item]} `;
        } else {
          thisLog += `${typeof (args[item]) === 'object' ? JSON.stringify(args[item]) : args[item]} `.slice(0, 200);
        }
      }
      LogAreaInZml.innerHTML = thisLog + LogAreaInZml.innerHTML;
    }
    if (window.disableLogLine) return;
    const nowTime = window.performance && performance.now() || Number(new Date());
    const titleStyle = 'background: DodgerBlue; color: #ffffff'; //
    setTimeout(console.info.bind(console,
      `%c${title}`, titleStyle,
      '\n    utl:', `${nowTime.toFixed(3)} ${((nowTime - lastTime) || 0).toFixed(3)}ms`,
      '\n    msg:', ...args
    ));
    lastTime = nowTime;
  };
}

// 还原题目里标记 zmTag
export function zmTagToHtml(tagStr) {
  return renderToKatex(backfromZmStandPrev(tagStr, 'createHw'));
}

// 整体题目对象，用于将原始题目存储为课件里面的题目对象
export function tidyQuestion(question) {
  const newQuestion = {
    id: question.id || '',
    title: {
      htmlStr: zmTagToHtml(question.title)
    },
  };
  if (question.analysis) {
    newQuestion.analysis = { htmlStr: zmTagToHtml(question.analysis) };
  }
  if (question.answerList) {
    newQuestion.answerList = question.answerList.filter(item => item !== void 0).map(item => {
      return { htmlStr: zmTagToHtml(item) };
    });
  }
  if (question.optionList) {
    newQuestion.optionList = question.optionList.filter(item => item !== void 0).map(item => {
      return { htmlStr: zmTagToHtml(item) };
    });
  }
  if (question.children && String(question.templateType) === '1') {
    newQuestion.children = question.children.map(_q => tidyQuestion(_q));
  }
  return Object.assign({}, question, newQuestion);
}

// 创建uniqueId (排除excludeId, noNewId只收集不创建)
export function makeUniqueId(excludeId, noNewId) {
  if (excludeId) idHash[excludeId] = true;
  if (noNewId) return;

  while (idHash[baseId]) {
    baseId += 1;
  }

  idHash[baseId] = true;

  return baseId;
}

// 收集已有的 page.id
export function collectExistIds(list) {
  if (!list || !list.forEach) return;
  list.forEach(item => {
    item.id && makeUniqueId(item.id, true);
    collectExistIds(item.children || item.elements);
  });
}

// 指定更新 部分元素的id
export function updateUniqueId(list) {
  if (!list || !list.forEach) return;
  list.forEach(item => {
    if (!(item instanceof Object)) return;
    let id = item.id = item.id || makeUniqueId();
    if (idHash[id]) {
      item.id = makeUniqueId(id);
    }
    updateUniqueId(item.children || item.elements);
  });
}

// 确保保存时，当前课件或切片中的每个元素的id唯一
export function checkUniqueId(list) {
  let idMap = {};
  checkId(list);

  function checkId(list) {
    if (!list || !list.forEach) return;

    list.forEach(item => {
      if (!(item instanceof Object)) return;

      let id = item.id = item.id || makeUniqueId();
      while (idMap[id]) {
        id = item.id = makeUniqueId(idMap[id]);
      }

      idMap[id] = true;
      checkId(item.children || item.elements);
    });
  }
}

// 检查切片或课程目录层级是否有空白名称项
export function checkEmptyDirName(data) {
  let hasEmptyName = false;
  (function checkEmpty(list) {
    list && list.forEach && list.forEach((item) => {
      hasEmptyName = hasEmptyName || (item.type === 'dir' && !item.name);
      item.children && checkEmpty(item.children);
    });
  })(data);
  return hasEmptyName;
}

// 将课件或切片内容转换成页面数组
export function makeDirToPages(dirData = [], haddleItem = noop) {
  const pages = [];
  getPages(dirData);
  return pages;
  function getPages(list) {
    list && list.forEach && list.forEach(item => {
      haddleItem(item);
      item.type === 'page' && pages.push(item);
      if (item.type === 'slide' && item.hidden) return;
      item.children && getPages(item.children);
    });
  }
}

// 将课件或切片内容转换成页面数组
export function makeDirToSlideInfoList(dirData = [], haddleItem = noop) {
  const pages = [];
  getPages(dirData, '', '');
  return pages;

  function getPages(list, slideId, slideName) {
    list && list.forEach && list.forEach(item => {
      haddleItem(item);
      item.type === 'page' && pages.push({ slideId, slideName });
      if (item.type === 'slide' && item.hidden) return;
      item.children && getPages(item.children, item.type === 'slide' ? item.slideId : slideId, item.type === 'slide' ? item.name : slideName);
    });
  }
}

// 移除toFixed之后无用的0和小数点
export function tidyFixedNumber(originNum, fixedLength = 3) {
  const newNumArr = (Number(originNum)).toFixed(fixedLength).split('.');
  const decNum = (newNumArr[1] || '').replace(/[\.0]*$/g, '');
  return Number(decNum ? [newNumArr[0], '.', decNum].join('') : newNumArr[0]);
}

// 近似比较 a、b
export function similarEqual(a, b, accuracy) {
  if (isNaN(a) || isNaN(b) || isNaN(accuracy)) return false;
  return a >= b - accuracy && a <= b + accuracy;
}

// 获取单个题目的复合id
export function getComposeId(item) {
  const { question, subQuestionId } = item;
  const { id, children, templateType } = question || {};
  const subId = subQuestionId || (String(templateType) === '1' && children && children.length === 1 && (children[0] || {}).id);
  const questionComposeId = id + (subId ? `_${subId}` : '');
  return questionComposeId;
}

// 获取当前课件所有题目
export function getQuestionIds(slideData, container) {
  slideData && slideData.forEach && slideData.forEach(item => {
    if (item.type === 'question') {
      container.push(getComposeId(item));
    }
    getQuestionIds(item.children || item.elements, container);
  });
  return container;
}

// 获取当前课件所有题目
export function getQuestionIdInfo(slideData) {
  let res = {
    slideQIds: [],
    courseQIds: []
  };
  slideData && slideData.forEach && slideData.forEach(item => {
    const { type, children } = item;
    if (type === 'slide') {
      getQuestionIds(children, res.slideQIds);
    } else {
      getQuestionIds(children, res.courseQIds);
    }
  });
  return res;
}

// map Page & elements
export function mapList(list, callback) {
  list && list.forEach && list.forEach(item => {
    callback && callback(item, list);
    mapList(item.children || item.elements, callback);
  });
}

// 获取课件数据中的主题设置
export function getSlideDataStyle(slideData) {
  let slideStyle;
  (function rc(list) {
    list && list.forEach && list.forEach(item => {
      if (item.type === 'question' || item.type === 'slide' || slideStyle) return;
      slideStyle = item.styleType;
      rc(item.children || item.elements);
    });
  })(slideData.data || slideData);
  return slideStyle;
}

/**
 * @export formatSlideContent
 * @description  课件一级key：content数据格式化
 * @param {*} _slideData 请求相应的课件内容
 * @var appInfo.slideData 课件内容
 * @const formatSlide 课件一级key：content格式规则
 */
export function formatSlideContent(_slideData) {
  appInfo.slideData = _slideData.data ? _slideData : { data: _slideData };
  for (const key of Object.keys(formatSlide)) {
    if (key === 'defaultTheme') {
      appInfo.slideData[key] = appInfo.slideData[key] || getSlideDataStyle(appInfo.slideData) || JSON.parse(JSON.stringify(formatSlide[key]));
    } else {
      appInfo.slideData[key] = appInfo.slideData[key] || JSON.parse(JSON.stringify(formatSlide[key]));
    }
  }
  formatSlideData(appInfo.slideData.data);
  formatIndexData(appInfo.slideData && appInfo.slideData.indexData && appInfo.slideData.indexData.data);
  checkUniqueId(appInfo.slideData.data);
}

/**
 * @export formatSlideData
 * @description  课件一级key：data类型数据格式化
 * @param {*} list  appInfo.slideData.data || appInfo.slideData.data:children
 * @const formatList 课件一级key：data子集格式规则
 */
export function formatSlideData(list, isSlide) {
  list && list.forEach && list.forEach((item) => {
    if (formatList[`${item.type}`]) {
      for (const key of Object.keys(formatList[`${item.type}`])) {
        if (key === 'name' && (typeof item.name !== 'string')) { item.name = '' }
        item[key] = item[key] || JSON.parse(JSON.stringify(formatList[`${item.type}`][key]));
      }
    }
    if (item.type === 'page') {
      item.content ? delete item.content : null;
      if (item.config && !item.config.isLockLogo && isSlide === 'slide') {
        item.logo = JSON.parse(JSON.stringify(appInfo.slideData.defaultLogo || {}));
      }
      if (item.config && !item.config.isLockBackgroundImg && isSlide === 'slide') {
        item.containerStyle = JSON.parse(JSON.stringify(appInfo.slideData.defaultPageBackground || {}));
      }
    } else if (item.type === 'question') {
      item.styleType = appInfo.slideData.defaultTheme || 'default';
      if (item && item.optionsLayout === 'horizontal' && item.styleType === 'default') {
        item.optionsLayout = 'vertical';
      }
      if (item.question && item.question.templateType && item.question.templateType === 1 && item.question.children && item.question.children.length ===  1) {
        item.subQuestionId = item.question.children[0].id;
      }
    } else if (item.type === 'slide') {
      return formatSlideData(item.children || item.elements, 'slide');
    }

    formatSlideData(item.children || item.elements, isSlide);
  });
}

/**
 * @export formatIndexData
 * @description  课件一级key：indexData类型数据格式化
 * @param {*} list  appInfo.slideData.indexData
 */
export function formatIndexData(list) {
  list && list.forEach && list.forEach((item) => {
    if (item && item.type === 'dir' && item.name && typeof item.name !== 'string') { item.name = '' }
    formatIndexData(item.children);
  });
}

// 整理课件中的题号，主要用于复合题题号展示
export function tidyQuestionIds(questionIds, questionComposeId) {
  let subIds = {};
  let qMainId = [];
  let qReg = /(\d+)/g;
  questionIds.forEach((item, index) => {
    let tmpCId = item.match(qReg);
    const firstId = tmpCId[0];
    const lastId = tmpCId[1];
    !subIds.hasOwnProperty(firstId) && qMainId.push(firstId);
    subIds[firstId] || (subIds[firstId] = []);
    lastId && subIds[firstId].push(lastId);
  });
  let thisMainId = questionComposeId.match(qReg)[0];
  let thisSubId = questionComposeId.match(qReg)[1];
  let thisSubNum = 0;
  subIds[thisMainId] = subIds[thisMainId] || [];
  thisSubId && (thisSubNum = subIds[thisMainId].length);
  thisSubId && (thisSubId = subIds[thisMainId].indexOf(thisSubId) + 1);
  thisMainId = qMainId.indexOf(thisMainId) + 1;

  return `${thisMainId}${thisSubId && thisSubNum > 1 ? `-${thisSubId}` : ''}`;
}

const getQuestions = (slide, getSubQuestionId) => {
  let index = 0;
  const rc = (list, type) => {
    list && list.forEach && list.forEach((ele) => {
      if (ele.type === 'slide' && !ele.hidden) {
        return rc(ele.children || ele.elements, 'slide');
      }
      if (ele.type === 'question' && type === slide) {
        let subQ = getSubQuestionId(ele);
        if (!appInfo.quesIds[ele.question.id]) {
          index++;
          appInfo.quesIds[ele.question.id] = {
            index,
            type: type === 'slide' ? '例' : '练',
            subQuestion: {},
            subIndex: 0,
          };
          appInfo.quesIds[ele.question.id].subIndex++;
          subQ ? appInfo.quesIds[ele.question.id].subQuestion[subQ] = 1 : null;
        } else if (subQ && appInfo && appInfo.quesIds && appInfo.quesIds[ele.question.id] && !appInfo.quesIds[ele.question.id].subQuestion[subQ]) {
          appInfo.quesIds[ele.question.id].subIndex++;
          appInfo.quesIds[ele.question.id].subQuestion[subQ] = appInfo.quesIds[ele.question.id].subIndex;
        }
      }
      rc(ele.children || ele.elements, type);
    });
  };
  rc(appInfo.slideData && appInfo.slideData.data || appInfo.slideData, 'course');
};

/**
 * 整理课件中的题号, 主要用于题号展示及重题展示， 需求详见TC-252
 * -----
 * appInfo.questionHeaderNumber 存储所有题目编号
 * 结构：元素id + 主题id + 子题id = 第1-1题
 * ------
 * appInfo.questionIds 存储所有题目信息
 * 结构：主题id:{
 *  index, // 主题号
 *  type: type === 'slide' ? '例' : '练', // 类型
 *  subQuestion:{ 子题id:子题号 }, // 存储子题
 *  subIndex: 0, // 子题数长度
 * }
 */
export function getQuestionHeaderNumber() {
  appInfo.questionHeaderNumber = {};
  appInfo.quesIds = {};
  const getSubQuestionId = (ele) => ele.subQuestionId || (ele.question.templateType === 1 && ele.question.children && ele.question.children.length === 1 && ele.question.children[0].id) || '';
  getQuestions('slide', getSubQuestionId);
  getQuestions('course', getSubQuestionId);
  const rc = (list, isSlide) => {
    list && list.forEach && list.forEach((ele) => {
      if (ele.type === 'question') {
        let subQ = getSubQuestionId(ele);
        let _thisQesInfo = appInfo.quesIds[ele.question && ele.question.id];
        if (_thisQesInfo) appInfo.questionHeaderNumber[`${ele.id}_${ele.question.id}${subQ ? `_${subQ}` : ''}`] = `${_thisQesInfo.type + _thisQesInfo.index}${subQ ? `-${_thisQesInfo.subQuestion[subQ]}` : ''}题`;
      }
      rc(ele.children || ele.elements, isSlide);
    });
  };
  rc(appInfo.slideData && appInfo.slideData.data || appInfo.slideData);
  console.log(appInfo, 'appInfo');
}

/** 课件题目与页面对应关系
 * @export questionsToPageNumber
 * @param {*} data 课件或切片 数据
 * @returns repeatQuestions 存储题目与页码对应关系
 * repeatQuestions = {Qid：[pageNo1, pageNo2], ... }
 */
export function questionsToPageNumber(data) {
  let repeatQuestions = {};
  let Pages = makeDirToPages(data);
  Pages && Pages.forEach((page, index) => {
    page.elements && page.elements.forEach((ele) => {
      if (ele.type === 'question') {
        let key = ele.question.id;
        if (ele.subQuestionId) { key = `${ele.question.id}-${ele.subQuestionId}` }
        repeatQuestions[key] = repeatQuestions[key] || [];
        repeatQuestions[key].push(index + 1);
      }
    });
  });
  return repeatQuestions;
}

// 延时执行
export function delay(timeWait, callback) {
  setTimeout(callback || noop, timeWait || 0);
}
