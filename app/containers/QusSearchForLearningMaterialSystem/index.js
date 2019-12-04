import React from 'react';
import { fromJS } from 'immutable';
import { toNumber } from 'lodash';
import { message, Radio } from 'antd';
import QueryFromQuestionList from './fromQuestionBank';
import QueryPaper from './fromPaper';
import QueryHomework from './formHomework';
import getQueryData from './getFormData';
import Preview from './previewPaperOrHw';
import { sortFormat, dicDataFormat, hwAndPaperPageSize, sourceList } from './common';
import { RootWrapper, SelectConentWrapper, QueryContent, headRadioStyle, PreviewPaperOrHwWrapper } from './indexStyle';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const emptyMap = fromJS({});
const emptyList = fromJS([]);

class QuestionSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedSource: sourceList[0],
      questionSelected: fromJS({
        type: '',
        dataList: [],
      }),
      previewData: emptyMap,
      showPaperOrHw: false,
      qbFormData: emptyMap,
      qbFormParams: emptyMap,
      hwFormData: emptyMap,
      hwFormParams: fromJS({
        pageIndex: 1,
        keyword: '',
        courseSystemIsGetting: false,
        diff: 4,
        pageSize: hwAndPaperPageSize,
      }),
      paperFormData: emptyMap,
      paperFormParams: fromJS({
        pageIndex: 1,
        keyword: '',
        pageSize: hwAndPaperPageSize,
        selectedSort: {
          name: '默认',
          sortUp: true, // 倒叙(从大到小)
        },
        paperIsGetting: false,
      }),
    };
  }
  componentWillMount() {
    this.formatSearchParams();
  }
  componentDidMount() {
    window.parent.postMessage(JSON.stringify({ action: 'ready', data: '' }), '*');
  }
  formatSearchParams = () => {
    const searchParams = {};
    (location.search || '').replace('?', '').split('&').map((searchItemString) => searchItemString.split('=')).forEach((searchItemArr) => {
      if (searchItemArr && searchItemArr.length > 0) {
        searchParams[searchItemArr[0]] = toNumber(searchItemArr[1]) || 0;
      }
    });
    this.setState(searchParams);
  }
  closePreviewPaperOrHw = () => {
    this.setState({
      showPaperOrHw: false,
      previewData: emptyMap,
    });
  }
  usePaper = () => {
    // const { closeModal } = this.props;
    const { previewData, questionSelected, selectedSource } = this.state;
    const questionList = previewData.get('questionList') || emptyList;
    this.setState({
      showPaperOrHw: false,
      questionSelected: questionSelected
        .set('type', selectedSource.source)
        .set('dataList', questionList.map((item) => item.delete('questionIndex').delete('showAnalysis'))),
    }, () => {
      this.finishSelect();
      // if (closeModal) closeModal();
    });
  }

  // 更改单道题目的数据，例如是否显示解析等
  changeQuestionState = (type, questionId, property, value) => {
    console.log(type, questionId, property, value, 'type, questionId, property, value');
    const { previewData } = this.state;
    let newQuestionList = previewData.get('questionList').map((question) => {
      if (type === 'all') {
        // 如果需要设置所有的话
        return question.set(property, value);
      } else if (type === 'item' && question.get('id') === questionId) { // 是设置单题的话，找到该题并设置
        return question.set(property, value);
      }
      // 如果不满足条件则原样返回，以使得不报错
      return question;
    });
    this.setState({ previewData: previewData.set('questionList', newQuestionList) });
  }
  getFormDataForQb = () => {
    const { getFormDataForQb, phaseSubjectId, gradeId, subjectId } = this.props;
    const { qbFormParams } = this.state;
    getFormDataForQb().then((res) => {
      const qbFormData = fromJS({
        phaseSubjectList: res[0].data || [],
        gradeList: res[1].data || [],
      });

      let selectedPhaseSubject;
      if (phaseSubjectId > 0) {
        selectedPhaseSubject = phaseSubjectList.find((item) => item.get('id') === phaseSubjectId);
      } else if (gradeId > 0) {
        const selectedGrade = qbFormData.get('gradeList').find((item) => item.get('id') === gradeId);
        if (selectedGrade && subjectId > 0) {
          selectedPhaseSubject = qbFormData.get('phaseSubjectList').find((item) => item.get('phaseId') === selectedGrade.get('phaseId') && item.get('subjectId') === subjectId);
        } else if (selectedGrade) {
          selectedPhaseSubject = qbFormData.get('phaseSubjectList').find((item) => item.get('phaseId') === selectedGrade.get('phaseId'));
        } else if (subjectId > 0) {
          selectedPhaseSubject = qbFormData.get('phaseSubjectList').find((item) => item.get('subjectId') === subjectId);
        }
      } else {
        selectedPhaseSubject = qbFormData.getIn('phaseSubjectList', [0]);
      }
      const newQbFormParams = qbFormParams.set('phaseSubject', selectedPhaseSubject);
      this.setState({
        qbFormData,
        qbFormParams: newQbFormParams,
      }, () => {
        this.getKnowledge();
      });
    }).catch((error) => {
      message.error('获取班型失败');
    });
  }
  getKnowledge = () => {
    const { getFormDataForQb } = this.props;
    const { qbFormParams, qbFormData } = this.state;
    const phaseSubject = qbFormParams.get('phaseSubject');
    if (phaseSubject) {
      getFormDataForQb('knowledge', [{ phaseSubjectId: phaseSubject.get('id') }]).then((res) => {
        const newQbFormData = qbFormData.set('knowledgeList', fromJS(res.data || []));
        this.setState({ qbFormData: newQbFormData });
      });
    }
  }

  getFormDataForHw = () => {
    const { getFormDataForHw, gradeId } = this.props;
    const { hwFormParams } = this.state;
    getFormDataForHw().then((res) => {
      const hwFormData = fromJS({ gradeList: res[0].data || [] });
      let newHwFormParams = hwFormParams;
      if (gradeId > 0) {
        newHwFormParams = newHwFormParams.set('grade', hwFormData.get('gradeList').find((item) => item.get('id') === toNumber(gradeId)));
      } else {
        newHwFormParams = newHwFormParams.set('grade', hwFormData.getIn(['gradeList', 0]));
      }
      this.setState({ hwFormData, hwFormParams: newHwFormParams }, this.getSubjectListForHw);
    }).catch((error) => {
      message.error('获取年级或学科失败');
      console.warn('获取年级或学科失败: \n', error);
    });
  }
  getSubjectListForHw = () => {
    const { getFormDataForPaper, subjectId } = this.props;
    const { hwFormParams, hwFormData } = this.state;
    const gradeId = hwFormParams.getIn(['grade', 'id']);
    if (gradeId > 0) {
      getFormDataForPaper('subject', [gradeId]).then((res) => {
        let newHwFormData = hwFormData.set('subjectList', fromJS(res.data || []));
        let newHwFormParams = hwFormParams;
        if (subjectId > 0) {
          newHwFormParams = newHwFormParams.set('subject', newHwFormData.get('subjectList').find((item) => item.get('id') === toNumber(subjectId)));
        } else {
          newHwFormParams = newHwFormParams.set('subject', newHwFormData.getIn(['subjectList', 0]));
        }
        this.setState({
          hwFormData: newHwFormData,
          hwFormParams: newHwFormParams,
        }, this.getEdition);
      }).catch((error) => {
        message.warn('学科信息获取失败');
        console.warn(error);
      });
    }
  }
  getEdition = () => {
    const { hwFormParams, hwFormData } = this.state;
    const { getFormDataForHw } = this.props;
    const gradeId = hwFormParams.getIn(['grade', 'id']);
    const subjectId = hwFormParams.getIn(['subject', 'id']);
    if (gradeId > 0 && subjectId > 0) {
      getFormDataForHw('edition', [{ gradeId, subjectId }]).then((res) => {
        const newHwFormData = hwFormData.set('editionList', fromJS(res.data || []));
        const newHwFormParams = hwFormParams.set('edition', newHwFormData.getIn(['editionList', 0]));
        this.setState({
          hwFormData: newHwFormData,
          hwFormParams: newHwFormParams,
        }, this.getCourseSystem);
      }).catch((error) => {
        message.error('获取版本失败');
      });
    }
  }
  getCourseSystem = () => {
    const { hwFormParams, hwFormData } = this.state;
    const { getFormDataForHw } = this.props;
    const gradeId = hwFormParams.getIn(['grade', 'id']);
    const subjectId = hwFormParams.getIn(['subject', 'id']);
    const editionId = hwFormParams.getIn(['edition', 'id']);
    if (gradeId > 0 && subjectId > 0 && editionId > 0) {
      this.setState({ hwFormParams: hwFormParams.set('courseSystemIsGetting', true) }, () => {
        getFormDataForHw('courseSystem', [{ gradeId, subjectId, editionId }]).then((res) => {
          this.setState({
            hwFormData: hwFormData.set('courseSystemList', fromJS(res.data || [])),
            hwFormParams: hwFormParams.set('courseSystemIsGetting', false),
          }, this.getHomework);
        });
      });
    } else {
      // message.warn('请重新选择');
    }
  }
  getHomework = () => {
    const { hwFormParams, hwFormData } = this.state;
    const { getFormDataForHw } = this.props;
    const params = {
      pageIndex: hwFormParams.get('pageIndex'),
      pageSize: hwFormParams.get('pageSize'),
      state: 0,
      type: 1,
      keyword: hwFormParams.get('keyword') || '',
      grade: hwFormParams.getIn(['grade', 'name']) || '',
      subject: hwFormParams.getIn(['subject', 'name']) || '',
      edition: hwFormParams.getIn(['edition', 'name']) || '',
      questionSource: 2,
      diff: hwFormParams.get('diff') > 3 ? '' : hwFormParams.get('diff'),
      csId: hwFormParams.getIn(['courseSystem', 'id']),
      useDepartment: 1,
      level: hwFormParams.getIn(['courseSystem', 'level']),
    };
    if (params.csId && params.level) {
      this.setState({ hwFormParams: hwFormParams.set('homeworkIsGetting', true) }, () => {
        getFormDataForHw('homework', [params]).then((res) => {
          this.setState({
            hwFormData: hwFormData.set('homeworkList', fromJS(res.data.list || [])),
            hwFormParams: hwFormParams.set('homeworkIsGetting', false).set('total', res.data.total || 0)
          });
        }).catch((error) => {
          this.setState({ hwFormParams: hwFormParams.set('homeworkIsGetting', false).set('total', 0) });
          message.warn('获取作业数据失败');
          console.warn(`获取作业数据失败\n:${error}`);
        });
      });
    } else {
      // message.warn('请重新选择');
    }
  }
  getHomeworkItem = () => {
    const { hwFormParams } = this.state;
    const { getFormDataForHw } = this.props;
    const hwId = hwFormParams.getIn(['openPreviewHw', 'id']);
    if (hwId > 0) {
      getFormDataForHw('homeworkItem', [hwId]).then((res) => {
        let questionList;
        let data = emptyMap;
        try {
          data = fromJS(res.data);
          questionList = data
            .get('homeworkQuestionDTOList')
            .map((item, index) => item.get('questionOutputDTO')
              .set('score', item.get('score'))
              .set('questionIndex', index)
              .set('showAnalysis', false)
              .set('questionSource', item.get('questionSource') || 2));
          // .sortBy((item) => item.get('parentTypeId')); // 排序会导致显示的顺序不对
          data = data.set('questionList', questionList);
        } catch (error) {
          data = fromJS(res.data || {}).set('questionList', emptyList);
          console.warn('error: ', error);
        }
        this.setState({
          previewData: data,
        });
      }).catch((error) => {
        console.warn('erro:\n', error);
      });
    }
  }

  getFormDataForPaper = () => {
    const { getFormDataForPaper } = this.props;
    getFormDataForPaper().then((res) => {
      const paperFormData = fromJS({
        examPaperTypeList: dicDataFormat(res[0].data['QB_EXAM_PAPER_TYPE'] || []),
        examPaperDifficultyList: dicDataFormat(res[0].data['QB_EXAM_PAPER_DIFFICULTY'] || []),
        examTypeList: dicDataFormat(res[0].data['QB_EXAM_TYPE'] || []),
        examCardList: dicDataFormat(res[0].data['QB_PAPER_CARD'] || []),
        yearList: dicDataFormat(res[0].data['QB_YEAR'] || []),
        gradeList: res[1].data || [],
        termList: res[2].data || [],
        provinceList: [{ id: 0, name: '全国' }].concat(res[3].data || []),
      });
      this.setState({ paperFormData }, this.getExamPaper);
    }).catch((error) => {
      message.warn('数据获取失败');
      console.warn(error);
    });
  }
  getTextbookEditionAndEdition = () => {
    const { getFormDataForPaper } = this.props;
    const { paperFormParams, paperFormData } = this.state;
    const gradeId = paperFormParams.getIn(['grade', 'id']);
    const subjectId = paperFormParams.getIn(['subject', 'id']);
    if (gradeId > 0 && subjectId > 0) {
      getFormDataForPaper('textbookEditionAndEdition', [{ gradeId, subjectId }]).then((res) => {
        this.setState({
          paperFormData: paperFormData
            .set('textbookEditionList', fromJS(res[0].data || []))
            .set('editionList', fromJS(res[1].data || [])),
        });
      });
    }
  }
  getSubjectListForPaper = () => {
    const { getFormDataForPaper } = this.props;
    const { paperFormParams, paperFormData } = this.state;
    const gradeId = paperFormParams.getIn(['grade', 'id']);
    if (gradeId > 0) {
      getFormDataForPaper('subject', [gradeId]).then((res) => {
        this.setState({
          paperFormData: paperFormData.set('subjectList', fromJS(res.data || []))
        });
      }).catch((error) => {
        message.warn('学科信息获取失败');
        console.warn(error);
      });
    }
  }
  getCityList = () => {
    const { getFormDataForPaper } = this.props;
    const { paperFormParams, paperFormData } = this.state;
    const provinceId = paperFormParams.getIn(['province', 'id']);
    if (provinceId > 0) {
      getFormDataForPaper('city', [provinceId]).then((res) => {
        this.setState({
          paperFormData: paperFormData.set('cityList', fromJS(res.data || []))
        });
      }).catch((error) => {
        message.warn('城市信息获取失败');
        console.warn(error);
      });
    }
  }
  getCountyList = () => {
    const { getFormDataForPaper } = this.props;
    const { paperFormParams, paperFormData } = this.state;
    const cityId = paperFormParams.getIn(['city', 'id']);
    if (cityId > 0) {
      getFormDataForPaper('county', [cityId]).then((res) => {
        this.setState({
          paperFormData: paperFormData.set('countyList', fromJS(res.data || []))
        });
      }).catch((error) => {
        message.warn('城市信息获取失败');
        console.warn(error);
      });
    }
  }
  getExamPaper = () => {
    const { paperFormParams, paperFormData } = this.state;
    const { getFormDataForPaper } = this.props;
    const params = {
      pageIndex: paperFormParams.get('pageIndex'),
      pageSize: paperFormParams.get('pageSize'),
      sort: sortFormat(paperFormParams.get('selectedSort').toJS()),
      submitFlag: true,
      typeId: paperFormParams.getIn(['examPaperType', 'id']),
      gradeId: paperFormParams.getIn(['grade', 'id']),
      subjectId: paperFormParams.getIn(['subject', 'id']),
      teachingEditionId: paperFormParams.getIn(['textbookEdition', 'id']),
      editionId: paperFormParams.getIn(['edition', 'id']),
      difficulty: paperFormParams.getIn(['examPaperDifficulty', 'id']),
      year: paperFormParams.getIn(['year', 'id']),
      termId: paperFormParams.getIn(['term', 'id']),
      examTypeId: paperFormParams.getIn(['examType', 'id']),
      provinceId: paperFormParams.getIn(['province', 'id']),
      cityId: paperFormParams.getIn(['city', 'id']),
      businessCardId: paperFormParams.getIn(['examCard', 'id']),
    };
    console.log(paperFormParams, paperFormParams.toJS(), params, 'paperFormParams');
    if (params.pageIndex > 0) {
      this.setState({ paperFormParams: paperFormParams.set('paperIsGetting', true) }, () => {
        getFormDataForPaper('examPaper', [params]).then((res) => {
          this.setState({
            paperFormData: paperFormData.set('paperList', fromJS(res.data.list || [])),
            paperFormParams: paperFormParams.set('paperIsGetting', false)
              .set('pages', res.data.pages || 0)
          });
        }).catch((error) => {
          this.setState({ paperFormParams: paperFormParams.set('paperIsGetting', false).set('pages', 0) });
          message.warn('试卷数据获取失败');
          console.warn(`试卷数据获取失败\n: ${error}`);
        });
      });
    }
  }
  getExamPaperItem = () => {
    const { paperFormParams } = this.state;
    const { getFormDataForPaper } = this.props;
    const examPaperId = paperFormParams.getIn(['previewPaperItem', 'id']);
    if (examPaperId) {
      getFormDataForPaper('paperItem', [{ examPaperId }]).then((res) => {
        let questionList;
        let data = emptyMap;
        try {
          data = fromJS(res.data);
          questionList = data
            .get('examPaperContentOutputDTOList')
            .map((item) => item.get('examPaperContentQuestionOutputDTOList'))
            .flatten(1)
            .map((item, index) => item.get('questionOutputDTO')
              .set('score', item.get('score'))
              .set('questionIndex', index)
              .set('showAnalysis', false)
              .set('questionSource', item.get('questionSource') || 2))
            .sortBy((item) => item.get('parentTypeId')
            );
          data = data.set('questionList', questionList);
        } catch (error) {
          data = fromJS(res.data || {}).set('questionList', emptyList);
          console.warn('error: ', error);
        }
        this.setState({
          previewData: data,
        });
      }).catch((error) => {
        message.error('获取试卷数据失败');
        console.warn(`获取试卷数据失败\n: ${error}`);
      });
    }
  }
  resetPaperSelect = () => {
    this.setState({
      paperFormParams: fromJS({
        pageIndex: 1,
        keyword: '',
        pageSize: hwAndPaperPageSize,
        selectedSort: {
          name: '默认',
          sortUp: true, // 倒叙(从大到小)
        },
        paperIsGetting: false,
      })
    });
  }

  changeSource = (e) => {
    this.setState({
      selectedSource: sourceList.find((item) => item.source === e.target.value),
      questionSelected: fromJS({
        type: '',
        dataList: [],
      })
    });
  }

  selectQuestion = (type, question) => {
    const { selectedSource, questionSelected } = this.state;
    let dataList = questionSelected.get('dataList') || emptyList;
    if (type === 'addAll') {
      (question || emptyList).map((item) => {
        if (!dataList.includes(item)) {
          dataList = dataList.push(item);
        }
        return item;
      });
    } else if (['remove', 'removeFromSkep'].includes(type)) {
      dataList = dataList.filter((item) => item.get('id') !== question.get('id'));
    } else {
      dataList = dataList.push(question);
    }
    // console.log(type, question.toJS(), dataList.toJS());
    this.setState({ questionSelected: questionSelected.set('type', selectedSource.source).set('dataList', dataList) }, () => {
      if (type === 'removeFromSkep') this.previewQuestionList();
    });
  }
  previewQuestionList = () => {
    const { questionSelected } = this.state;
    this.setState({
      showPaperOrHw: true,
      previewData: emptyMap.set('questionList', (questionSelected.get('dataList') || emptyList)
        .map((item, index) => item.set('showAnalysis', false).set('questionIndex', index)))
    });
  }

  selectChange = (module, type, value) => {
    console.log('selectChange - index [module, type, value]', module, type, value);
    const {
      qbFormData, qbFormParams,
      hwFormData, hwFormParams,
    } = this.state;
    let newFormParams = emptyMap;
    const newState = {};
    switch (module) {
      case 'qb':
        newFormParams = qbFormParams.set(type, qbFormData.get(`${type}List`).find((item) => item.get('id') === parseInt(value.key, 10)));
        this.setState({ qbFormParams: newFormParams });
        break;
      case 'hw':
        // 分别是 难度、关键字、作业页数、查看某份作业指令
        if (['diff', 'keyword', 'pageIndex', 'openPreviewHw'].includes(type)) {
          newFormParams = hwFormParams.set(type, value);
        } else if (['courseSystem'].includes(type)) {
          newFormParams = hwFormParams.set(type, fromJS(value).set('id', toNumber(value.key))).set('pageIndex', 1);
        } else if (['searchPaper'].includes(type)) {
          newFormParams = hwFormParams.set('pageIndex', 1);
        } else {
          newFormParams = hwFormParams.set(type, (hwFormData.get(`${type}List`) || emptyList).find((item) => item.get('id') === parseInt(value.key, 10)));
        }
        if (type === 'openPreviewHw') {
          newState.showPaperOrHw = true;
        }
        newState.hwFormParams = newFormParams;
        this.setState(newState, () => {
          if (type === 'grade') {
            this.getSubjectListForHw();
          } else if (type === 'subject') {
            this.getEdition();
          } else if (type === 'edition') {
            this.getCourseSystem();
          } else if (['searchPaper', 'courseSystem', 'pageIndex'].includes(type)) {
            this.getHomework();
          } else if (type === 'openPreviewHw') {
            this.getHomeworkItem();
          }
        });
        break;
      case 'paper':
        newFormParams = this.changeParamsForPaper(type, value);
        console.log(newFormParams.toJS(), 'newFormParams');
        if (type === 'previewPaperItem') {
          newState.showPaperOrHw = true;
        }
        newState.paperFormParams = newFormParams;
        this.setState(newState, () => {
          this.getDataAfterSelectChangeForPaper(type);
        });
        break;
    }
  }

  /**
   * 试卷筛选条件更替处理
   * @param {string} type 字段类型
   * @param {any} value 要改变的值
   */
  changeParamsForPaper = (type, value) => {
    const { paperFormData, paperFormParams } = this.state;
    let newFormParams = emptyMap;

    const typeMap = {
      province: ['city', 'county'],
      city: ['county'],
      grade: ['subject', 'textbookEdition', 'edition'],
      subject: ['textbookEdition', 'edition'],
    };

    if (['keyword', 'pageIndex', 'previewPaperItem'].includes(type)) {
      newFormParams = paperFormParams.set(type, value);
    } else if (type === 'selectedSort') {
      newFormParams = paperFormParams.set(type, value).set('pageIndex', 1);
    } else if (type === 'searchExamPaper') {
      newFormParams = paperFormParams.set('pageIndex', 1);
    } else {
      newFormParams = paperFormParams.set(type, (paperFormData.get(`${type}List`) || emptyList).find((item) => item.get('id') === parseInt(value, 10)));
      if (typeMap[type]) {
        typeMap[type].forEach((it) => {
          newFormParams = newFormParams.delete(it);
        });
      }
    }
    return newFormParams;
  }

  /**
   * 试卷更换筛选条件后的联动处理
   * @param {string} type 字段类型
   */
  getDataAfterSelectChangeForPaper = (type) => {
    if (type === 'grade') {
      this.getSubjectListForPaper();
    } else if (type === 'subject') {
      this.getTextbookEditionAndEdition();
    } else if (type === 'province') {
      this.getCityList();
    } else if (type === 'city') {
      this.getCountyList();
    } else if (['searchExamPaper', 'selectedSort', 'pageIndex'].includes(type)) {
      this.getExamPaper();
    } else if (type === 'previewPaperItem') {
      this.getExamPaperItem();
    } else if (type === 'resetSelect') {
      this.resetPaperSelect();
    }
  }

  finishSelect = () => {
    const { finishSelect } = this.props;
    const { questionSelected } = this.state;
    if (questionSelected.get('type') && (questionSelected.get('dataList').count() > 0)) {
      console.log(questionSelected.toJS(), 'finishSelectQuestion');
      if (finishSelect) {
        finishSelect(questionSelected.toJS());
      } else {
        window.parent.postMessage(JSON.stringify({ action: 'finish', data: questionSelected.get('dataList').toJS() }), '*');
      }
    } else {
      message.warning('未找到选择的题目数据，请重新选择后再次尝试');
    }
  }

  /**
   * 返回对应的 tab 的详细界面
   * @returns {ReactDOM | null} res
   */
  makeSelector = () => {
    const {
      selectedSource, questionSelected,
      qbFormData, qbFormParams,
      hwFormData, hwFormParams,
      paperFormData, paperFormParams,
      phaseId, subjectId,
    } = this.state;
    const { getFormDataForQb } = this.props;
    let res = null;
    switch (selectedSource.source) {
      case sourceList[0].source:
        res = (<QueryFromQuestionList
          formData={qbFormData}
          selectedQuestionList={questionSelected.get('dataList')}
          formDataParams={qbFormParams}
          selectQuestion={this.selectQuestion}
          previewQuestionList={this.previewQuestionList}
          getData={getFormDataForQb}
          phaseId={phaseId}
          subjectId={subjectId}
        />);
        break;
      case sourceList[1].source:
        res = (<QueryHomework
          formData={hwFormData}
          formDataParams={hwFormParams}
          getData={this.getFormDataForHw}
          selectChange={this.selectChange}
          courseSystemIsGetting={hwFormParams.get('courseSystemIsGetting')}
          homeworkIsGetting={hwFormParams.get('homeworkIsGetting')}
        />);
        break;
      case sourceList[2].source:
        res = (<QueryPaper
          formData={paperFormData}
          formDataParams={paperFormParams}
          getData={this.getFormDataForPaper}
          selectChange={this.selectChange}
        />);
        break;
      default:
        res = (<QueryFromQuestionList
          formData={hwFormData}
          selectedQuestionList={questionSelected.get('dataList')}
          formDataParams={hwFormParams}
          selectQuestion={this.selectQuestion}
          previewQuestionList={this.previewQuestionList}
          getData={getFormDataForQb}
          phaseId={phaseId}
          subjectId={subjectId}
        />);
        break;
    }
    return res;
  }

  render() {
    const { selectedSource, showPaperOrHw, previewData } = this.state;
    const previewItemToolsShow = {
      showAnalysis: true,
      correct: true,
      delete: selectedSource.source === sourceList[0].source,
    };
    return (
      <RootWrapper>
        <SelectConentWrapper>
          <RadioGroup onChange={this.changeSource} value={selectedSource.source} size="large" style={headRadioStyle}>
            {sourceList.map((item) => (<RadioButton key={item.source} value={item.source}>{item.name}</RadioButton>))}
          </RadioGroup>
          <QueryContent>
            {this.makeSelector()}
          </QueryContent>
        </SelectConentWrapper>
        <PreviewPaperOrHwWrapper show={showPaperOrHw}>
          <Preview
            goBack={this.closePreviewPaperOrHw}
            data={previewData}
            changeQuestionState={this.changeQuestionState}
            selectQuestion={this.selectQuestion}
            usePaper={this.usePaper}
            toolConfig={previewItemToolsShow}
          />
        </PreviewPaperOrHwWrapper>
      </RootWrapper>
    );
  }
}

export default getQueryData(QuestionSearch);