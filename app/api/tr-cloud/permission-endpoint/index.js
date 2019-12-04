import request, {
  postjsontokenoptions,
} from 'utils/request';

import Config from 'utils/config';

// 获取角色
const getPermission = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/permission/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  getPermission,
};