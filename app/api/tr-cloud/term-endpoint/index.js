import request, {
  // putjsontokenoptions,
   gettockenurloptions,
  postjsontokenoptions,
  // deletejsontokenoptions,
  // posturloptions,
} from 'utils/request';

import Config from 'utils/config';

// 获取年级
const getAllTerm = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/term/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const getTerm = (params = {}) => {
  const reqUrl = `${Config.trlink}/api/term`;
  return request(reqUrl, Object.assign({}, gettockenurloptions(), params));
};
export default {
  getAllTerm, getTerm
};
