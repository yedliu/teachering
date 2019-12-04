import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const querySubjectByExamPaperType = (paperTypeId) => {
  const reqUrl = `${Config.zmcqLink}/api/subject/querySubjectByExamPaperType?examPaperType=${paperTypeId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {}));
};

const getSubjectByExamPaperType = params => {
  const reqUrl = `${Config.zmcqLink}/api/subject/querySubjectByExamPaperType?examPaperType=${params.examPaperType}`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions())
  );
};

export default {
  getSubjectByExamPaperType,
  querySubjectByExamPaperType
};
