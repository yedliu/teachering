import { mathToUnify } from 'components/CommonFn';
import request, { geturloptions } from 'utils/request';
import Config from 'utils/config';
import util from '../../util';

// 获取考点
const getExamPoint = (params) => {
  if (!params.gradeId) {
    return util.lackParam('获取考点缺少年级id');
  }
  if (!params.subjectId) {
    return util.lackParam('获取考点缺少学科id');
  }
  const reqUrl = `${Config.trlink}/api/examPoint`;
  const handleParams = mathToUnify(params);
  return request(reqUrl, Object.assign({}, geturloptions()), handleParams);
};

export default {
  getExamPoint
};