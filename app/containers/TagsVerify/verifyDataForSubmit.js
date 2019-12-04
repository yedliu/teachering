import { pointToUnity } from 'containers/SetTags/verifyPointRule';
export const verifyDataForSubmit = (questionsList, commonInfo, limitCount, knowledgeIdList, examPointIdList) => {
  const errList = [];
  questionsList.toJS().forEach((item, index) => {
    const itemTags = item.questionOutputDTO.questionTag;
    const noLimit = item.questionOutputDTO.templateType === 1;
    if (itemTags.difficulty <= 0) errList.push({ type: 'select', value: '难度未选择', index });
    if (itemTags.distinction <= 0) errList.push({ type: 'select', value: '区分度未选择', index });
    if (itemTags.comprehensiveDegreeId <= 0) errList.push({ type: 'select', value: '综合度未选择', index });
    if (itemTags.rating <= 0) errList.push({ type: 'select', value: '题目评级未选择', index });
    if (itemTags.questionId <= 0) errList.push({ type: 'questionId', value: '题目id获取失败', index });
    if (itemTags.tagAdopt <= 0) errList.push({ type: 'tagAdopt', value: '未选择满足需求的标签人员', index });
    if (!itemTags.tagReason.replace(/\s|\n/g, '') && itemTags.tagAdopt !== 3) errList.push({ type: 'input', value: '不满足需求的原因未填写', index });
    if (itemTags.knowledgeIdList.length <= 0) errList.push({ type: 'treeCheck', value: '知识点未选则', index });
    if (!noLimit && (itemTags.knowledgeIdList.length > limitCount)) errList.push({ type: 'treeCheck', value: `知识点不可以超过 ${limitCount} 个`, index });
    itemTags.children.forEach((it, i) => {
      if (it.knowledgeIdList.length > limitCount) errList.push({ type: 'treeCheck', value: `知识点不可以超过 ${limitCount} 个`, index, i: i + 1 });
    });
    if (!pointToUnity(commonInfo.get('subjectId'), commonInfo.get('gradeId'))) {
      if (itemTags.examPointIdList.length <= 0) errList.push({ type: 'treeCheck', value: '考点未选择', index });
      if (!noLimit && (itemTags.examPointIdList.length > limitCount)) errList.push({ type: 'treeCheck', value: `考点不可以超过 ${limitCount} 个`, index });
      itemTags.children.forEach((it, i) => {
        if (it.examPointIdList.length > limitCount) errList.push({ type: 'treeCheck', value: `考点不可以超过 ${limitCount} 个`, index, i: i + 1 });
      });
    } else {
      if (knowledgeIdList.count() > 0 && (itemTags.knowledgeIdList.length <= 0 || (!noLimit && itemTags.knowledgeIdList.length > limitCount))) {
        errList.push({ type: 'knowledgeIdList', value: '请检查知识点勾选数量，必须为1-3个', index });
      }
      if (!noLimit && (itemTags.examPointIdList.length > limitCount)) errList.push({ type: 'treeCheck', value: `考点不可以超过 ${limitCount} 个`, index });
      itemTags.children.forEach((it, i) => {
        if (!it.examPointIdList || !(it.examPointIdList.length > 0)) {
          return;
        }
        if (it.examPointIdList.length > limitCount) errList.push({ type: 'treeCheck', value: `考点不可以超过 ${limitCount} 个`, index, i: i + 1 });
      });
    }
  });
  return errList;
};
