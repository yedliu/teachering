import request, {
  postjsontokenoptions,
} from 'utils/request';

import Config from 'utils/config';

// 获取年级
const getPhase = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/phase/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  getPhase,
};