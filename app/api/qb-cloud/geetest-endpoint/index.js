import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const getValidCode = (params = {}, options = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/geetest/getValidCode`;
  return request(reqUrl, Object.assign({ ...options }, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  getValidCode
};