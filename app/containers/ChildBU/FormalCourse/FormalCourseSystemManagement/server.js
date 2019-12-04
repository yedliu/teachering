import { message } from 'antd';
import editionApi from 'api/tr-cloud/zm-child-edition-endpoint';

export const getEdition = async params => {
  const res = await editionApi.getEdition(params);
  let data = [];
  if (+res.code === 0) {
    data = res.data || [];
  } else {
    message.error(res.message || '获取课程体系失败');
  }
  return new Promise(resolve => resolve(data));
};

export const createEdition = async params => {
  const res = await editionApi.createEdition(params);
  let success = false;
  if (+res.code === 0) {
    message.success('保存课程体系成功');
    success = true;
  } else {
    message.error(res.message || '保存课程体系失败');
  }
  return new Promise(resolve => resolve(success));
};

export const updateEdition = async (id, params) => {
  const res = await editionApi.updateEdition(id, params);
  let success = false;
  if (+res.code === 0) {
    message.success('更新课程体系成功');
    success = true;
  } else {
    message.error(res.message || '更新课程体系失败');
  }
  return new Promise(resolve => resolve(success));
};

export const deleteEdition = async id => {
  const res = await editionApi.deleteEdition(id);
  let success = false;
  if (+res.code === 0) {
    success = true;
    message.success('删除课程体系成功');
  } else {
    message.error(res.message || '删除课程体系失败');
  }
  return new Promise(resolve => resolve(success));
};
