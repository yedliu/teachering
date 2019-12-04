import request, {
  postjsontokenoptions,
  gettockenurloptions
} from 'utils/request';

import Config from 'utils/config';

// 查询课程内容列表
const getContentList = (params = {}) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 删除
const delMicroCourseContent = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/delete?id=${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 新增
const addMicroCourseContent = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/create`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 编辑
const editMicroCourseContent = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/update`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 上传图片policy
const getUploadImgPolicy = () => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/uploadPolicy`;
  return request(reqUrl, Object.assign({}, gettockenurloptions()));
};

// 查看所有视频
const getAllVideo = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/findAllVideo`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 添加视频
const addVideo = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/addVideo`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 更新视频
const updateVideo = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/updateVideo`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 删除视频
const delVideo = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/deleteVideo?id=${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

// 排序
const sortVideo = (params) => {
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/sortVideo`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 设置oss访问权限
const sortOssAcl = (params) => {
  console.log(params);
  const reqUrl = `${Config.zmtrlink}/api/microCourseContent/setOssAcl?pathPrefix=${params.pathPrefix}`;
  console.log(reqUrl);
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
export default {
  getContentList, delMicroCourseContent, addMicroCourseContent,
  editMicroCourseContent, getUploadImgPolicy, getAllVideo, addVideo,
  updateVideo, delVideo, sortVideo, sortOssAcl
};
