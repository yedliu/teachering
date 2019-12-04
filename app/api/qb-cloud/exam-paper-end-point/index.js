import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const assembleExamPaper = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/assembleExamPaper`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findAssembleExamPaper = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/findAssembleExamPaper`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const findExamPaper = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/findAll`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 试卷下架
const paperOffline = async (examPaperId) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/offline`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), { examPaperId });
};

// 试卷上架
const paperOnline = async (examPaperId) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/online`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), { examPaperId });
};

// 保存试卷信息
const paperInfoSave = async (params) => {
  if (!(params.source > 0)) {
    return new Promise((resolve, reject) => {
      resolve({
        code: 1,
        data: null,
        message: '请填写试卷来源',
      });
    });
  }
  const reqUrl = `${Config.zmcqLink}/api/examPaper/save`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 试卷修改
const paperInfoModify = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/modify`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 试卷删除
const paperDelete = async (paperId) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/delete`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), { id: paperId });
};

// 获取单份试卷
const getOnePaper = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/getOne`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 录题部分获取一份试卷
const getOnePaperForCut = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/getOneForCut`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 获取所有未完成的组卷
const getEditPaper = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/findExamPaperContentOutputDTOList`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 平行组卷
const getParallelPaper = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/recommendQuestionByExamPaper?examPaperId=${params.examPaperId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

// 智能换题
const getAiReplaceQuestion = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/recommendQuestionByOld?questionId=${params.questionId}&num=${params.num}&exceptIdList=${params.exceptIdList}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

// 批量试卷下架
const paperBatchOffline = async (epIdList = []) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/offlineBatch`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), {  epIdList });
};

// 批量试卷上架
const paperBatchOnline = async (epIdList = []) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/onlineBatch`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), {  epIdList });
};
// 上传文件
const fileUpload = async (from) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/fileUpload`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: from }));
};

const findOperatorsByEpId = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/findOperatorsByEpId`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const forcedRelease = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/forcedRelease`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const convertToPic = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/convertToPic`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteEpContent = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/deleteEpContent`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const deleteQuestion = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/deleteQuestion`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateQuestion = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/updateQuestion`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const updateEpContent = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/updateEpContent`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const adoptFeedback = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/adoptFeedback`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 课程下面挂的试卷数量
const getExamPaperNumByCourseContent = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/getExamPaperNumByCourseContent`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 教材下面挂的试卷数量
const getExamPaperNumByTextbook = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/getExamPaperNumByTextbook`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

// 查询待贴标签的试卷数量
const findWait4TagCount = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/findWait4TagCount`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};


const addQuestionCountByExamPaper = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/addQuestionCountByExamPaper`;
  return request(
    reqUrl,
    Object.assign({}, postjsontokenoptions()),
    params
  );
};

// 平行组卷查询试卷大题中的题目id
const  queryParallelQuestionIds = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/action/findExamPaperContentQuestionIdList?epId=${params.examPaperId}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};
// 平行组卷为旧题推荐新题
const  queryParallelQuestionsByIds = async (params) => {
  const reqUrl = `${Config.zmcqLink}/api/examPaper/recommendQuestionByOldQuestionIdList`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const  flushQuestionInfoByExamPaper = async (examPaperId) => {
  if (!examPaperId) {
    return;
  }
  const reqUrl = `${Config.zmcqLink}/api/examPaper/flushQuestionInfoByExamPaper`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()), { examPaperId });
};

export default {
  findAssembleExamPaper,
  findExamPaper,
  paperOffline,
  paperOnline,
  assembleExamPaper,
  paperInfoSave,
  paperInfoModify,
  paperDelete,
  getOnePaper,
  getEditPaper,
  getParallelPaper,
  getAiReplaceQuestion,
  paperBatchOffline,
  paperBatchOnline,
  fileUpload,
  findOperatorsByEpId,
  forcedRelease,
  convertToPic,
  deleteEpContent,
  deleteQuestion,
  updateQuestion,
  updateEpContent,
  adoptFeedback,
  getExamPaperNumByCourseContent,
  getExamPaperNumByTextbook,
  findWait4TagCount,
  getOnePaperForCut,
  addQuestionCountByExamPaper,
  queryParallelQuestionIds,
  queryParallelQuestionsByIds,
  flushQuestionInfoByExamPaper,
};
