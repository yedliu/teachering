/**
 * AI阶段测评接口
* 接口 swagger : http : //10.81.173.206:8080/swagger-ui.html#!/exam-info-dict-endpoint/getNodesByGroup
 */
import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

// 获取考试信息枚举
export const getPaperNode = ({ params = '' }) => {
  const reqUrl = `${Config.zmceLink}/api/examInfo/dict/getNodesByGroup`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {
    body: JSON.stringify(params)
  })).then((res) => {
    const { data } = res;
    return data;
  });
};
// 批量获取考试信息枚举
export const getPaperNodes = ({ params = {}}) => {
  const reqUrl = `${Config.zmceLink}/api/examInfo/dict/getNodesByGroups`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {
    body: JSON.stringify(params)
  })).then((res) => {
    const { data } = res;
    return data;
  });
};

