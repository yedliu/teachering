import Config from 'utils/config';
import request, { postjsonoptions } from 'utils/request';

const requestTimeOut = 10 * 1000;

// 切割试卷审核
export const preAuditCut = ({ id, challenge, validate, seccode }) => {
  const reqUrl = `${Config.trlink_qb}/api/examPaper/${id}/action/preAuditCutByGeetest`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsonoptions(), {
    body: JSON.stringify({ challenge, validate, seccode })
  }));
};
