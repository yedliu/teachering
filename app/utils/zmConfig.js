import { fromJS } from "immutable";

export const subjectCharacteristicIdList = {
  1: '方程思想',
  2: '函数思想',
  3: '数形结合思想',
  4: '代入法',
  5: "消元法",
}
export const abilityIdList = {
  1: '抽象概括能力',
  2: '推理论证能力',
  3: '运算求解能力',
  4: '空间想象能力'
}
export const coreLiteracyIdList = {
  1: '核心素养1',
  2: '核心素养2',
  3: '核心素养3',
  4: '核心素养4',
  5: '核心素养5',
}
export const difficulty = {
  1: '一级',
  2: '二级',
  3: '三级',
  4: '四级',
  5: '五级',
}
export const distinction = {
  1: '差',
  2: '一般',
  3: '好'
}
export const comprehensiveDegreeId = {
  1: 1,
  2: 2,
  3: 3
}
export const rating = {
  1: '基础题',
  2: '易错题',
  3: '压轴题'
}
export const recommendationIndex = {
  1: '一星',
  2: '二星',
  3: '三星',
  4: '四星',
  5: '五星',
}
export const examType = {
  1: '课标1卷',
  2: '全国1卷',
  3: '全国2卷',
  4: '北京卷',
  5: '上海卷',
  6: '江苏卷',
  7: '预赛',
  8: '复赛',
  9: '决赛',
  10: '全国三卷',
  11: '天津卷',
  12: '海南卷',
  13: '浙江卷',
  24: '优等生课程',
};

// 试卷类型
export const typeList = {
  1: '同步测试',
  2: '单元测试',
  3: '专题试卷',
  4: '月考试卷',
  5: '开学考试',
  6: '期中考试',
  7: '期末考试',
  8: '水平会考',
  9: '竞赛测试',
  10: '高考模拟',
  11: '高考真题',
  12: '自主招生',
  13: '中考模拟',
  14: '中考真题',
  15: '小升初',
  16: '重点自测',
  17: '随堂测试',
}

// 卷型
export const examTypeList = [
  { id: 0, name: '请选择' },
  { id: 1, name: '课标1卷' },
  { id: 2, name: '全国1卷' },
  { id: 3, name: '全国2卷' },
  { id: 4, name: '北京卷' },
  { id: 5, name: '上海卷' },
  { id: 6, name: '江苏卷' },
  { id: 7, name: '预赛' },
  { id: 8, name: '复赛' },
  { id: 9, name: '决赛' },
  { id: 10, name: '全国三卷' },
  { id: 11, name: '天津卷' },
  { id: 12, name: '海南卷' },
  { id: 13, name: '浙江卷' },
  { id: 24, name: '优等生课程' },
];
export const paperCardList = [
  { id: 0, name: '请选择' },
  { id: 1, name: '热点' },
  { id: 2, name: '推荐' },
  { id: 3, name: '名校' },
  { id: 4, name: '小道' },
  { id: 5, name: '掌门' },
];
export const CourseWareErrorType = {
  3:'其他',
  2:'格式错误',
  1:'内容错误'
}
export const formTermList = [{ id: -1, name: '全部' }, { id: 1, name: '上学期' }, { id: 2, name: '下学期' }, { id: 3, name: '暑假' }, { id: 4, name: '寒假' }];
export const difficultyList = [{ id: -1, name: '全部' }, { id: 1, name: '一级' }, { id: 2, name: '二级' }, { id: 3, name: '三级' }, { id: 4, name: '四级' }, { id: 5, name: '五级' }];
export const tagsName = {
  difficulty: ['请选择', '一级', '二级', '三级', '四级', '五级'],
  distinction: ['请选择', '差', '一般', '好'],
  comprehensiveDegreeId: ['请选择', '1', '2', '3'],
  rating: ['请选择', '基础题', '常规题', '压轴题', '易错题', '经典题'],
};
// 适用场景
export const useStageList = [{ id: -1, name: '全部' }, { id: 10, name: '测评考试' }, { id: -10, name: '非测评考试' }];
// 区分度
export const distinctionList = [{ id: -1, name: '全部' }, { id: 1, name: '差' }, { id: 2, name: '一般' }, { id: 3, name: '好' }];
// 综合度
export const comprehensiveDegreeList = [{ id: -1, name: '全部' }, { id: 1, name: '1' }, { id: 2, name: '2' }, { id: 3, name: '3' }];
// 题目评级
export const ratingList = [{ id: -1, name: '全部' }, { id: 1, name: '基础题' }, { id: 2, name: '常规题' }, { id: 3, name: '压轴题' }, { id: 4, name: '易错题' }, { id: 5, name: '经典题' }];

export const questionChildrenType = [{ id: 2, name: '选择题' }, { id: 3, name: '填空题' }, { id: 4, name: '简答题' }];

export const englishAbilities = [
  '语音、语调辨析能力',
  '语音、语调辨析能力',
  '情景交际能力',
  '信息提取能力',
  '细节理解能力',
  '推理判断能力',
  '归纳概括能力',
  '词句猜测能力',
  '理解观点、态度能力',
  '语义转换能力',
  '逻辑分析能力',
  '词语辨析能力',
  '语法结构分析能力',
  '文化背景透析能力',
  '篇章结构理解能力',
  '生活常识综合运用能力',
];

export const mathAbilities = [
  '观察能力',
  '计算能力',
  '理解能力',
  '逻辑推理能力',
  '动手操作能力',
  '表达能力',
  '记忆能力',
  '空间想象能力',
  '数据整理能力',
  '推理论证能力',
  '抽象概括能力',
  '自主探究的能力',
  '转化与化归能力',
  '综合应用能力',
];

export const integratedAbilities = [
  '科学分析能力',
  '理论联系实际能力',
  '计算能力',
  '理解能力',
  '归纳总结能力',
  '记忆能力',
  '逻辑推导能力',
  '有机推断能力',
  '分析和解决实际问题的能力',
  '探究能力',
  '作图与图像处理分析能力',
  '实验能力',
  '推理能力',
  '信息获取能力',
];

export const chineseAbilities = [
  '识记能力',
  '较熟练、规范的写字能力',
  '以感受、理解、积累和初步运用为标志的阅读能力',
  '口语交际能力',
  '写简单的纪实做文章、想象做文章和常见应用文的能力',
  '在综合性学习中表现出来的提出问题、解决问题的能力',
  '语文的综合运用能力',
  '细节理解能力、推理判断能力',
  '归纳概括能力、情景交际能力',
  '鉴赏评价能力、探究能力',
];

export const minorAbilities = [
  '获取和解读信息',
  '调动和运用知识',
  '描述和阐释事物',
  '论证和探讨问题',
];

export const zmSchoolType = [
  {
    value: '4',
    label: '全部'
  },
  {
    value: '1',
    label: '课前预习'
  },
  {
    value: '2',
    label: '同步测试'
  },
  {
    value: '3',
    label: '课外拓展'
  }
]

// 1.请把枚举放在immutableEnum文件里 用immutable方式 防止数据篡改
// 2.请把上面这句话放在文件最后