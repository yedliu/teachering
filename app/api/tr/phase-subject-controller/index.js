import request, { geturloptions } from 'utils/request';
import Config from 'utils/config';
import util from '../../util';

// 获取学科
const getPhaseSubject = (params) => {
  if (!params.gradeId) {
    return util.lackParam('学科需要年级id');
  }
  const reqUrl = `${Config.trlink}/api/phaseSubject/subject`;
  return request(reqUrl, Object.assign({}, geturloptions()), params);
};

export default {
  getPhaseSubject
};