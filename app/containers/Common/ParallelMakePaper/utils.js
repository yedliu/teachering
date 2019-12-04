// 根据type找数据
import { AppLocalStorage } from '../../../utils/localStorage';
import { browserHistory } from 'react-router';
// 环境判断
const isParttime = process.env.ENV_TARGET === 'parttime';

// 本地字段对应的接口字段
export const dict = {
  epName: 'name',
  paperTypeId: 'typeId',
  epId: 'id',
  subjectId: 'subjectId',
  gradeId: 'gradeId',
  typeId: 'typeId',
  difficulty: 'difficulty',
  year: 'year',
  termId: 'termId',
  provinceId: 'provinceId',
  cityId: 'cityId',
  countyId: 'countyId',
  examTypeId: 'examTypeId',
  businessCardId: 'businessCardId',
  purpose: 'purpose',
  evaluationTarget: 'evaluationTarget',
  evaluationPurpose: 'evaluationPurpose',
  epBu: 'epBu',
  onlineFlag: 'onlineFlag',
  rateList: 'rateList',
  totalScore: 'totalScore',
  minScore: 'minScore',
  source: 'source',
};
// 从formData里查指定类型的数据
export const findType = (type, list) => {
  let target = {};
  let arr = list.filter(item => item.type === type);
  if (arr.length === 1) {
    target = arr[0];
  }
  return target;
};
// 处理默认的试卷信息
export const handleDefaultPaperInfo = (paperData, allFormData) => {
  let target = allFormData;
  allFormData.forEach((item, index) => {
    let key = item.type;
    if (item.type === 'epName') {
      key = 'name';
    }
    if (item.type === 'paperTypeId') {
      key = 'typeId';
    }
    // 如果值是数字就检验是否大于 0
    const value = paperData[key];
    const isValue = (typeof value === 'number')
      ? (value >= 0 ? true : false)
      : !!value;
    // let isValue = paperData[key]
    //   ? true
    //   : key === 'provinceId' && paperData[key] === 0
    //   ? true
    //   : false;
    if (isValue) {
      allFormData[index].value = String(paperData[key]);
    }
  });
  return target;
};
// 跳转题目管理
export const toQuestionManage = (values, teachingVersion, courseSystem, currentFormData, item, selectPaperId) => {
  localStorage.removeItem('paperData');
  let data = currentFormData.map(item => {
    let obj = {
      type: item.type,
      name: item.name,
      value: values[item.type],
    };
    return obj;
  });
  data.push({ type: 'versionValue', value: teachingVersion.versionValue });
  data.push({ type: 'systemValue', value: courseSystem.systemValue });
  data.push({ type: 'editionId', value: courseSystem.selectedId });
  data.push({ type: 'editionName', value: courseSystem.editionName });
  data.push({ type: 'teachingEditionId', value: teachingVersion.selectedId });
  data.push({ type: 'showSystemList', value: courseSystem.showSystemList });
  data.push({
    type: 'teachingEditionName',
    value: teachingVersion.teachingEditionName,
  });
  // 赋值questionOutputDTO
  if (item.examPaperContentOutputDTOList) {
    item.examPaperContentOutputDTOList.forEach(it => {
      if (it.examPaperContentQuestionOutputDTOList) {
        let list = [];
        it.examPaperContentQuestionOutputDTOList.forEach((it1, index1) => {
          if (it1.recommendNewQuestionOutputDTO) {
            it1.recommendNewQuestionOutputDTO.originQuestionData = it1.questionOutputDTO; // 加入原始题目
            it1.questionOutputDTO = it1.recommendNewQuestionOutputDTO; // 推荐的题目
            delete it1.recommendNewQuestionOutputDTO;
            list.push(it1);
          }
        });
        it.examPaperContentQuestionOutputDTOList = list;
      }
    });
  }
  // 课程
  if (courseSystem && courseSystem.systemValue) {
    item.examPaperCourseContent = {
      courseContentId: String(courseSystem.systemValue.value),
      courseContentName: courseSystem.systemValue.label,
      editionId: courseSystem.selectedId,
      editionName: courseSystem.editionName,
    };
  }

  // 教材
  if (teachingVersion && teachingVersion.versionValue) {
    item.examPaperTextbook = {
      textbookName: teachingVersion.versionValue.label,
      textbookId: String(teachingVersion.versionValue.value),
      teachingEditionId: teachingVersion.selectedId,
      teachingEditionName: teachingVersion.teachingEditionName,
    };
  }

  // 把新改的试卷基本信息塞进item
  let itemKeys = Object.keys(item);
  data.forEach(it => {
    let targetKey = dict[it.type];
    if (itemKeys.includes(targetKey)) {
      item[targetKey] = it.value;
    }
  });
  AppLocalStorage.setPaperData({
    editMode: 'edit',
    paperContent: item,
    isPublish: false,
    selectPaperId,
    backRoutePath: window.location.pathname
  });
  const isAddPaper = /^\/tr\/addPaper/.test(window.location.pathname);

  // 上传试卷跳转到 questionforlocal, 其他的跳转到 questionfor1v1
  // const from = isAddPaper ? 'parallelForLocal' : 'parallelFor1v1';
  let from = 'parallelFor1v1';
  if (isAddPaper) {
    from = 'parallelForLocal';
  } else if (isParttime) {
    from = 'parttime';
  }
  browserHistory.push({
    pathname: isParttime ? '/parttime/transferPage' : '/tr/transferPage',
    query: {
      from,
    },
  });
  // window.location.reload();
};

// 判断是否成功选题
export const isSuccessPickQuestions = res => {
  let originNum = res.questionAmount;
  let missNum = res.unRecommondQuestionNum;
  let result = [originNum, missNum];
  if (missNum === originNum || originNum === 0) {
    result.push('fail');
  } else if (missNum < originNum && missNum > 0) {
    result.push('part');
  } else if (missNum === 0 && originNum > 0) {
    result.push('success');
  } else {
    message.warning('未知错误');
  }
  return result;
};

