import {
  message
} from 'antd';

const isFunc = (cb) => cb && typeof cb === 'function';
/**
 * fetch api方法
 * params 参数
 * cb 成功回调
 * failCb 失败回调
 * finalCb 最终一定会执行的
 * name api名称
 * successCode 成功码（默认是0）
 */
const fetchData = ({ fetch, params = {}, cb, failCb, finalCb, name = '数据', successCode = 0 }) => {
  if (isFunc(fetch)) {
    fetch(params).then(res => {
      if (handleRes({ res, name, successCode })) {
        if (isFunc(cb)) {
          cb(res.data);
        } else {
          throw new Error('fetchData param3需要传入一个function');
        }
      } else {
        if (isFunc(failCb)) {
          failCb();
        }
      }
    }).catch(error => {
      if (isFunc(failCb)) {
        failCb();
      }
      throw new Error(`缺少参数:${error}`);
    }).finally(() => {
      if (isFunc(finalCb)) {
        finalCb();
      }
    });
  } else {
    throw new Error('fetchData param1需要传入一个function');
  }
};

// 结果处理
const handleRes = ({ res, name, successCode = 0 }) => {
  if (Number(res.code) === successCode) {
    return true;
  } else {
    message.error(`获取${name}失败`);
    return false;
  }
};

// await catch处理
const to = (promise) => {
  return promise.then(data => {
    return [null, data];
  }).catch(err => [err]);
};

// 缺少参数处理
const lackParam = (paramName) => {
  return new Promise((resloved, reject) => {
    reject(paramName);
  });
};

export default {
  fetchData,
  lackParam,
  handleRes,
  to
};