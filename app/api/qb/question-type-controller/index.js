import request, { geturloptions } from 'utils/request';
import Config from 'utils/config';

const getQuestionType = () => {
  const reqUrl = `${Config.trlink_qb}/api/questionType`;
  return request(reqUrl, Object.assign({}, geturloptions()), {});
};

export default {
  getQuestionType
};