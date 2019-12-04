import request, {
  postjsontokenoptions,
} from 'utils/request';

import Config from 'utils/config';

const createThinkTag = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/thinkTag/create`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateThinkTag = (id, params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/thinkTag/update/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteThinkTag = (id) => {
  const reqUrl = `${Config.zmtrlink}/api/thinkTag/delete/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

const findAll = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/thinkTag/findAllByCondition`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};


export default {
  createThinkTag,
  updateThinkTag,
  deleteThinkTag,
  findAll
};