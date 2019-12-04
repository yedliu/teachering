import request, { geturloptions } from 'utils/request';
import Config from 'utils/config';

// 获取学科
const getSubjects = () => {
  const reqUrl = `${Config.trlink}/api/subject`;
  return request(reqUrl, Object.assign({}, geturloptions()));
};

export default {
  getSubjects,
};