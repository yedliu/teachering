import request, {
  postjsontokenoptions,
} from 'utils/request';

import Config from 'utils/config';


const pullOff = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCsAudio/pullOffShelves/${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
const pullOn = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCsAudio/putOnShelves/${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};


const deleteCsVideo = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCsAudio/delete/${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

const updateCsVideo = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCsAudio/update`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 编辑状态
const updateCsVideoState = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/zmChildCsAudio/updateState`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
export default {
  pullOff,
  pullOn,
  deleteCsVideo,
  updateCsVideo,
  updateCsVideoState
};
