import Config from 'utils/config';
import request, { postjsonoptions } from 'utils/request';

const requestTimeOut = 10 * 1000;

// 录入试卷领取
export const receiveTagByGeetest = ({ id, challenge, validate, seccode }) => {
  const reqUrl = `${Config.trlink_qb}/api/examPaper/${id}/action/receiveTagByGeetest`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsonoptions(), {
    body: JSON.stringify({ challenge, validate, seccode })
  }));
};

