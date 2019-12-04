/**
 * 课程体系管理内比较通用的接口
 * getSubjectGrade => 获取少儿所有的科目年级
 * getState => 获取上下架状态 暂时是前端写死的
 **/

import { message } from 'antd';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import editionApi from 'api/tr-cloud/zm-child-edition-endpoint';
import { handleRequest } from 'utils/helpfunc';
// 上下架状态
const stateList = [
  { id: '', name: '全部' },
  { id: 1, name: '上架' },
  { id: 0, name: '隐藏' }
];

const difficultyList = [
  { id: 0, name: '默认' },
  { id: 1, name: '容易' },
  { id: 2, name: '中等' },
  { id: 3, name: '困难' }
];

export const getSubjectGrade = async () => {
  // 接口返回所有的学科年级
  const res = await subjectApi.getChildSubjectGrade();
  let data = [];
  if (Number(res.code) === 0) {
    const resData = res.data || [];
    data = resData.map(item => {
      return {
        id: item.value,
        name: item.label,
        children: item.children // 遍历出所有的年级改成 {id, name} 的格式。
          ? item.children.map(el => {
            return { id: el.value, name: el.label };
          })
          : []
      };
    });
  } else {
    message.error(res.message || '获取年级学科失败');
  }
  return new Promise(resolve => resolve(data));
};

export const getEdition = async params => {
  const res = await editionApi.getEdition(params);
  let data = [];
  if (Number(res.code) === 0) {
    data =
      (res.data &&
        res.data.map(item => {
          return { id: `${item.id}`, name: item.name };
        })) ||
      [];
  } else {
    message.error(res.message || '获取课程体系失败');
  }
  return new Promise(resolve => resolve(data));
};

// 获取上下架状态 防止以后改成从接口获取
export const getState = () =>
  new Promise((resolve, reject) => {
    resolve(stateList);
  });

export const getDifficulty = async params =>
  new Promise((resolve, reject) => {
    resolve(difficultyList);
  });

// 设置默认
export const setDefault = (params) => {
  return handleRequest(editionApi.setDefaultCourse, { params });
};
