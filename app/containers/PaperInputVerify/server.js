import Config from 'utils/config';
import request, { postjsonoptions } from 'utils/request';

const requestTimeOut = 10 * 1000;

// 录入试卷准备审核
export const preAuditEntryByGeetest = ({ id, challenge, validate, seccode }) => {
  const reqUrl = `${Config.trlink_qb}/api/examPaper/${id}/action/preAuditEntryByGeetest`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsonoptions(), {
    body: JSON.stringify({ challenge, validate, seccode })
  }));
};
