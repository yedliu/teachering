import request, { postjsontokenoptions, JsonToUrlParams } from 'utils/request';
import { AppLocalStorage } from 'utils/localStorage';
import Config from 'utils/config';

const getQuestionResportList = params => {
  const reqUrl = `${Config.zmcqLink}/api/report/questionResportList`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) })
  );
};

const getCorrectionResport = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/report/queryCorrectionResport`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const downCorrectionResportFile = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/report/downCorrectionResportFile${JsonToUrlParams(params)}`;
  return fetch(reqUrl, {
    method: 'GET',
    headers: {
      accessToken: AppLocalStorage.getOauthToken(),
    }
  }).then((res) => {
    let contentType;
    if (res.headers) {
      contentType = res.headers.get('content-type');
    }
    if (typeof contentType === 'string' && contentType.includes('excel')) {
      return res.blob();
    }
    return res.json();
  }).catch((error) => {
    console.log('下载失败: ', error);
  });
};

export default {
  getQuestionResportList,
  getCorrectionResport,
  downCorrectionResportFile,
};
