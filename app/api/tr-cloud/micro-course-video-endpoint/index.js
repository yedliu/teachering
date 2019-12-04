import request, {
  postjsontokenoptions, gettockenurloptions
} from 'utils/request';

import Config from 'utils/config';

// 查询课程内容列表
const getVideoList = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseVideo/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 新增视频
const addVideo = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseVideo/create`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 上传视频策略
const getPolicy = () => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseVideo/uploadPolicy`;
  return request(reqUrl, Object.assign({}, gettockenurloptions()));
};
// 更新视频
const updateVideo = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseVideo/update`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 删除视频
const delVideo = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseVideo/delete?id=${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
// 获取播放地址
const getPlayUrl = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseVideo/getSignedUrl?id=${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
export default {
  getVideoList, addVideo, getPolicy, updateVideo, delVideo, getPlayUrl
};
