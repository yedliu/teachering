import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';
// 删除
const deletePaper = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/tsExamPaper/delete?id=${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
// 详情
const getPaperDetail = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/tsExamPaper/findExamPaperDetail?id=${params.id}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
// 下架
const offPaper = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/tsExamPaper/offline?examPaperId=${params.examPaperId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
// 上架
const onPaper = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/tsExamPaper/online?examPaperId=${params.examPaperId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
// 列表
const getPaperList = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/tsExamPaper/queryExamPaper`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 新增
const addPaper = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/tsExamPaper/saveExamPaper`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
// 编辑
const editPaper = (params = {}) => {
  const reqUrl = `${Config.zmcqLink}/api/tsExamPaper/updateExamPaper`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};
export default {
  deletePaper,
  getPaperDetail,
  offPaper,
  onPaper,
  getPaperList,
  addPaper,
  editPaper
};
