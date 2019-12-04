import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';
import verify from './validate';
import util from '../../util';
import questionUtil from './util';


const saveQuestion = async params => {
  if (params.id) {
    // 暂时通过是否有id判断是否是更新
    return updateQuestion(params);
  }
  const question = await verify.handleBrforeSubmit(params);
  const reqUrl = `${Config.zmcqLink}/api/question/saveQuestion`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), {
      body: JSON.stringify(question),
    }),
  );
};

const updateQuestion = async params => {
  if (!params.id) {
    return util.lackParam('更新题目缺少题目id');
  }
  const question = await verify.handleBrforeSubmit(params);
  const reqUrl = `${Config.zmcqLink}/api/question/updateQuestion`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), {
      body: JSON.stringify(question),
    }),
  );
};

const deleteQuestion = async params => {
  if (!params.id) {
    return util.lackParam('更新题目缺少题目id');
  }
  const reqUrl = `${Config.zmcqLink}/api/question/deleteById`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), params);
};

const getNodesByGroup = async groupCode => {
  if (!groupCode) {
    return util.lackParam('获取字典列表缺少Code');
  }
  const reqUrl = `${Config.zmcqLink}/api/sysDict/queryNodesByGroup`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: String(groupCode) }),
  );
};

const findByIdList = async (params = {}) => {
  console.log(params, 'params');
  if (!Array.isArray(params.idList)) {
    return util.lackParam('请确保输入正确的题目id');
  }
  const reqUrl = `${Config.zmcqLink}/api/question/findByIdList`;
  return request(reqUrl, Object.assign({ _timeout: params._timeout }, postjsontokenoptions()), params);
};

// 这个接口屏蔽了 50 51 52 这三个题型，教研后台使用 queryEncryptQuestionForManage
const getQuestionWithEncrypt = (params, requestTimeOut = 5000) => {
  const reqUrl = `${Config.zmcqLink}/api/question/encrypt`;
  return request(
    reqUrl,
    Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), {
      body: JSON.stringify(params),
    }),
  ).then(res => {
    if (!res.data) {
      res.data = {
        total: 0,
        pageCount: 0,
        list: [],
      };
    }
    if (!res.data.pageCount) {
      res.data.pageCount = Math.ceil((res.data.total || 0) / params.pageSize);
    }
    res.data.data = (res.data.list || []).map((question) => questionUtil.formatAudioInfo(question));
    return res;
  });
};

const getQuestionWithEncryptForTr = (params, requestTimeOut = 5000) => {
  const reqUrl = `${Config.zmcqLink}/api/question/queryEncryptQuestionForManage`;
  return request(
    reqUrl,
    Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions(), {
      body: JSON.stringify(params),
    }),
  ).then(res => {
    if (!res.data) {
      res.data = {
        total: 0,
        pageCount: 0,
        list: [],
      };
    }
    if (!res.data.pageCount) {
      res.data.pageCount = Math.ceil((res.data.total || 0) / params.pageSize);
    }
    res.data.data = (res.data.list || []).map((question) => questionUtil.formatAudioInfo(question));
    return res;
  });
};

const findQuestion4AiHw = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/question/action/findQuestion4AiHw`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

const findQuestionType4AiHw = params => {
  const requestURL = `${
    Config.trlink_qb
    }/api/question/action/findQuestionType4AiHw`;
  return request(
    requestURL,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

// 智能换题
const getAiReplaceQuestion = params => {
  const reqUrl = `${Config.zmcqLink}/api/question/action/findQuestion4AiHw`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
  );
};

const getQuestionById = id => {
  const reqUrl = `${Config.zmcqLink}/api/question/getOne`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions()),
    { id }
  );
};
const addQuestionQuoteCount = questionIdList => {
  const reqUrl = `${Config.zmcqLink}/api/question/addQuestionQuoteCount`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions()),
    { questionIdList }
  );
};
export default {
  saveQuestion,
  updateQuestion,
  deleteQuestion,
  getNodesByGroup,
  getQuestionWithEncrypt,
  findQuestion4AiHw,
  findQuestionType4AiHw,
  getAiReplaceQuestion,
  getQuestionById,
  findByIdList,
  addQuestionQuoteCount,
  getQuestionWithEncryptForTr,
};
