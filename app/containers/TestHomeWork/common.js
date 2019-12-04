import styled from 'styled-components';
import Config from 'utils/config';

// 过滤当前是否为个位数，个位数则加上0到前面
export const ifLessThan = (timeStr) => {
  if (typeof (timeStr) === 'string') {
    timeStr = Number(timeStr);
  }
  return timeStr > 9 ? timeStr : '0' + timeStr;
};

// 格式化时间，返回格式化后时间字符串
/**
 * @param {*} str ：必填，格式化时的格式（字符串）
 * @param {*} timeobj ：选填，不传入时间对象则默认获取当前时间
 */
export const formatDate = (str, timeobj = new Date()) => {
  if (typeof str !== 'string' || !str.charAt) {
    console.warn(str + ': is not a string');
  }
  const year = String(timeobj.getFullYear());
  const month = String(timeobj.getMonth() + 1);
  const date = String(timeobj.getDate());
  const hours = String(timeobj.getHours());
  const minutes = String(timeobj.getMinutes());
  const milliseconds = String(timeobj.getMilliseconds());
  return str.replace(/yyyy/, year).replace(/M{2}/, ifLessThan(month)).replace(/d{2}/, ifLessThan(date)).replace(/H{2}/, ifLessThan(hours)).replace(/m{2}/, ifLessThan(minutes)).replace(/s{2}/, ifLessThan(milliseconds));
};

// 获取时间的时分秒对象
/**
 * @param {*} time // 参数为时间的毫秒数
 */
export const costTimeObj = (time = 0) => {
  const timeobj = {
    h: Math.floor(time / (60 * 60 * 1000)),
    m: Math.floor(time / 60000) % 60,
    s: Math.floor(time / 1000) % 60,
  };
  return timeobj;
};

// 添加图片前缀
export const addImgSrc = (htmlStr, type) => {
  let showImgSrc = null;
  if (type === 'stuAnswer') {
    showImgSrc = htmlStr.replace(/(src=")|(src=)/g, `src="//oss-cn-hangzhou-internal.aliyuncs.com/zm-chat-interview`).replace(/background: url\('/g, `background: url('//oss-cn-hangzhou-internal.aliyuncs.com/zm-chat-interview`);
  } else {//homework-test.zmlearn.com/api/jyeoo/proxyImage?
    showImgSrc = htmlStr.replace(/src="/g, `src="${Config.tklink}/api/jyeoo/proxyImage?urlImage=`).replace(/background: url\('/g, `background: url('${Config.tklink}/api/jyeoo/proxyImage?urlImage=`);
  }
  return showImgSrc;
};

export const ClearFix = styled.div`
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
`;
