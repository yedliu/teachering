import request, { gettockenurloptions, postjsontokenoptions } from 'utils/request';
import { AppLocalStorage } from 'utils/localStorage';
import Config from 'utils/config';

// 获取作业报表
const getHomeWorkReportData = (params) => {
  const reqUrl = `${Config.zchlink}/api/report/data`;
  return request(reqUrl, Object.assign({}, gettockenurloptions()), params);
};

// 导出作业报表
const exportHomeWorkReport = (params) => {
  // let param = JsonToUrlParams(params);
  const reqUrl = `${Config.zchlink}/api/report/export`;
  return fetch(reqUrl, {
    method: 'POST',
    headers: {
      accessToken: AppLocalStorage.getOauthToken(),
    },
    body: params,
  });
};

// 获取题库报表
const getQuestionReportData = (parmas) => {
  const reqUrl = `${Config.zmcqLink}/api/report/questionResport`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(parmas) }));
};

// 获取测评课报表
const getTestReportData = (parmas) => {
  const reqUrl = `${Config.zmceLink}/api/examInfo/api/report`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(parmas) }));
};

export default {
  getHomeWorkReportData,
  exportHomeWorkReport,
  getQuestionReportData,
  getTestReportData,
};