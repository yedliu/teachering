import request, {
  postjsontokenoptions,
} from 'utils/request';

import Config from 'utils/config';

// 获取年级
const getGrade = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/grade/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getChildGrade = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/grade/findChildGrade`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findNonPreschoolGrades = () => {
  const reqUrl = `${Config.zmtrlink}/api/grade/findNonPreschoolGrades`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

export default {
  getGrade,
  getChildGrade,
  findNonPreschoolGrades,
};