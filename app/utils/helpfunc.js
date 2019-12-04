/* eslint-disable guard-for-in */
/**
 * Created by DELL02 on 2017/10/17.
 */
import { AppLocalStorage } from './localStorage';
import { message } from 'antd';
import { fromJS } from 'immutable';
export function fileRender(react, file) {
  let render = new FileReader();
  render.onload = function(e) {
    react.img.src = e.target.result;
  };
  render.readAsDataURL(file);
}
export function UploadAjax(optionOverWrite) {
  const ajaxOption = {
    url: '#',
    method: 'GET',
    async: true,
    timeout: 0,
    data: null,
    dataType: 'text',
    headers: {},
    onprogress: function () { },
    onuploadprogress: function () { },
    xhr: null
  };
  let  options = {};
  for (let k in ajaxOption) {
    options[k] = optionOverWrite[k] || ajaxOption[k];
  }
  let xhr = options.xhr = options.xhr || new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.open(options.method, options.url, options.async);
    xhr.timeout = options.timeout;
    for (let k in options.headers) {
      xhr.setRequestHeader(k, options.headers[k]);
    }
    xhr.onprogress = options.onprogress;
    xhr.upload.onprogress = options.onuploadprogress;
    xhr.responseType = options.dataType;
    xhr.onabort = function () {
      reject(new Error({
        errorType: 'abort_error',
        xhr: xhr
      }));
    };
    xhr.ontimeout = function () {
      reject({
        errorType: 'timeout_error',
        xhr: xhr
      });
    };
    xhr.onerror = function () {
      reject({
        errorType: 'onerror',
        xhr: xhr
      });
    };
    xhr.onload = function () {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
        { resolve(xhr) }
      else
        { reject({
          errorType: 'status_error',
          xhr: xhr
        }); }
    };
    try {
      xhr.send(options.data);
    }
    catch (e) {
      reject({
        errorType: 'send_error',
        error: e
      });
    }

  });

}

export function l(name, data) {
  console.log(name, data);
}

export function Compress(file, type, callback) {
  console.log('filetype', type);
  const render = new FileReader();

  render.onload = function (e) {
    const result = this.result;
    let img = new Image();
    img.src = result;
    if (img.complete) {
      const data = getCompressData(img, type);
      img = null;
      callback(data);
    } else {
      img.onload = () => {
        const data = getCompressData(img, type);
        img = null;
        callback(data);
      };
    }
  };
  render.readAsDataURL(file);

}
export function getCompressData(img, type) {
  const initSize = img.src.length;
  let width = img.width;
  let height = img.height;
  // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
  let ratio;
  if ((ratio = width * height / 4000000) > 1) {
    ratio = Math.sqrt(ratio);
    width /= ratio;
    height /= ratio;
  } else {
    ratio = 1;
  }
  const canvas = document.createElement('canvas');
  const tCanvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const tctx = tCanvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
// 铺底色
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 如果图片像素大于100万则使用瓦片绘制
  let count;
  if ((count = width * height / 1000000) > 1) {
    count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
    // 计算每块瓦片的宽和高
    const nw = ~~(width / count);
    const nh = ~~(height / count);
    tCanvas.width = nw;
    tCanvas.height = nh;

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
      }
    }
  } else {
    ctx.drawImage(img, 0, 0, width, height);
  }
  // 进行最小压缩
  const ndata = canvas.toDataURL('image/jpeg', 0.1);
  console.log('压缩前：' + initSize);
  console.log('压缩后：' + ndata.length);
  console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%');
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
  const text = window.atob(ndata.split(',')[1]);
  const buffer = new ArrayBuffer(text.length);
  const ubuffer = new Uint8Array(buffer);
  // let pecent = 0, loop = null;

  for (let i = 0; i < text.length; i++) {
    ubuffer[i] = text.charCodeAt(i);
  }

  const Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
  let blob;

  if (Builder) {
    const builder = new Builder();
    builder.append(buffer);
    blob = builder.getBlob(type);
  } else {
    blob = new window.Blob([buffer], { type: type });
  }
  return blob;
}

export const judgeChatLength = (s) => {
  // /<summary>获得字符串实际长度，中文2，英文1</summary>
  // /<param name="str">要获得长度的字符串</param>
  let str = s;
  if (typeof s !== 'string') {
    str = String(s);
  }
  let realLength = 0;
  let len = str.length;
  let charCode = -1;
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128)
       { realLength += 1 }
    else
       { realLength += 2 }
  }
  return realLength;
};

// 检测浏览器缩放
export const detectZoom = () => {
  let ratio = 0;
  let screen = window.screen;
  let ua = navigator.userAgent.toLowerCase();
  if (window.devicePixelRatio !== void 0) {
    ratio = window.devicePixelRatio;
  // eslint-disable-next-line no-implicit-coercion
  } else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  } else if (window.outerWidth !== void 0 && window.innerWidth !== void 0) {
    ratio = window.outerWidth / window.innerWidth;
  }
  if (ratio) {
    ratio = Math.round(ratio * 100);
  }
  return ratio;
};

// 根据权限配置学科和年级对应表
export const getGradeAndSubjectMapper = () => {
  const userInfo = AppLocalStorage.getUserInfo();
  const isPartTimePersion = userInfo.typeList.indexOf(2) > -1;
  if (isPartTimePersion) {
    const phaseSet = new Set(); // 存放学段
    const allowSubjectMap = {}; // 存放允许的学科
    userInfo.phaseSubjectList.forEach(e => {
      phaseSet.add(e.phaseId);
      if (allowSubjectMap[e.phaseId]) {
        allowSubjectMap[e.phaseId].push(e.subjectId);
      } else {
        allowSubjectMap[e.phaseId] = [e.subjectId];
      }
    });
    return {
      phaseSet,
      allowSubjectMap,
      isPartTimePersion,
    };
  }
  return null;
};

// 取每一层第一个元素的children的最后一级
export const findLastLevel = (data) => {
  let target = { };
  loop(data);
  function loop(data) {
    if (data[0].children && data[0].children.length > 0) {
      loop(data[0].children);
    } else {
      target = data[0];
    }
  }
  return target;
};

/**
 * @description 手动上报错误到 sentry
 * @example sentryReporter(new Error('error message'))
 * @param {Error} err
 * @return {void}
 */
export const sentryReporter = (err) => {
  if (err instanceof Error) {
    if (window.sentry && typeof window.sentry.captureException === 'function') {
      window.sentry.captureException(err);
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('utils/helpfunc/sentryReporter 只接收 Error 类型的参数');
    }
  }
};
/**
 * 阿拉伯数字转汉字数字
 * @param i 阿拉伯数字
 * @returns {string|string|string}
 * @constructor
 */
export const NumberToChinese = (i) => {
  let num = i;
  const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
  const chnUnitChar = ['', '十', '百', '千'];
  function SectionToChinese(sect) {
    let section = sect;
    let strIns = '';
    let  chnStr = '';
    let unitPos = 0;
    let zero = true;
    while (section > 0) {
      let v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  }
  let unitPos = 0;
  let strIns = '';
  let chnStr = '';
  let needZero = false;

  if (num === 0) {
    return chnNumChar[0];
  }

  while (num > 0) {
    let section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = SectionToChinese(section);
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos++;
  }
  let arr = chnStr.split('');
  if (arr[0] === '一' && arr[1] === '十') {
    arr.splice(0, 1);
    chnStr = arr.join('');
  }
  return chnStr;
};

/**
 *
 * @param apiFunc
 * @param rest
 * @returns {Promise<T | never>}
 */
export function handleRequest(apiFunc, { params = {}, target = [], mess = '', code = false } = {}) {
  return apiFunc(params).then(res => {
    if (code) {
      if (res.code !== '0') {
        message.warning(`${mess || res.message}`);
      }
      return res.code;
    }
    if (res.code === '0') {
      return res.data || target;
    } else {
      message.warning(`${mess || res.message}`);
      return target;
    }
  }).catch(err => {
    console.log(err);
    return target;
  });
}

export function shuffle(arr) {
  const result = [];
  let random;
  while (arr.length > 0) {
    random = Math.floor(Math.random() * arr.length);
    result.push(arr[random]);
    arr.splice(random, 1);
  }
  return result;
}

// 生成试卷和作业题目列表
export const  makeQuestionList = (AIHomeworkParams) => {
  const questionDataList = AIHomeworkParams.get('AIHWQuestionList') || fromJS([]);
  const questionList = questionDataList.map((item, index) => item.set('questionIndex', index)).groupBy((item) => item.get('parentTypeName')).entrySeq();
  return { questionList, questionDataList };
};

// 处理ueditor公式前插公式导致乱码问题
export const handleFormulaCaos = (content) => {
  let newContent = content.getContent();
  if (/<zmlatex[^>]*><zmlatex[^>]*>/.test(newContent)) {
    newContent = newContent.replace(/<zmlatex[^>]*><zmlatex[^>]*>(.+?)<\/zmlatex>/gs, (ex, $1) => { // eslint-disable-line
      console.log($1, '内容');
      return `<zmlatex contenteditable="false">${$1}`;
    });
    content.setContent(newContent);
  }
};
