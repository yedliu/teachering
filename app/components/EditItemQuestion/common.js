import {
  filterHtmlForm, randomWithNum,
} from 'components/CommonFn';
import { fromJS, List } from 'immutable';
import questionUtil from 'api/qb-cloud/question-endpoint/util';
const emptyList = fromJS([]);
const emptyMap = fromJS({});

const hasRealValue = (list) => {
  const optionList = list.map((it) => filterHtmlForm(it));
  let hasRealVal = false;
  if (optionList && optionList.length === 0) {
    return hasRealVal;
  }
  hasRealVal = optionList.every((it) => it);
  return hasRealVal;
};

// 配对分类题校对
export const validateClassifyAndMatch = (newQuestion) => {
  const typeId = newQuestion.get('typeId');
  const templateType = newQuestion.get('templateType');
  const isClassify = String(templateType) === '5';
  const isMatch = String(templateType) === '6';
  // 判断是否少儿BU中的阶段测评卷管理
  // const isChildPaper = /childBU\/child-paper/.test(window.location.pathname);
  const response = {
    errorMsg: '',
    data: {}
  };
  // debugger
  if (!newQuestion.get('title')) {
    response.errorMsg = '请填写题干';
    return response;
  }
  // if (isChildPaper || newQuestion.get('titleAudioFlag')) {
  //   if (!newQuestion.get('titleAudioPath')) {
  //     response.errorMsg = '请将题目转换成音频文件！';
  //     return response;
  //   }
  // }
  let requestQ = fromJS({
    typeId,
    title: newQuestion.get('title'),
    templateType: newQuestion.get('templateType'),
    score: newQuestion.get('score'),
    layoutStyle: newQuestion.get('layoutStyle'),
    children: []
  });
  let randomList = null;
  // 配对题的顺序维度是每个子题
  if (isMatch) {
    randomList = randomWithNum(newQuestion.get('children').count());
  }
  // 检测小题
  let pass = true;
  newQuestion.get('children').every((item, index) => {
    const title = newQuestion.getIn(['children', index, 'title']) || '';
    const score = newQuestion.getIn(['children', index, 'score']) || 1;
    const members = newQuestion.getIn(['children', index, 'members']) || newQuestion.getIn(['children', index, 'subQuestionMemberList']);
    if (isMatch && members.count() < 2) {
      response.errorMsg = '配对题每项必须是两个元素';
      pass = false;
      return false;
    }
    // 分类题的顺序维度是每个members
    if (isClassify) {
      if (!title) {
        response.errorMsg = '请添加分类卡标题';
      }
      if (members.count() < 1) {
        response.errorMsg = '分类题每项不能为空';
      }
      if (response.errorMsg) {
        pass = false;
        return false;
      }
      randomList = randomWithNum(members.count());
    }
    let saveMembers = emptyList;
    members.every((it, i) => {
      const type = it.get('type');
      const content = it.get('content');
      let order = '';
      if (!content) {
        response.errorMsg = '有内容未填写';
        pass = false;
        return false;
      }
      if (isClassify) {
        order = randomList[i];
      } else if (isMatch) {
        // 配对题第一项顺序不变，第二项乱序
        if (i === 0) {
          order = index;
        } else {
          order = randomList[index];
        }
      }
      saveMembers = saveMembers.push(fromJS({
        type,
        content,
        showOrder: order,
      }));
      return pass;
    });
    requestQ = requestQ.setIn(['children', index, 'title'], title)
      .setIn(['children', index, 'score'], score)
      .setIn(['children', index, 'typeId'], typeId)
      .setIn(['children', index, 'subQuestionItemInputDTOList'], saveMembers);
    return pass;
  });
  if (!pass) {
    return response;
  }
  response.data = newQuestion.merge(requestQ);
  return response;
};
// eslint-disable-next-line complexity
export const validateSavedQuestion = (question) => {
  // debugger;
  console.log('question', question.toJS());
  const typeId = question.get('typeId');
  const templateType = String(question.get('templateType'));
  const isZhuGuanChoose = Number(typeId) === 47;
  const isListen = [50].includes(Number(typeId));
  const isJudge = [52].includes(Number(typeId));
  // 判断是否少儿BU中的阶段测评卷管理
  const isChildPaper = /childBU\/child-paper/.test(window.location.pathname);

  if (!question.get('title')) {
    return '请填写题目！';
  }
  if (isListen || isJudge) {
    if (question.get('stemElementList') && !hasRealValue(question.get('stemElementList'))) {
      return '请完善听力文本信息！';
    }
    if (!question.getIn(['stemElementList', 0, 'stemElementContent'])) {
      console.log('stemElementList', question.getIn(['stemElementList', 0, 'stemElementContent']));
      return '请上传听力音频文件！';
    }
    if (!question.getIn(['stemElementList', 1, 'stemElementContent'])) {
      console.log('stemElementList', question.getIn(['stemElementList', 1, 'stemElementContent']));
      return '请填写听力文本材料！';
    }
    // 非复合听力题
    if (templateType !== '1') {
      if (!question.get('analysis')) {
        return '请填写解析';
      }
      if (!question.get('analysis')) {
        return '请填写解析';
      }
    }
  }
  if (templateType === '1' || isJudge) {
    // 检测小题必须
    let msg = '';
    question.get('children').forEach(item => {
      if (!hasRealValue(item.get('answerList').toJS())) {
        msg = '请填写小题答案';
      }
      if (
        isJudge
        && (!item ||
          (item && List.isList(item.get('stemElementList')) && !item.get('stemElementList').every((value) => value && value.get('stemElementContent')))
        )) {
        msg = '请填写完整小题选项';
      }
      const childTypeId = String(item.get('typeId'));
      if (childTypeId === '2') {
        if (!isJudge && !isListen && !hasRealValue(item.get('optionList').toJS())) {
          msg = '请填写完整小题选项';
        }
        if (isListen && !hasRealValue(item.get('optionElementList').toJS())) {
          msg = '请填写完整小题选项';
        }
        if (
          isListen
          && (!item ||
            (item && List.isList(item.get('optionElementList')) && !item.get('optionElementList').every((value) => value && value.get('optionElementContent')))
          )) {
          msg = '请填写选项';
        }
      }
      if (!item.get('analysis') && !isJudge) {
        msg = '请填写小题解析';
      }
      if (isJudge && question.get('stemElementList') && !hasRealValue(question.get('stemElementList'))) {
        msg = '请填写选项';
      }
    });
    return msg;
  } else if (templateType === '8') {
    if (question.get('optionList') && !hasRealValue(question.get('optionList').toJS())) {
      return '请填写选项';
    }
  } else if (templateType === '10') {
    const optionElementList = question.get('optionElementList');
    const isFullOptions = optionElementList.every(option => option.get('optionElementContent'));
    if (!isFullOptions) {
      return '请填写完整每个选项';
    }
    if (!question.get('analysis')) {
      return '请填写解析';
    }
  } else {
    if (!typeId) {
      return '请选择小题题型';
    }
    if (question.get('answerList') && !hasRealValue(question.get('answerList').toJS()) && !isZhuGuanChoose) {
      return '请完善答案';
    }
    if ([1, 50].includes(Number(typeId)) && question.get('answerList').count() !== 1) {
      return '单选题有且只有一个答案';
    }
    if (String(typeId) === '2' && question.get('answerList').count() < 2) {
      return '多选题必须有多个答案';
    }
    // 选词填空
    if (templateType === '7') {
      if (!question.get('content')) {
        return '请填写填空内容';
      }
      if (!question.get('optionList') || !hasRealValue(question.get('optionList').toJS())) {
        return '请填写选项';
      }
    } else if (['3', '4'].includes(templateType)) {
      if (!question.get('analysis') && !isZhuGuanChoose) {
        return '请填写解析';
      }
    } else {
      // debugger
      if (!isListen && question.get('optionList') && !hasRealValue(question.get('optionList').toJS())) {
        return '请填写选项';
      }

      if (
        isListen
        // && question.get('optionElementList')
        && List.isList(question.get('optionElementList'))
        && !question.get('optionElementList').every((value) => value && value.get('optionElementContent'))
      ) {
        return '请填写选项';
      }
      if (!question.get('analysis') && !isZhuGuanChoose) {
        return '请填写解析';
      }
    }
  }

  const questionContent = question.get('questionContent') || emptyMap;
  if (isChildPaper || questionContent.get('questionTitleAudioFlag')) {
    const questionOptionList = question.get('questionOptionList') || emptyList;
    const hasNoTitleAudio = !questionContent.get('questionTitleAudioPath') && !questionContent.get('questionTitleUploadAudioPath');
    const hasNoOptionListAudio = questionOptionList.every((item) => ((!item.get('audioPath') && !item.get('uploadAudioPath'))));
    console.log('hasNoTitleAudio - hasNoOptionListAudio', hasNoTitleAudio, hasNoOptionListAudio);
    if (hasNoTitleAudio && hasNoOptionListAudio) {
      return '题目未设置音频';
    }
  }
};


export const validateChooseForCollegeExam = (question) => {
  if (!question.get('title')) {
    return '请填写题目';
  }
  if (Number(question.get('templateType')) !== 2) {
    return '请选择选择题模版';
  }
  if (question.get('optionList') && !hasRealValue(question.get('optionList').toJS())) {
    return '请填写选项';
  }
  if (question.get('typeId') === 48 && question.get('answerList').count() !== 2) {
    return '双选题答案必须为两个';
  }
  if (question.get('typeId') === 49 && question.get('answerList').count() <= 0) {
    return '请至少选择一个答案';
  }
  if (!filterHtmlForm(question.get('analysis'))) {
    return '请填写解析';
  }
};

// 因为题目字段太多 切换模板时候 我们只考虑会变的字段
// 不变的字段保留
const allVolatileKeys = [
  'optionList',
  'answerList',
  'children',
  'score',
  'layoutStyle',
  'content',
  'itemScore',
  'stemElementType',
  'stemElementList',
  'optionElementType',
  'optionElementList',
];


// 切换模板
// eslint-disable-next-line complexity
export const updateQuestionByTemplate = (question, id, typeId) => {
  console.log('updateQuestionByTemplate', id, typeId);
  let _newQ = question;
  console.log('updateQuestionByTemplatequestion', question.toJS());
  // 互动判断题
  if (String(typeId) === '52') {
    _newQ = fromJS({
      title: '',
      stemElementList: [{
        'stemBusiType': 'listenFile',
        'stemElementContent': null,
        'stemElementType': 4
      }, {
        'stemBusiType': 'listenMaterial',
        'stemElementContent': null,
        'stemElementType': 2
      }],
      templateType: 9,
      typeId: 52,
      score: 3,
    });
    _newQ = _newQ
      .set('children', fromJS([{
        stemElementList: [{}],
        answerList: ['wrong'],
        typeId: '52',
      }]));
    console.log('初始化判斷题型的数据结构', _newQ.toJS());
    return _newQ;
  }
  // 听力题型
  if (String(typeId) === '50') {
    // _newQ = fromJS({});
    _newQ = _newQ
      .set('title', '')
      .set('stemElementList', fromJS([{
        'stemBusiType': 'listenFile',
        'stemElementContent': null,
        'stemElementType': 4
      }, {
        'stemBusiType': 'listenMaterial',
        'stemElementContent': null,
        'stemElementType': 2
      }]))
      .set('score', 3)
      .set('typeId', 50);

    // 复合题模板
    if (String(id) === '1') {
      _newQ = _newQ
        .set('children', fromJS([{
          optionElementList: Array(3).fill({}),
          answerList: Array(3).fill(''),
          typeId: '2',
          templateType: 2,
          score: 3,
          analysis: ''
        }]))
        .set('templateType', 1)
        .delete('optionElementList');
    } else if (String(id) === '2') {
      // 选择题模板
      _newQ = _newQ
        .set('templateType', 2)
        .set('optionElementList', fromJS(Array(3).fill({})))
        .set('answerList', fromJS(Array(3).fill('')))
        .set('analysis', '')
        .delete('children');
    }
    console.log('初始化听力题型的数据结构', _newQ.toJS());
    return _newQ;
  }
  // 排序型
  if (String(id) === '10') {
    // _newQ = fromJS({});
    _newQ = _newQ
      .set('title', '')
      .set('stemElementList', fromJS([{ 'stemElementContent': '' }, { 'stemElementContent': '' }]))
      .set('score', 3)
      .set('templateType', 10)
      .set('optionElementList', emptyList)
      .set('answerList', emptyList)
      .set('analysis', '')
      .set('typeId', 51);
  }
  if (String(id) === '1' && String(typeId) !== '52') {
    // 复合题
    allVolatileKeys.forEach(key => {
      if (key === 'children') {
        _newQ = _newQ.set('children', fromJS([{
          optionList: Array(4).fill(''),
          answerList: [],
          typeId: '2',
          score: 3,
          templateType: 2,
        }]));
      } else {
        _newQ = _newQ.delete(key);
      }
    });
  }
  if ((String(id) === '2' && String(typeId) !== '52') || String(id) === '8') {
    // 选择题
    // 对于单选多选，如果有 optionList 就保留
    console.log(_newQ.get('optionList') && _newQ.get('optionList').count());
    const initOptionList = _newQ.get('optionList')
      && _newQ.get('optionList').count() > 0
      ? _newQ.get('optionList')
      : fromJS(Array(4).fill(''));

    allVolatileKeys.forEach(key => {
      if (key === 'optionList') {
        _newQ = _newQ.set('optionList', initOptionList);
      } else if (key === 'answerList' && String(id) === '2') {
        _newQ = _newQ.set('answerList', emptyList);
      } else if (key === 'score') {
        _newQ = _newQ.set('score', 3);
      } else {
        _newQ = _newQ.delete(key);
      }
    });
  }
  if (String(id) === '3' || String(id) === '4') {
    // 填空 简答题
    allVolatileKeys.forEach(key => {
      if (key === 'answerList') {
        _newQ = _newQ.set('answerList', fromJS(['']));
      } else if (key === 'score') {
        _newQ = _newQ.set('score', 3);
      } else {
        _newQ = _newQ.delete(key);
      }
    });
  }
  if (String(id) === '5' || String(id) === '6') {
    // 5分类题 6配对题
    allVolatileKeys.forEach(key => {
      if (key === 'children') {
        _newQ = _newQ.set('children', fromJS([
          { score: 1, members: [] },
          { score: 1, members: [] }
        ]));
      } else if (key === 'score') {
        _newQ = _newQ.set('score', 1);
      } else {
        _newQ = _newQ.delete(key);
      }
    });
    if (String(id) === '6') {
      _newQ = _newQ.set('layoutStyle', '2');
    }
  }
  if (String(id) === '7') {
    // 选词填空
    allVolatileKeys.forEach(key => {
      if (key === 'content') {
        _newQ = _newQ.set('content', '');
      } else if (key === 'score') {
        _newQ = _newQ.set('score', 0);
      } else if (key === 'itemScore') {
        _newQ = _newQ.set('itemScore', 1);
      } else if (key === 'answerList') {
        _newQ = _newQ.set('answerList', fromJS(['']));
      } else {
        _newQ = _newQ.delete(key);
      }
    });
  }

  // 少儿具有选项的题目添加音频的数据
  const isChildPaper = /childBU\/child-paper/.test(window.location.pathname);
  // console.log('isChildPaper: ', isChildPaper, _newQ.get('optionList').toJS(), _newQ.get('optionList').count() > 0);
  const optionList = _newQ.get('optionList') || emptyList;
  if (isChildPaper && optionList.count() > 0) {
    const questionOptionList = _newQ.get('questionOptionList') || emptyList;
    console.log('questionOptionList-----', isChildPaper, questionOptionList.toJS());
    if (questionOptionList.count() !== optionList.count()) {
      _newQ = _newQ.set('questionOptionList', optionList.map((val, i) => fromJS({
        questionOption: val || null,
        audioPath: questionOptionList.getIn([i, 'audioPath']) || null,
        uploadAudioPath: questionOptionList.getIn([i, 'uploadAudioPath']) || null,
        audioFlag: questionOptionList.getIn([i, 'audioFlag']) || 3,
      })));
    }
    _newQ = _newQ.set('questionContent', _newQ.get('questionContent') || fromJS({
      questionTitleAudioFlag: 3,
      questionTitleAudioPath: null,
      questionTitleUploadAudioPath: null,
    }));
  }
  if (questionUtil.childQuestionAudioVerify(typeId)) {
    // _newQ = _newQ.delete('questionContent');
    // _newQ = _newQ.delete('questionContentInfo');
    _newQ = _newQ.delete('questionOptionList');
    // _newQ = _newQ.delete('questionOptionOutList');
  }

  console.log('初始化newQ的数据结构', _newQ.toJS());
  return _newQ;
};
