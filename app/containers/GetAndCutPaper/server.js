import Config from 'utils/config';
import request, { postjsonoptions, geturloptions } from 'utils/request';

const requestTimeOut = 10 * 1000;

// 领取切割试卷
export const receiveCut = ({ id, challenge, validate, seccode }) => {
  const reqUrl = `${Config.trlink_qb}/api/examPaper/${id}/action/receiveCutByGeetest`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, postjsonoptions(), {
    body: JSON.stringify({ challenge, validate, seccode })
  }));
};

// 获取验证码配置
export const getVerifyConfig = () => {
  const reqUrl = `${Config.trlink_qb}/api/geetest`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()));
};
