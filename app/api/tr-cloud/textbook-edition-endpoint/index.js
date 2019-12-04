import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 获取教材版本
const getTextbookEdition = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbookEdition/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const saveTextbookEdition = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbookEdition/save`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateTextbookEdition = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbookEdition/update/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteTextbookEdition = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbookEdition/delete/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getEditionList = (gradeId, subjectId, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/textbookEdition/getEdition/list/${gradeId}/${subjectId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};


export default {
  getTextbookEdition,
  saveTextbookEdition,
  updateTextbookEdition,
  deleteTextbookEdition,
  getEditionList,
};