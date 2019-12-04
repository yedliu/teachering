import baseAbilityEndPoint from '../../api/qb-cloud/base-ability-endpoint';
import { message } from 'antd';
import querySubjects from '../../api/tr-cloud/subject-endpoint';
import phaseApi from '../../api/tr-cloud/phase-subject-endpoint';
import { handleRequest } from 'utils/helpfunc.js';
const { queryBaseAbility, addBaseAbility, updateBaseAbility, queryBaseAbilitySubjectList, updateBaseAbilitySubjectInfo, queryAbilityBySubjectAndPhase } = baseAbilityEndPoint;
const { getAllSubject } = querySubjects;
// 获取列表
export const getList = async (params) => {
  let data = await queryBaseAbility(params).then(res => {
    if (res.code === '0' && res.data) {
      return res.data;
    } else {
      message.warning(res.message);
      return {};
    }
  }).catch(() => {
    message.warning('服务不可用');
    return {};
  });
  return  data;
};
// 新增能力
export const addAbility = async (params) => {
  let data = await addBaseAbility(params).then(res => {
    if (res.code === '0') {
      message.success(res.message || '添加成功');
    } else {
      message.warning(res.message);
    }
    return res;
  }).catch(err => {
    message.warning('服务不可用');
    return err;
  });
  return data;
};

// 编辑能力
export const editAbility = async (params) => {
  let data = updateBaseAbility(params).then(res => {
    if (res.code === '0') {
      message.success(res.message || '编辑成功');
    } else {
      message.warning(res.message);
    }
    return res;
  }).catch(err => {
    message.warning('服务不可用');
    return err;
  });
  return  data;
};

// 查询能力学科列表
export const getSubjectTxt = async (params) => {
  let data = await queryBaseAbilitySubjectList(params).then(res => {
    if (res.code === '0' && res.data) {
      return res.data;
    } else {
      message.warning(res.message);
      return {};
    }
  }).catch(() => {
    message.warning('服务不可用');
    return {};
  });
  return  data;
};

// 编辑能力文案
export const editSubjectTxt = async (params) => {
  let res = await updateBaseAbilitySubjectInfo(params).then(res => {
    if (res.code === '0') {
      message.success(res.message || '编辑成功');
    } else {
      message.warning(res.message);
    }
    return res;
  }).catch(err => {
    message.warning('服务不可用');
    return err;
  });
  return res;
};

// 查学科
export const queryAllSubjects = async () => {
  let res = await getAllSubject().then(res => {
    if (res.code === '0' && res.data) {
      return res.data;
    } else {
      message.warning(res.message);
      return {};
    }
  }).catch(() => {
    message.warning('服务不可用');
    return {};
  });
  return  res;
};

// 根据学科学段查能力

export const queryAbilityByPhaseSubject = (params) => {
  return handleRequest(queryAbilityBySubjectAndPhase, { params });
};

// 获取学段
export const queryPhase = (params) => {
  return handleRequest(phaseApi.getPhaseBySubjectList, { params });
};
