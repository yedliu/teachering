import request, { geturloptions } from 'utils/request';
import Config from 'utils/config';

// 卷型
const getExamType = () => {
  const reqUrl = `${Config.trlink_qb}/api/examType`;
  return request(reqUrl, Object.assign({}, geturloptions()));
};

export default {
  getExamType,
};