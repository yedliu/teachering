/**
 * 题型和模板对应关系文件 一个题型对应多个模板
 */
import { chooseTypeList, vacancyTypeList, simpleTypeList,
  complexTypeList, classifyList, matchList,
  fillTypeList, subjectivityChooseList, interactiveJudgeList, interactiveOrderList, listenList,
  toString, toNumber,
} from 'components/CommonFn';
import queryNodeApi from 'api/qb-cloud/sys-dict-end-point';
import { fromJS } from 'immutable';

// 根据id获取模板列表
export const getTemplatesByTypeId = (typeId) => {
  const list = [];
  if (!typeId) return;
  const templateIds = typeTemplateMapper[String(typeId)] ? typeTemplateMapper[String(typeId)]['templateIds'] : [];
  if (templateIds.length === 0) {
    console.error('模板列表为空');
  } else {
    // eslint-disable-next-line array-callback-return
    templateTypes.map(temp => {
      if (templateIds.indexOf(temp.id) > -1) {
        list.push(temp);
      }
    });
  }
  return list;
};

export const templateTypes = [
  { id: 1, name: '复合题' },
  { id: 2, name: '选择题' },
  { id: 3, name: '填空题' },
  { id: 4, name: '简答题' },
  { id: 5, name: '分类题' },
  { id: 6, name: '配对题' },
  { id: 7, name: '选词填空' },
  { id: 8, name: '主观选择题' },
  { id: 9, name: '互动判断题' },
  { id: 10, name: '互动排序题' },
];

// 对应关系目前在前端管理 如果需要新增题型 需要在此增加枚举
const typeTemplateMapper = {
  '1': {
    templateIds: [1, 2],
    name: '单选题'
  },
  '2': {
    templateIds: [1, 2],
    name: '多选题'
  },
  '3': {
    templateIds: [1, 3],
    name: '填空题'
  },
  '4': {
    templateIds: [1, 4],
    name: '解答题'
  },
  '5': {
    templateIds: [1, 4],
    name: '翻译题'
  },
  '6': {
    // templateIds: [1, 2], 暂时先不让组复合题
    templateIds: [2, 3],
    name: '判断题'
  },
  '7': {
    templateIds: [6],
    name: '连线题'
  },
  '8': {
    templateIds: [1, 4],
    name: '实验题'
  },
  '9': {
    templateIds: [1, 4],
    name: '实践探究'
  },
  '10': {
    templateIds: [1, 4],
    name: '句子变形'
  },
  '11': {
    templateIds: [1, 4],
    name: '作图题'
  },
  '12': {
    templateIds: [1, 3, 4],
    name: '口算题'
  },
  '13': {
    templateIds: [1, 4],
    name: '计算题'
  },
  '14': {
    templateIds: [1, 4],
    name: '应用题'
  },
  '15': {
    templateIds: [1],
    name: '完形填空'
  },
  '16': {
    templateIds: [1, 3],
    name: '阅读理解'
  },
  '17': {
    templateIds: [1, 3, 4],
    name: '句型转换'
  },
  '18': {
    templateIds: [4],
    name: '书面表达'
  },
  '19': {
    templateIds: [3, 7],
    name: '七选五'
  },
  '20': {
    templateIds: [1, 3],
    name: '任务型阅读'
  },
  '21': {
    templateIds: [1, 3, 4],
    name: '短文改错'
  },
  '22': {
    templateIds: [1, 4],
    name: '句子改错'
  },
  '23': {
    templateIds: [1, 2, 4],
    name: '听力'
  },
  '24': {
    templateIds: [1, 4],
    name: '问答题'
  },
  '25': {
    templateIds: [1, 4],
    name: '材料题'
  },
  '26': {
    templateIds: [1, 3],
    name: '填表题'
  },
  '27': {
    templateIds: [1, 4],
    name: '简答题'
  },
  '28': {
    templateIds: [4],
    name: '排序题'
  },
  '32': {
    templateIds: [1, 3],
    name: '语法填空'
  },
  '33': {
    templateIds: [1, 3],
    name: '读后续写'
  },
  '34': {
    templateIds: [4],
    name: '概要写作'
  },
  '35': {
    templateIds: [3, 7],
    name: '选词填空'
  },
  '36': {
    templateIds: [5],
    name: '分类题'
  },
  '37': {
    templateIds: [6],
    name: '配对题'
  },
  '38': {
    templateIds: [1, 2],
    name: '选择题'
  },
  '39': {
    templateIds: [1, 3],
    name: '填空题'
  },
  '40': {
    templateIds: [1, 4],
    name: '解答题'
  },
  '41': {
    templateIds: [1, 2],
    name: '判断匹配题'
  },
  '42': {
    templateIds: [1, 4],
    name: '操作题'
  },
  '43': {
    templateIds: [1, 4],
    name: '计算题'
  },
  '44': {
    templateIds: [1],
    name: '阅读题'
  },
  '45': {
    templateIds: [1, 4],
    name: '变形改错题'
  },
  '46': {
    templateIds: [4],
    name: '写作题'
  },
  '47': {
    templateIds: [8],
    name: '主观选择题'
  },
  '48': {
    templateIds: [2],
    name: '双选题'
  },
  '49': {
    templateIds: [2],
    name: '不定项选择题'
  },
  '50': {
    templateIds: [2, 1],
    name: '听力题'
  }
};

// 获取默认模板
export const getDefaultTemplate = (type) => {
  if (!type) return;
  let typeId = Number(type);
  let template = '';
  if (chooseTypeList.includes(typeId)) {
    // 选择题
    template = 2;
  } else if (vacancyTypeList.includes(typeId)) {
    // 填空题
    template = 3;
  } else if (simpleTypeList.includes(typeId)) {
    // 简答题
    template = 4;
  } else if (complexTypeList.includes(typeId)) {
    // 复合题
    template = 1;
  } else if (classifyList.includes(typeId)) {
    // 分类题
    template = 5;
  } else if (matchList.includes(typeId)) {
    // 配对题
    template = 6;
  } else if (fillTypeList.includes(typeId)) {
    // 选词填空
    template = 7;
  } else if (subjectivityChooseList.includes(typeId)) {
    // 主观选择题
    template = 8;
  } else if (interactiveJudgeList.includes(typeId)) {
    // 互动判断题
    template = 9;
  } else if (interactiveOrderList.includes(typeId)) {
    // 互动排序题
    template = 10;
  } else if (listenList.includes(typeId)) {
    // 听力题
    template = 2;
  } else {
    template = typeTemplateMapper[typeId] ? typeTemplateMapper[typeId].templateIds[0] : '';
    if (!template) {
      console.error('不能找到对应模板typeId:', typeId);
    }
  }
  return template;
};



export const changeTypeTemplateMapper = () => {
  queryNodeApi.queryQuestionTypeToTemplateList().then((res) => {
    if (toString(res.code) === '0') {
      const data = res.data || [];
      // console.log('typeToTemplate: ', data);
      data.forEach((item, i) => {
        typeTemplateMapper[item.code] = {
          templateIds: item.dataList.map((it) => toNumber(it.itemCode)),
          name: item.name,
        };
      });
    }
  });
};


/**
 * 过滤调互动题型、听力题型、主管选择题
 */
const filterTypeIdList = [35, 36, 37, 47, 50, 51, 52];
export const filterCartoon = (list = fromJS([])) => {
  return list.filter((item) => !filterTypeIdList.includes(item.get('id')));
};

const filterTypeIdListForGroupPaper = [50, 51, 52];
export const filterCartoonForGroupPaper = (list = fromJS([])) => {
  return list.filter((item) => !filterTypeIdListForGroupPaper.includes(item.id));
};
