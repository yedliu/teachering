// import Config from 'utils/config';
// import request, { postjsontokenoptions } from 'utils/request';
import questionApi from 'api/qb-cloud/question-endpoint';

const requestTimeOut = 30 * 1000;

// 获取题目
export const getQuestionsList = (option) => {
  // const reqUrl = `${Config.zmcqLink}/api/question/findByIdList`;
  return questionApi.findByIdList({ _timeout: requestTimeOut, idList: option });
  // return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsontokenoptions()), { idList: option });
};
