/**
 * 加解密接口
 * 接口 swagger: http://10.81.173.206:8080/swagger-ui.html#/exam-info-safe-endpoint
 */
import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 获取单个加密字符串
const getEncrypt = (id) => {
  const reqUrl = `${Config.zmceLink}/safe/encrypt`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify({ id }) }));
};

export default {
  getEncrypt,
};