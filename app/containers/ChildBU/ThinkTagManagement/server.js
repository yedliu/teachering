import { message } from 'antd';
import api from 'api/tr-cloud/think-tag-endpoint';
import dictApi from 'api/tr-cloud/dict-endpoint';

export const getThinkTag = async params => {
  let data = {};
  try {
    const res = await api.findAll(params);
    if (Number(res.code) === 0) {
      data = res.data || {};
    } else {
      message.error(res.message || '获取思维标签失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常, 获取思维标签失败');
  }
  return data;
};

export const createThinkTag = async params => {
  let success = false;
  try {
    const res = await api.createThinkTag(params);
    if (Number(res.code) === 0) {
      message.success('保存思维标签成功');
      success = true;
    } else {
      message.error(res.message || '保存思维标签失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常, 保存思维标签失败');
  }
  return success;
};

export const updateThinkTag = async (id, params) => {
  let success = false;
  const res = await api.updateThinkTag(id, params);
  try {
    if (Number(res.code) === 0) {
      message.success('更新思维标签成功');
      success = true;
    } else {
      message.error(res.message || '更新思维标签失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常, 更新思维标签失败');
  }
  return success;
};

export const deleteThinkTag = async id => {
  let success = false;
  const res = await api.deleteThinkTag(id);
  try {
    if (Number(res.code) === 0) {
      success = true;
      message.success('删除思维标签成功');
    } else {
      message.error(res.message || '删除思维标签失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常, 删除思维标签失败');
  }
  return success;
};

export const getChildSubjectPhase = async () => {
  // 接口返回所有的学科年级
  let data = [];
  try {
    const res = await dictApi.findChildSubjectPhase();
    if (Number(res.code) === 0) {
      const resData = res.data && res.data.children || [];
      data = resData.map(item => {
        return {
          id: item.value,
          name: item.label,
          children: item.children // 遍历出所有的年级改成 {id, name} 的格式。
            ? item.children.map(el => {
              return { id: el.value, name: el.label };
            })
            : [],
        };
      });
    } else {
      message.error(res.message || '获取学科学段失败');
    }
  } catch (err) {
    console.error(err);
    message.error('系统异常, 获取学科学段失败');
  }
  return data;
};
