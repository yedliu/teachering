import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const findUnhandle = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/questionCorrention/findUnhandle`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findHandle = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/questionCorrention/findHandle`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
const getPaperCorrention = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/questionCorrention/examPaperCorrention`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
    // true
    );
};

const adopt = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/questionCorrention/adopt`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const handle = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/questionCorrention/handle`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const insert = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/questionCorrention/insert`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  findUnhandle,
  findHandle,
  adopt,
  handle,
  insert,
  getPaperCorrention
};
