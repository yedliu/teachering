import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const getReportData = (params) => {
  const requestURL = `${Config.zmtrlink}/api/testLessonRecommendedContentEndpoint/findByGradeAndSubject`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};


/**
 * PC 上传和重新上传图片后保存OSS返回的信息到后台
 */
const uploadImgForPC = (params) => {
  const requestURL = `${Config.zuulTr}/api/testLessonRecommendedContentEndpoint/savePcPic`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

/**
 * h5 上传和重新上传图片后保存OSS返回的信息到后台
 */
const uploadImgForH5 = (params) => {
  const requestURL = `${Config.zuulTr}/api/testLessonRecommendedContentEndpoint/saveH5Pic`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};


export default {
  getReportData,
  uploadImgForPC,
  uploadImgForH5,
};