import request, { postjsonoptions, putjsonoptions } from 'utils/request';
import Config from 'utils/config';
import verify from './validate';
import util from '../../util';

const saveQuestion = async (params) => {
  if (params.id) { // 暂时通过是否有id判断是否是更新
    return updateQuestion(params);
  }
  const question = await verify.handleBrforeSubmit(params);
  const reqUrl = `${Config.trlink_qb}/api/question`;
  return request(reqUrl, Object.assign({}, postjsonoptions(), { body: JSON.stringify(question) }));
};

const updateQuestion = async (params) => {
  if (!params.id) {
    return util.lackParam('更新题目缺少题目id');
  }
  const question = await verify.handleBrforeSubmit(params);
  const reqUrl = `${Config.trlink_qb}/api/question/${params.id}`;
  return request(reqUrl, Object.assign({}, putjsonoptions(), { body: JSON.stringify(question) }));
};

export default {
  saveQuestion,
  updateQuestion,
};