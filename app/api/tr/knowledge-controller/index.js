import { mathToUnify } from 'components/CommonFn';
import request, { geturloptions } from 'utils/request';
import Config from 'utils/config';
import util from '../../util';

// 获取知识点
const getKonwLeadge = (params) => {
  if (!params.gradeId) {
    return util.lackParam('获取知识点缺少年级id');
  }
  if (!params.subjectId) {
    return util.lackParam('获取知识点缺少学科id');
  }
  const reqUrl = `${Config.trlink}/api/knowledge`;
  const handleParams = mathToUnify(params);
  return request(reqUrl, Object.assign({}, geturloptions()), handleParams);
};

export default {
  getKonwLeadge
};