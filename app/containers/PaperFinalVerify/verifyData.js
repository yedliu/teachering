
import { isArray, isNumber, isString, filterHtmlForm } from 'components/CommonFn';
import { pointToUnity } from 'containers/SetTags/verifyPointRule';

const notNumberThenZero = (num) => !isNumber(num) || num <= 0;
const notStringOrEmpty = (str) => !isString(str) || !str.replace(/\s/g, '');

const hasRealValue = (list) => {
  const optionList = list.map((it) => filterHtmlForm(it));
  let hasRealVal = false;
  if (optionList && optionList.length === 0) {
    return hasRealVal;
  }
  hasRealVal = optionList.every((it) => it);
  return hasRealVal;
};
// eslint-disable-next-line complexity
export const verifyQuestion = (type, data, templateType, pointLists, info) => {
  const res = { passVerify: true, errMsg: {}};
  const errList = [];
  if (type === 'all') {
    //
  } else if (type === 'item') {
    //
  } else if (type === 'changeQuestion') {
    if (notNumberThenZero(data.epId)) errList.push({ type: 'paperId', value: '试卷Id获取失败' });
    if (notNumberThenZero(data.epcId)) errList.push({ type: 'BigQuestionId', value: '大题Id获取失败' });
    const questionInputDTO = data.questionInputDTO;
    const typeId = questionInputDTO.typeId;
    // console.log(questionInputDTO, 'questionInputDTO');
    if (notNumberThenZero(questionInputDTO.typeId)) errList.push({ type: 'typeId', value: '题型未选择' });
    if (templateType !== 1 && notStringOrEmpty(questionInputDTO.title)) errList.push({ type: 'title', value: '题干未填写' });
    if (templateType === 2 && !isArray(questionInputDTO.optionList)) errList.push({ type: 'optionList', value: '题目选项出错' });
    if (pointLists.knowledgeIdList.length > 0 && !isArray(questionInputDTO.knowledgeIdList)) errList.push({ type: 'knowledgeIdList', value: '知识点选择异常' });
    if (pointLists.knowledgeIdList.length > 0 && questionInputDTO.knowledgeIdList.every((item) => !isNumber(item))) errList.push({ type: 'knowledgeIdList', value: '知识点选择不可以为空' });
    if (!pointToUnity(info.subjectId, info.gradeId)) {
      if (pointLists.examPointIdList.length > 0 && !isArray(questionInputDTO.examPointIdList)) errList.push({ type: 'examPointIdList', value: '考点选择异常' });
      if (pointLists.examPointIdList.length > 0 && questionInputDTO.examPointIdList.every((item) => !isNumber(item))) errList.push({ type: 'examPointIdList', value: '考点选择不可以空' });
    }
    if (typeId === 1 && templateType === 2 && questionInputDTO.answerList.length !== 1) {
      errList.push({ type: 'ptionList', value: '单选题有且只有一个答案' });
    }
    if (typeId === 2 && templateType === 2 && questionInputDTO.answerList.length < 2) {
      errList.push({ type: 'ptionList', value: '多选题必须有多个答案' });
    }
    if (templateType !== 1 && (!isArray(questionInputDTO.answerList) || questionInputDTO.answerList.length <= 0)) errList.push({ type: 'answerList', value: '答案可能未填写' });
    if (templateType !== 1 && notStringOrEmpty(questionInputDTO.analysis)) errList.push({ type: 'analysis', value: '解析可能未填写' });
    if (templateType === 2 && isArray(questionInputDTO.optionList) && isArray(questionInputDTO.answerList) && questionInputDTO.optionList.length < questionInputDTO.answerList) errList.push({ type: 'answerListCount', value: '答案数量不可以大于选项数量' });
    if (templateType === 2 && isArray(questionInputDTO.optionList) && questionInputDTO.optionList.some((it) => !filterHtmlForm(it))) errList.push({ type: 'optionsError', value: '选项内容不可以为空' });
    if (notNumberThenZero(questionInputDTO.score)) errList.push({ type: 'score', value: '分数未设置或丢失' });
    if (notNumberThenZero(questionInputDTO.difficulty)) errList.push({ type: 'difficulty', value: '难度未设置或丢失' });
    if (notNumberThenZero(questionInputDTO.distinction)) errList.push({ type: 'distinction', value: '区分度未设置或丢失' });
    if (notNumberThenZero(questionInputDTO.rating)) errList.push({ type: 'rating', value: '题目评级未设置或丢失' });
    if (notNumberThenZero(questionInputDTO.comprehensiveDegreeId)) errList.push({ type: 'comprehensiveDegreeId', value: '综合度未设置或丢失' });
    if (templateType === 1) {
      const children = questionInputDTO.subQuestionInputDTOList;
      // console.log('children', children);
      children.forEach((it, index) => {
        // if (notNumberThenZero(it.id)) errList.push({ type: 'childrenId', value: '子题id获取失败', i: index });
        if (!it.typeId) errList.push({ type: 'typeId', value: '子题题型可能未设置', i: index });
        // if (notNumberThenZero(it.subQuestionId)) errList.push({ type: 'subQuestionId', value: '子题题目id获取失败', i: index });
        if (notNumberThenZero(it.score)) errList.push({ type: 'score', value: '子题分数可能未设置', i: index });
        if (it.typeId === 2) {
          if (!isArray(it.optionList)) {
            errList.push({ type: 'optionList', value: '子题选项出错', i: index });
          } else if (!hasRealValue(it.optionList)) {
            errList.push({ type: 'optionList', value: '请填写完整小题选项', i: index });
          }
        }
        if (!isArray(it.answerList)) errList.push({ type: 'answerList', value: '子题答案出错', i: index });
        if (notStringOrEmpty(it.analysis)) errList.push({ type: 'analysis', value: '子题解析可能未填写', i: index });
        if (!pointToUnity(info.subjectId, info.gradeId)) {
          if (!isArray(it.knowledgeIdList)) errList.push({ type: 'knowledgeIdList', value: '子题知识点异常', i: index });
          if (!isArray(it.examPointIdList)) errList.push({ type: 'examPointIdList', value: '子题考点异常', i: index });
        } else {
          if (pointLists.knowledgeIdList.length > 0 && !isArray(it.knowledgeIdList)) errList.push({ type: 'knowledgeIdList', value: '子题知识点异常', i: index });
          // if (pointLists.examPointIdList.length > 0 && !isArray(it.examPointIdList)) errList.push({ type: 'examPointIdList', value: '子题考点异常', i: index });
        }
      });
    }
  } else if (type === 'paperMsg') {
    if (notStringOrEmpty(data.name)) errList.push({ type: 'paperName', value: '请填写试卷名' });
    if (notNumberThenZero(data.questionAmount)) errList.push({ type: 'questionAmount', value: '请填写题目数量' });
    if (notNumberThenZero(data.year)) errList.push({ type: 'year', value: '请选择试卷年份' });
    if (notNumberThenZero(data.subjectId)) errList.push({ type: 'subjectId', value: '请选择学科' });
    if (notNumberThenZero(data.gradeId)) errList.push({ type: 'gradeId', value: '请选择年级' });
    if (notNumberThenZero(data.termId)) errList.push({ type: 'termId', value: '请选择学期' });
    if (notNumberThenZero(data.provinceId)) errList.push({ type: 'provinceId', value: '请选择省' });
    if (notNumberThenZero(data.businessCardId)) errList.push({ type: 'businessCardId', value: '请选择名片' });
  }
  if (errList.length > 0) {
    res.passVerify = false;
    res.errMsg = errList[0];
  }
  return res;
};
