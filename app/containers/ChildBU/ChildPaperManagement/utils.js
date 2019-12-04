export const getQuestionDataByList = questionList => {
  const newData = {};
  questionList.forEach(el => {
    if (newData[el.typeId]) {
      newData[el.typeId].examPaperContentQuestionList.push({
        id: el.id,
        questionId: el.id,
        score: el.score,
        questionOutputDto: el,
      });
    } else {
      newData[el.typeId] = {
        name: el.questionType,
        typeId: el.typeId,
        examPaperContentQuestionList: [
          { questionId: el.id, score: el.score, questionOutputDto: el },
        ],
      };
    }
  });
  console.log(newData, 'util ------');
  return Object.keys(newData)
    .sort((pre, next) => next.typeId - pre.typeId)
    .map((key, index) => {
      newData[key].serialNumber = index + 1;
      return newData[key];
    });
};

/**
 * 算分数
 * @param bigList 大题列表
 * @returns {{score: string}}
 */
export const countScore = (bigList = []) => {
  let num = 0;
  let score = 0;
  bigList.forEach(item => {
    let smallList = item.examPaperContentQuestionList;
    if (smallList && smallList.length > 0) {
      smallList.forEach(item1 => {
        score += item1.score;
        num += 1;
      });
    }
  });
  return {
    score: score.toFixed(1),
    num,
  };
};

export const getRules = () => {
  return {
    courseSystemId: { required: true },
    difficulty: { required: true },
    gradeDictCode: { required: true },
    examPaperContentOutpuDtoList: { required: true, min: 1 },
    name: { required: true, max: 50 },
    onlineFlag: { required: true },
    subjectDictCode: { required: true },
    typeId: { required: true },
    year: { required: true },
  };
};

export const verifyPaperData = data => {
  const rules = getRules();
  const message = {};
  Object.entries(rules).forEach(el => {
    const [key, rule] = el;
    const value = data[key];
    if (rule.required && !value) {
      message[key] = '必填项不能为空';
    } else if (rule.min && value.length < rule.min) {
      message[key] = `长度不能小于${rule.min}`;
    } else if (rule.max && value.length > rule.max) {
      message[key] = `长度不能大于${rule.max}`;
    }
  });
  return message;
};
