import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 获取学段学科
const findSystemDictByGroupCode = (groupCode, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/dict/findSystemDictByGroupCode/${groupCode}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findItemsByDictCode = (dictCode, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/dict/findItemsByDictCode/${dictCode}`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取少儿学段学科
const findChildSubjectPhase = (groupCode, params = {}) => {
  const requestURL = `${Config.zmtrlink}/api/dict/zmChild/subject/phase/`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  findSystemDictByGroupCode,
  findItemsByDictCode,
  findChildSubjectPhase,
};