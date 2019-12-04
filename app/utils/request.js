import 'whatwg-fetch';
import { Config } from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';
import { browserHistory } from 'react-router';
import { encryption, decryption } from 'components/CommonFn/apiEnCode';
import { toNumber } from 'lodash';
import { until } from 'wait-promise';
import { message } from 'antd';
import { encryptPublicKey } from 'containers/Login/common';
import { sentryReporter } from './helpfunc';
import examPaperApi from 'api/qb-cloud/exam-paper-end-point';
let isRefreshingTocken = false;
// // 日志格式
// const logJSON = (url, name, err, options = {}) => ({
//   action: 'tr-request',
//   url,
//   name,
//   err,
//   options,
// });

export const posturloptions = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    mobile: AppLocalStorage.getMobile(),
    password: AppLocalStorage.getPassWord(),
  },
};

export const geturloptions = () => (
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      mobile: AppLocalStorage.getMobile(),
      password: AppLocalStorage.getPassWord(),
    },
  }
);

export const gettockenurloptions = () => (
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      accessToken: AppLocalStorage.getOauthToken(),
    },
  }
);

export const getjsonoptions = () => (
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      mobile: AppLocalStorage.getMobile(),
      password: AppLocalStorage.getPassWord(),
    },
  }
);

// 登录专用
export const getloginjsonoptions = (accessToken) => (
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      accessToken,
    },
  }
);

export const getjsontokenoptions = () => ({
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    accessToken: AppLocalStorage.getTocken(),
  },
});

export const postjsonoptions = () => (
  {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      mobile: AppLocalStorage.getMobile(),
      password: AppLocalStorage.getPassWord(),
    },
  }
);
export const postjsonburialoptions = () => (
  {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
  }
);
export const postjsontokenoptions = () => ({
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    accessToken: AppLocalStorage.getTocken(),
  },
});

export const putjsonoptions = () => (

  {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      mobile: AppLocalStorage.getMobile(),
      password: AppLocalStorage.getPassWord(),
    },
  }
);
export const putjsontokenoptions = () => (
  {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      accessToken: AppLocalStorage.getOauthToken()
    },
  }
);
export const geturlnoauthoptions = () => (
  {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    }
  }

);
export const deletejsonoptions = () => (
  {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      mobile: AppLocalStorage.getMobile(),
      password: AppLocalStorage.getPassWord(),
    },
  }
);
export const deletejsontokenoptions = () => ({
  method: 'DELETE',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    accessToken: AppLocalStorage.getTocken(),
  },
});

export const uploadoptions = {
  method: 'PUT',
  headers: {
    mobile: AppLocalStorage.getMobile(),
    password: AppLocalStorage.getPassWord(),
  }
};

export const posthomeworkjsonoptions = () => (
  {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      mobile: AppLocalStorage.getMobile(),
      password: AppLocalStorage.getPassWord(),
    },
  }
);

export const normalgetheader = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  }
};
export const normlposturloptions = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  }
};
export const normalputheader = {
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  }
};

export function JsonToUrlParams(data) {
  return Object.keys(data).map((k, index) => `${index === 0 ? '?' : ''}${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
}

export function JsonToUrlBodyParams(data) {
  return Object.keys(data).map((k, index) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
}

export function UrlParamsToJson(str) {
  return JSON.parse(`{"${decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json();
}

function checkTocken(response, url, getparamstr, options) {
  if (response.message.indexOf('未登录') > -1) {
    // window.__acc__ && window.__acc__(logJSON(url, '未登录', '', options));
    // 自动重登
    let newOptions = options;
    let actionFn = new Promise(resolve => resolve());
    if (!isRefreshingTocken) {
      actionFn = refreshTocken();
    }
    isRefreshingTocken = true;
    // token拿回来之后再次发送请求
    const promise = actionFn.then(() => until(() => !isRefreshingTocken)).then(() => {
      newOptions.headers.accessToken = AppLocalStorage.getTocken();
    });

    return promise.then(() => {
      return fetch(`${url}${getparamstr}`, newOptions)
        .then(checkStatus)
        .then(parseJSON);
    })
      .catch(err => {
        loginErr(url, err, options);
      });
  }
  return response;
}

const loginErr = (url, err, options = {}) => {
  console.error('err', err);
  // window.__acc__ && window.__acc__(logJSON(url, '重登失败', err, options));
  sentryReporter(err);
  message.error('请求失败，请重试或退出重新登录', 3);
};

const refreshTocken = () => {
  const mobile = AppLocalStorage.getMobile();
  const password = AppLocalStorage.getPassWord();
  const reqUrl = `${Config.zmcLogin}/api/oauth/tr/applyPublicKey`;
  return request(reqUrl, Object.assign({}, postjsonoptions(), { body: JSON.stringify({ mobile, password }) })) // 为了防止循环引用 请勿用api中的方法
    .then((resp) => {
      if (Number(resp.code) === 0) {
        const encryptParams = encryptPublicKey(resp.data.publicKey, mobile, password);
        const loginReqUrl = `${Config.zmcLogin}/api/oauth/tr/loginEncrypt`;
        return request(loginReqUrl, Object.assign({}, postjsonoptions(), { body: JSON.stringify(encryptParams) }));
      } else {
        loginErr('applyPublicKey', '请求失败');
      }
    })
    .then((res) => {
      if (Number(res.code) === 0) {
        isRefreshingTocken = false;
        const accessToken = res.data.token;
        AppLocalStorage.setOauthToken(accessToken);
        // console.log('设置token成功', +new Date());
        return accessToken;
      } else {
        loginErr('applyPublicKey', '请求失败');
      }
    });
};

export function nothing(res) {
  return res;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
export function checkStatus(response, url) {
  if (response.status === 403) {
    // window.__acc__ && window.__acc__(logJSON(url, '403', '', { token: AppLocalStorage.getTocken() }));
    AppLocalStorage.setIsLogin(false);
    browserHistory.push('/');
    window.location.reload();
  }
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(` ${response.status} ${response.statusText}`);
  error.response = response;
  sentryReporter(error);
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *                  [options._timeout: set fetch timeout]
 * @return {object}           The response data
 */
const encryptionUrl = [
  `${Config.zmcqLink}/api/question/encrypt`,
  `${Config.zmcqLink}/api/question/queryEncryptQuestionForManage`,
  `${Config.trlink_qb}/api/question/encrypt`,
  `${Config.trlink_qb}/api/question/findByIdList`
];
/**
 * 处理url 加mock
 * @param url 原始url
 * @param isMock 是否需要加mock
 * @returns {string|*}
 */
const handleMockUrl = (url) => {
  // console.log(url, Config);
  let hosts = Object.values(Config);
  let host = hosts.find(item => url.indexOf(item) > -1);
  // console.log(host, 'host');
  let api = url.replace(host, '');
  // console.log(api);
  let newUrl = host + '/mock' + api;
  return newUrl;
};
/**
 * 接口调用函数（最后一个参数传true，可切换到mock接口）
 * @param oldUrl
 * @param options
 * @param getparam
 * @param isMock 只有为true的情况下会切换到mock接口
 * @returns {*|Promise<any>}
 */
export default function request(oldUrl, options, getparam, isMock) {
  // 根据是否传入需要mock 把url改成mock接口
  let params = getparam;
  let url = oldUrl;
  try {
    const isDev = process.env.NODE_ENV !== 'production'; // 只在开发环境使用
    if (isDev && (isMock === true || params === true)) {
      url = handleMockUrl(url);
    }
    if (!(params instanceof Object)) {
      params = null;
    }
  } catch (e) {
    console.log(e);
  }
  return requestOld(url, options, params);
}
export function requestOld(url, options, getparam) {
  const getparamstr = getparam ? (`${JsonToUrlParams(getparam)}`) : '';

  return new Promise((resolve, reject) => {
    let reqquestTimeOut = false;
    const params = options;
    const timer = params._timeout && setTimeout(() => {
      reqquestTimeOut = true;
      // window.__acc__ && window.__acc__(logJSON(url, '数据请求超时', '', options));

      const err = new Error(JSON.stringify({ message: '数据请求超时', options, url }));
      // 上报错误
      sentryReporter(err);
      resolve({ code: -99, message: '数据请求超时' });
    }, params._timeout);
    if (encryptionUrl.find((n) => n === url) && params.body) {
      params.body = encryption(params.body, 'json');
    }
    return fetch(`${url}${getparamstr}`, params)
      .then((response) => checkStatus(response, url))
      .then(parseJSON)
      .then((res) => checkTocken(res, url, getparamstr, options)) // token失效，重新登录
      .then((res) => {
        clearTimeout(timer);
        const resData = res;
        if (encryptionUrl.find((n) => n === url) && toNumber(resData.code) === 0 && resData.data) {
          resData.data = decryption(resData.data);
        }
        if (!reqquestTimeOut) resolve(resData);
      })
      .catch(err => {
        reject(err);
      });
  });
}
export const addQuestionCountByExamPaper = async (examPaperId) => {
  try {
    const res = await examPaperApi.addQuestionCountByExamPaper({ examPaperId });
    console.log('res', res);
  } catch (e) {
    console.log('出错啦~', e);
  }
};
