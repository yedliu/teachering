import request, { geturloptions } from 'utils/request';
import Config from 'utils/config';

// 获取年级
const getGradeData = () => {
  const reqUrl = `${Config.trlink}/api/grade`;
  return request(reqUrl, Object.assign({}, geturloptions()));
};

export default {
  getGradeData
};