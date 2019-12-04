import request, {
  putjsontokenoptions,
  gettockenurloptions,
  postjsontokenoptions,
  deletejsontokenoptions,
} from 'utils/request';

import Config from 'utils/config';

// 获取版本
const getEdition = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/edition`;
  return request(reqUrl, Object.assign({}, gettockenurloptions()), params);
};

/**
 * 根据年级学科id 获取版本
 * @param {{ gradeId: number, subjectId: number }} params 年级
 */
const findEditionByGradeIdAndSubjectId = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/edition/findByGradeIdAndSubjectId`;
  return request(reqUrl, Object.assign({}, gettockenurloptions()), params);
};

const saveEdition = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/edition`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

const updateEdition = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/edition/${id}`;
  return request(
    reqUrl,
    Object.assign({}, putjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

const deleteEdition = id => {
  const requestURL = `${Config.zmtrlink}/api/edition/${id}`;
  return request(requestURL, Object.assign({}, deletejsontokenoptions()));
};

export default {
  getEdition,
  saveEdition,
  updateEdition,
  deleteEdition,
  findEditionByGradeIdAndSubjectId,
};
