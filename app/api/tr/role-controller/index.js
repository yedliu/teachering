import request, { geturloptions } from 'utils/request';
import Config from 'utils/config';
import util from '../../util';

// 获取角色
const getRole = (params) => {
  if (!params.id) {
    return util.lackParam('获取角色需要角色id');
  }
  const reqUrl = `${Config.trlink}/api/role/${params.id}`;
  return request(reqUrl, Object.assign({}, geturloptions()), params);
};

export default {
  getRole,
};