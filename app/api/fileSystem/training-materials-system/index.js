import request, {
  postjsontokenoptions,
  gettockenurloptions,
  deletejsontokenoptions,
} from 'utils/request';
import Config from 'utils/config';

/**
 * @description 获取学习资料系统数据
 * @param {Object} params 查询参数
 */
const getTrainingMaterialsSystem = (params = {}) => {
  const reqUrl = `${Config.studySys}/trainingMaterialsSystem`;
  return request(reqUrl, Object.assign({}, gettockenurloptions()), params);
};

const setTrainingMaterialsSystem = (params = {}) => {
  const reqUrl = `${Config.studySys}/trainingMaterialsSystem`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const setTrainingMaterialsSystemById = (id, params = {}) => {
  const reqUrl = `${Config.studySys}/trainingMaterialsSystem/${id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteTrainingMaterialsSystemById = (id) => {
  const reqUrl = `${Config.studySys}/trainingMaterialsSystem/${id}`;
  return request(reqUrl, Object.assign({}, deletejsontokenoptions()));
};


const sort = (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('ids must be Array');
  }
  const reqUrl = `${Config.studySys}/trainingMaterialsSystem/sort`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(ids) }));
};

export default {
  getTrainingMaterialsSystem,
  setTrainingMaterialsSystem,
  setTrainingMaterialsSystemById,
  deleteTrainingMaterialsSystemById,
  sort,
};