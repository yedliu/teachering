import { message } from 'antd';
import courseSystemApi from 'api/tr-cloud/zm-child-course-system-endpoint';

export const getCourseSystem = async params => {
  const res = await courseSystemApi.getCourseSystem(params);
  let data = [];
  if (Number(res.code) === 0) {
    data = res.data || [];
  } else {
    message.error(res.message || '获取正式课课程失败');
  }
  return new Promise(resolve => resolve(data));
};

export const getCourseSystemByPId = async pId => {
  const res = await courseSystemApi.getCourseSystemByPId({ pId });
  let data = [];
  if (Number(res.code) === 0) {
    data = res.data || [];
  } else {
    message.error(res.message || '获取正式课课程失败');
  }
  return new Promise(resolve => resolve(data));
};

export const createCourseSystem = async params => {
  const res = await courseSystemApi.createCourseSystem(params);
  let success = false;
  if (Number(res.code) === 0) {
    message.success('保存正式课课程成功');
    success = true;
  } else {
    message.error(res.message || '保存正式课课程失败');
  }
  return new Promise(resolve => resolve(success));
};

export const updateCourseSystem = async (id, params) => {
  const res = await courseSystemApi.updateCourseSystem(id, params);
  let success = false;
  if (Number(res.code) === 0) {
    message.success('更新正式课课程成功');
    success = true;
  } else {
    message.error(res.message || '更新正式课课程失败');
  }
  return new Promise(resolve => resolve(success));
};

export const setZmChildCourseContent = async (params) => {
  const res = await courseSystemApi.setZmChildCourseContent(params);
  let success = false;
  if (Number(res.code) === 0) {
    message.success('设置课程内容成功');
    success = true;
  } else {
    message.error(res.message || '设置课程内容失败');
  }
  return new Promise(resolve => resolve(success));
};

export const deleteCourseSystem = async id => {
  const res = await courseSystemApi.deleteCourseSystem(id);
  let success = false;
  if (Number(res.code) === 0) {
    success = true;
    message.success('删除正式课课程成功');
  } else {
    message.error(res.message || '删除正式课课程失败');
  }
  return new Promise(resolve => resolve(success));
};

export const sortCourseSystem = async idList => {
  const res = await courseSystemApi.sortCourseSystem(idList);
  let success = false;
  if (Number(res.code) === 0) {
    success = true;
  } else {
    message.error(res.message || '排序失败');
  }
  return new Promise(resolve => resolve(success));
};