import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';
import { message as AntMsg } from 'antd';

// 获取课程体系等级列表
export const getLevelList = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystemLevel/findAllByCondition`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), {
    body: JSON.stringify(params)
  })).then((res) => {
    const { data, message, code } = res;
    if (code !== '0') {
      AntMsg.error('数据获取失败，请稍后再试');
      if (message) {
        console.error('后端报错：', message);
      }
    }
    return data;
  });
};
// 获取等级属性详情
export const getOneLevelInfo = (params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/courseSystemLevel/getOne`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), {
    body: JSON.stringify(params)
  })).then((res) => {
    const { data, message, code } = res;
    if (code !== '0') {
      AntMsg.error('数据获取失败，请稍后再试');
      if (message) {
        console.error('后端报错：', message);
      }
    }
    return data;
  });
};
// 更新等级属性详情
export const updateOneLevelInfo = (params = {}) => {
  // const { id, ...rest } = params;
  const requestURL = `${Config.zmtrlink}/api/courseSystemLevel/update`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), {
    body: JSON.stringify(params)
  })).then((res) => {
    const { data, message, code } = res;
    if (code !== '0') {
      AntMsg.error('更新失败，请稍后再试');
      if (message) {
        console.error('后端报错：', message);
      }
    }
    return data;
  });
};
