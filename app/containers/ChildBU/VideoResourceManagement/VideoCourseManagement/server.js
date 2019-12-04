import api from 'api/tr-cloud/subject-endpoint/index.js';
import videoApi from 'api/tr-cloud/zm-child-cs-audio-endpoint';
import { handleRequest } from 'utils/helpfunc';

export const getCourseSystemVideos = async (params = {}) => {
  let data = await handleRequest(api.getCourseSystemVideos, { params });
  return data;
};
export const pullOffShelves = async (params = {}) => {
  let data = await handleRequest(videoApi.pullOff, { params });
  return data;
};


export const pullOnShelves = async (params = {}) => {
  let data = await handleRequest(videoApi.pullOn, { params });
  return data;
};

export const deleteItem = async (params = {}) => {
  let data = await handleRequest(videoApi.deleteCsVideo, { params });
  return data;
};

export const updateItem = async (params = {}) => {
  let data = await handleRequest(videoApi.updateCsVideo, { params });
  return data;
};


// 更新状态
export const updateItemState = async (params = {}) => {
  let data = await handleRequest(videoApi.updateCsVideoState, { params, code: true });
  return data;
};
