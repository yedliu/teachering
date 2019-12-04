/**
 * 前端埋点
 * 参考：http://confluence.zmops.cc/pages/viewpage.action?pageId=9056803
 **/

import JSSDK from '@zm-fe/zm-jssdk';
import storage from './utils/localStorage';
import { getHost } from  './utils/config';
const pkg = require('../package.json');

// 用户id，脚本加载后，调用localStorage.getItem('ZM_USERID')获取
const userId = storage.getUserId();
localStorage.setItem('ZM_USERID', userId);

const version = pkg.version;
// const isDev = process.env.NODE_ENV === 'development';
function getEnvironment() {
  const environment = getHost();
  // prod uat test
  return environment === 'test' ? 'fat' : environment;
}

export default function init(config = {}) {
  const environment = getEnvironment();
  // 配置上报公共属性
  setDefaults({
    appId: config.appId || '10763',
    appVersion: version,
    role: 'teacher',
  });

  // 配置sdk参数
  setConfig({
    environment,
    logLevel: environment === 'prod' ? 'error' : 'debug',
    // 如果你使用了router并且是history模式
    history: true,
  });
}

/**
 * 适合只有一个页面，且没有路由的项目，在需要页面切换的地方，手动调用，触发“routeChange“动作
 * @params {Object} data 上报数据
 *   data.pageId 自定义页面路径
 *   data.pageName 自定义页面名称
 *   data.pageParam 自定义page参数
 */
export const sendCustomPage = (data = {}) => {
  JSSDK.sendCustomPage({ ...data });
};

/**
 * 设置埋点公共字段
 * @params {object} config 公共字段配置
 * @params {Boolean} true表示手动trigger pv、os、prevpage事件
 */
export const setDefaults = (config, trigger) => {
  JSSDK.setDefaults({ ...config }, trigger);
};

/**
 * @params {Object | String} data 上报数据 or eventId
 * @params {Object} config上报数据
 * sendEvent({ eventId: '', eventParam: {}, ... })
 * sendEvent(eventId, { eventParam: {}, ... })
 */
export const sendEvent = (data, config) => {
  JSSDK.sendEvent(data, { ...config });
};

/**
 * @params {Object | String} data 上报数据 or code
 * @params {Object} config上报数据
 * sendLog({ code: '', message: {}, level: '' })
 * sendLog(code, { message: {}, level })
 */
export const sendLog = (data = {}, config = {}) => {
  JSSDK.sendEvent(data, { ...config });
};

/**
 * 修改sdk配置
 * @params {Object} config sdk配置项
 * config:
 *   environment: fat / uat / prod
 *   delayReport: true / false
 *   delayCount: 1 - 5
 *   maxRetries: 1 - 3
 *   logLevel: error / debug
 */
export const setConfig = (config = {}) => {
  JSSDK.setConfig({ ...config });
};

