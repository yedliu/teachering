import microVideoApi from 'api/tr-cloud/micro-course-video-endpoint/index.js';
import { handleRequest } from 'utils/helpfunc';
// 视频列表
export const  getMicroVideoList = (params) => {
  return handleRequest(microVideoApi.getVideoList, { params, target: { total: 0, list: [] }});
};

// 新增
export const  addVideo = (params) => {
  return handleRequest(microVideoApi.addVideo, { params, code: true });
};

// 上传参数
export const getUploadPolicy = () => {
  return handleRequest(microVideoApi.getPolicy);
};
// 更新
export const editVideo = (params) => {
  return handleRequest(microVideoApi.updateVideo, { params, code: true });
};

// 删除
export const delVideo = (params) => {
  return handleRequest(microVideoApi.delVideo, { params, code: true });
};
// 拿播放地址
export const getPlayUrl = (params) => {
  return handleRequest(microVideoApi.getPlayUrl, { params, target: '' });
};
