import { message } from 'antd';
import api from '../../../../api/tr-cloud/zm-child-test-course-system-endpoint';

export const getTestCourseSystem = async params => {
  const res = await api.getTestCourseSystem(params);
  let data = [];
  if (Number(res.code) === 0) {
    data = res.data || [];
  } else {
    message.error(res.message || '获取测评课课程失败');
  }
  return new Promise(resolve => resolve(data));
};

export const createTestCourseSystem = async params => {
  const res = await api.createTestCourseSystem(params);
  let success = false;
  if (Number(res.code) === 0) {
    message.success('保存测评课课程成功');
    success = true;
  } else {
    message.error(res.message || '保存测评课课程失败');
  }
  return new Promise(resolve => resolve(success));
};

export const setZmChildTestCourseContent = async (params) => {
  const res = await api.setZmChildTestCourseContent(params);
  let success = false;
  if (Number(res.code) === 0) {
    message.success('设置课程内容成功');
    success = true;
  } else {
    message.error(res.message || '设置课程内容失败');
  }
  return new Promise(resolve => resolve(success));
};

export const updateTestCourseSystem = async (id, params) => {
  const res = await api.updateTestCourseSystem(id, params);
  let success = false;
  if (Number(res.code) === 0) {
    message.success('更新测评课课程成功');
    success = true;
  } else {
    message.error(res.message || '更新测评课课程失败');
  }
  return new Promise(resolve => resolve(success));
};

export const deleteTestCourseSystem = async id => {
  const res = await api.deleteTestCourseSystem(id);
  let success = false;
  if (Number(res.code) === 0) {
    success = true;
    message.success('删除测评课课程成功');
  } else {
    message.error(res.message || '删除测评课课程失败');
  }
  return new Promise(resolve => resolve(success));
};
