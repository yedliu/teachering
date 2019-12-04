/* eslint-disable react/forbid-prop-types */
import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
import { Tree, Select, message, Pagination, Button } from 'antd';
import QuestionSearchData from 'components/QuestionSearchData';
import { toString, toNumber, isFunction } from 'lodash';
import { FlexColumn, FlexRowCenter } from 'components/FlexBox';
import ErrorCorrect from 'components/ErrorCorrect';
import sourceModule from 'components/ErrorCorrect/sourceModule';
import { filterHtmlForm } from 'components/CommonFn';
import { PlaceHolderBox } from 'components/CommonFn/style';
import TextEditionSlider from 'components/TextEditionSlider';

import AIQuestionItemEdit from '../../StandHomeWork/AIHomework/AIHomeworkEdit/AIQuestionItemShow';
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
import getData from '../server';
import { filterKnowledgeIdList } from '../common';
import {
  RootWrapper,
  LeftWrapper,
  RightWrapper,
  TreeWrapper,
  QuestionsWrapper,
  LoadWrapper,
  QuestionItem,
  LineBox,
  PaginationWrapper,
  FilterQuestionOrder,
  IconArrow,
  FilterQuestionNumber,
  SeeAnalysisWrapper,
  SeeAnalysisValue,
  ClickBox,
} from './indexStyle';

const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const defaultSelect = { id: '-1', name: '全部' };

const emptyList = fromJS([]);

class QuestionSearch extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.makeTreeNode = this.makeTreeNode.bind(this);
    this.getGrade = this.getGrade.bind(this);
    this.getPhaseSubject = this.getPhaseSubject.bind(this);
    this.getKnowledge = this.getKnowledge.bind(this);
    this.selectChange = this.selectChange.bind(this);
    this.selectTreeChange = this.selectTreeChange.bind(this);
    this.state = {
      phaseSubjectList: [],
      phaseSubject: defaultSelect,       // 选中的学段学科
      knowledgeList: [],
      gradeList: [],                     // 年级列表
      selectTree: {},                    // 选中的知识点
      questionsMsg: {},                  // 获取题目的信息
      questions: fromJS([]),             // 题目列表
      selectedQuestion: fromJS({}),      // 选中的题目
      isLoading: false,                  // 正在获取题目
      pageIndex: 1,
      pageSize: 20,
      updatedTimeSort: '',
      quoteCountSort: '',
      sliderState: '1',
      knowledgeIds: [],
    };
    this.pureState = {};
  }
  componentWillMount() {
    this.getPhaseSubject();
  }
  getGrade() {
    const { phaseSubjectId, gradeId, subjectId, phaseId } = this.props;
    const { phaseSubjectList, phaseSubject } = this.state;
    getData.grade().then((res) => {
      const data = res.data || [];
      this.setState({ gradeList: data }, () => {
        let selectedPhaseSubject = phaseSubject;
        if (phaseSubjectId > 0) {
          selectedPhaseSubject = phaseSubjectList.find((item) => item.id === phaseSubjectId);
        } else if (phaseId > 0) {
          if (subjectId > 0) {
            selectedPhaseSubject = phaseSubjectList.find((item) => item.phaseId === phaseId && item.subjectId === subjectId);
          } else {
            selectedPhaseSubject = phaseSubjectList.find((item) => item.phaseId === phaseId) || selectedPhaseSubject;
          }
        } else if (gradeId > 0) {
          const selectedGrade = data.find((item) => item.id === gradeId);
          if (selectedGrade && subjectId > 0) {
            selectedPhaseSubject = phaseSubjectList.find((item) => item.phaseId === selectedGrade.phaseId && item.subjectId === subjectId);
          } else if (selectedGrade) {
            selectedPhaseSubject = phaseSubjectList.find((item) => item.phaseId === selectedGrade.phaseId);
          } else if (subjectId > 0) {
            selectedPhaseSubject = phaseSubjectList.find((item) => item.subjectId === subjectId);
          }
        } else {
          this.getKnowledge();
          return;
        }
        this.setState({ phaseSubject: selectedPhaseSubject || phaseSubject }, () => {
          this.getKnowledge();
        });
      });
    }).catch((error) => {
      console.warn('getGrade - error: ', error);
      this.getKnowledge();
    });
  }
  getPhaseSubject() {
    const { phaseSubjectId } = this.props;
    getData.phaseSubject().then((res) => {
      const data = res.data || [];
      const selectedPhaseSubject = data.find((item) => item.id === phaseSubjectId) || data[0] || defaultSelect;
      this.setState({
        phaseSubjectList: data,
        phaseSubject: selectedPhaseSubject,
      }, () => {
        this.getGrade();
        if (phaseSubjectId > 0) this.getKnowledge();
      });
    }).catch((error) => {
      console.warn('getPhaseSubject - error: ', error);
      this.getGrade();
    });
  }
  getKnowledge() {
    const { phaseSubject } = this.state;
    getData.knowledge({
      phaseSubjectId: phaseSubject.id,
    }).then((repos) => {
      const dataList = repos.data || [];
      this.setState({
        knowledgeList: dataList,
      }, () => {
        /**
         * TODO:
         * 设置默认知识点
         */
      });
    });
  }
  getQuestions() {
    const source = this.props.source;
    this.setState({ isLoading: true });
    const {
      province = {},
      city = {},
      county = {},
      grade = {},
      year = {},
      term = {},
      paperType = {},
      examType = {},
      questionType = {},
      difficulty = {},
      knowledgeType = {},
      input,
      selectTree,
      pageIndex,
      pageSize,
      updatedTimeSort,
      quoteCountSort,
      phaseSubject,
      id,
      knowledgeIds,
      sliderState,
    } = this.state;
    const params = {
      knowledgeIds: (selectTree.knowledges || ['']).join(','),
      pageIndex,
      pageSize,
      templateTypes: source === 'zml' ? '1,2,3,4,5,6,7' : '1,2,3,4',
      orderByFieldStr: 'updatedTime,quoteCount',
      orderByDirectionStr: `${updatedTimeSort},${quoteCountSort}`,
    };
    if (sliderState === '2') {
      // 如果没有知识点 不继续查询的题目
      if (knowledgeIds.length === 0) {
        this.setState({
          questionsMsg: { total: 0 },
          questions: fromJS([]),
          isLoading: false,
        });
        return;
      }
      params.knowledgeIds = knowledgeIds.join(',');
    }
    if (province.id >= 0) params.provinceId = province.id;
    if (city.id > 0) params.cityId = city.id;
    if (county.id > 0) params.countyId = county.id;
    if (grade.id > 0) params.gradeId = grade.id;
    if (year.id > 0) params.year = year.id;
    if (term.id > 0) params.termId = term.id;
    if (paperType.id > 0) params.examPaperTypeId = paperType.id;
    if (examType.id > 0) params.examTypeId = examType.id;
    if (questionType.id > 0) params.typeId = questionType.id;
    if (difficulty.id > 0) params.difficulty = difficulty.id;
    if (knowledgeType.id > 0) params.knowledgeType = knowledgeType.id;
    if (id > 0) params.id = id;
    if (filterHtmlForm(input)) params.keyword = input;
    if (phaseSubject.id > 0 && sliderState !== '2') {
      params.phaseId = phaseSubject.phaseId;
      params.subjectId = phaseSubject.subjectId;
    }
    if (sliderState === '2') {
      const { gradeId, subjectId } = this.pureState;
      params.gradeId = gradeId;
      params.subjectId = subjectId;
    }
    getData.questions(params).then((res) => {
      const data = res.data || {};
      this.setState({
        questionsMsg: data,
        questions: fromJS(data.data || []).map((item) => item.set('showAnalysis', false)),
        isLoading: false,
      });
    }).catch((error) => {
      console.warn(error);
      message.warning('题目数据获取失败');
      this.setState({ isLoading: false });
    });
  }
  makeTreeNode(treeList) {
    if (!treeList || treeList.length <= 0) {
      return <TreeNode title="请选择版本获取课程体系" isLeaf level={-1}></TreeNode>;
    }
    return treeList.map((item) => {
      const children = item.children;
      // return <TreeNode title={item.name || ''} key={toString(item.id)}>{children && children.length > 0 ? this.makeTreeNode(children) : ''}</TreeNode>;
      let res = '';
      if (children && children.length > 0) {
        res = (<TreeNode title={item.name || ''} key={toString(item.id)} isLeaf={false} level={item.level || -1} phaseSubjectId={item.phaseSubjectId}>{this.makeTreeNode(children)}</TreeNode>);
      } else {
        res = <TreeNode title={item.name || ''} key={toString(item.id)} isLeaf level={item.level || -1} phaseSubjectId={item.phaseSubjectId}></TreeNode>;
      }
      return res;
    });
  }
  selectChange(type, value, cb) {
    console.log('selectChange - qb [type, value, cb]', type, value, cb);
    if (type === 'customizeBtnWidthSearch') {
      this.props.closeOrOpenItemQuestion(true);
      return;
    }
    if (type === 'search') {
      this.setState({ pageIndex: 1 }, () => {
        this.getQuestions();
      });
      return;
    }
    let newValue = value;
    const newState = {};
    const { updatedTimeSort, quoteCountSort } = this.state;
    if (type === 'updatedTimeSort' && value === updatedTimeSort) {
      newValue = '';
    }

    if (type === 'quoteCountSort' && value === quoteCountSort) {
      newValue = '';
    }
    newState[type] = newValue;

    if (type === 'province') {
      newState['city'] = { id: -1, name: '请重新选择' };
      newState['county'] = { id: -1, name: '请重新选择' };
    } else if (type === 'city') {
      newState['county'] = { id: -1, name: '请重新选择' };
    }
    if (['phaseSubject', 'selectTree'].includes(type)) {
      newState.pageIndex = 1;
    }
    this.setState(newState, () => {
      if (cb && isFunction(cb)) cb();
      // if (type === 'selectedQuestion') {
      //   const { selectQuestion } = this.props;
      //   selectQuestion(value);
      // }
      if (type === 'phaseSubject') this.getKnowledge();
      if (['pageIndex', 'selectTree', 'updatedTimeSort', 'quoteCountSort'].includes(type)) this.getQuestions();
    });
  }
  selectTreeChange(keys, e) {
    const itemProps = e.node.props || {};
    let selectedItem = { id: toNumber(itemProps.eventKey), name: itemProps.title, knowledges: [] };
    const id = toNumber(itemProps.eventKey);
    const name = itemProps.title;
    if (itemProps.selected && itemProps.isLeaf) {
      selectedItem = { id, name, knowledges: [id] };
    } else {
      const childIds = filterKnowledgeIdList(e); // 把父节点的id也加上
      if (!childIds.every((id) => id)) return;
      childIds.unshift(keys[0]);
      selectedItem = { id, name, knowledges: childIds.filter(id => id > 0) };
    }
    this.selectChange('selectTree', selectedItem);
  }
  addOrRemoveQuestionFromSkep = (type, questionItem) => {
    // console.log(type, questionItem.toJS());
    const { selectQuestion } = this.props;
    if (selectQuestion) {
      selectQuestion(type, questionItem);
    }
  }
  qbSkepClick = () => {
    const { selectedQuestionList = emptyList, previewQuestionList } = this.props;
    if (selectedQuestionList.count() > 0) {
      if (previewQuestionList) previewQuestionList();
    }
  }

  handleValueChange = (data) => {
    this.setState({ questionsMsg: { total: 0 }, questions: fromJS([]), knowledgeIds: [] });
    const { gradeId, subjectId, knowledge } = data;
    if (gradeId) {
      this.pureState.gradeId = gradeId;
    }
    if (subjectId) {
      this.pureState.subjectId = subjectId;
    }
    if (knowledge) {
      if (knowledge.length === 0) message.warning('未选择知识点或选择的教材目录无知识点');
      this.setState({ knowledgeIds: knowledge }, () => { this.getQuestions() });
    }
  }

  handleTypeChange = async sliderState => {
    if (sliderState === '1') {
      const { gradeId, subjectId } = this.pureState;
      const id = await getData.getParseSubject(gradeId, subjectId);
      if (id) {
        this.setState({ phaseSubject: { id }});
      }
    } else {
      const parseSubjectId = this.state.phaseSubject.id;
      const { gradeId, subjectId } = await getData.getFirstGradeSubject(parseSubjectId);
      this.pureState.gradeId = gradeId;
      this.pureState.subjectId = subjectId;
    }
    this.setState({ sliderState, questionsMsg: { total: 0 }, questions: fromJS([]) });
  }
  render() {
    const {
      phaseSubjectList,
      knowledgeList,
      gradeList,
      phaseSubject = defaultSelect,
      grade = defaultSelect,
      year = defaultSelect,
      term = defaultSelect,
      paperType = defaultSelect,
      examType = defaultSelect,
      province = defaultSelect,
      city = defaultSelect,
      county = defaultSelect,
      difficulty = defaultSelect,
      questionType = defaultSelect,
      knowledgeType = defaultSelect,
      selectTree,
      isLoading,
      questions,
      pageIndex,
      pageSize,
      questionsMsg,
      updatedTimeSort,
      quoteCountSort,
      sliderState,
    } = this.state;
    const { gradeId, subjectId } = this.pureState;
    const { knowledgeIdList = [], selectedQuestionList = emptyList } = this.props;
    const showAllAnalysis = questions.count() > 0 && !questions.some((item) => !item.get('showAnalysis'));
    return (<RootWrapper>
      <LeftWrapper>
        <FlexColumn style={{ width: '100%', height: '100%' }}>
          <div style={{ padding: '10px 5px 0' }}>
            <Select value={sliderState} style={{ width: '100%', }} onChange={this.handleTypeChange}>
              <Option value="1">根据知识点选题</Option>
              <Option value="2">根据教材章节选题</Option>
            </Select>
          </div>
          {sliderState === '1' && <Select
            style={{ height: 50, padding: '10px 5px' }} labelInValue value={{ key: toString(phaseSubject.id) || '' }} onChange={(value) => {
              const selectedPhaseSubject = phaseSubjectList.find((it) => it.id === toNumber(value.key)) || { id: toNumber(value.key) || -1, name: value.label };
              this.selectChange('phaseSubject', selectedPhaseSubject);
            }}
          >
            {phaseSubjectList.map((item) => <Option key={toString(item.id) || ''} value={toString(item.id)}>{item.name}</Option>)}
          </Select>}
          {sliderState === '1' && <TreeWrapper>
            <Tree
              showLine
              autoExpandParent
              // checkStrictly
              // defaultSelectedKeys={[toString(knowledgeList[0].id || 0)]}
              selectedKeys={knowledgeIdList.concat([toString(selectTree.id) || '-1'])}
              // defaultExpandedKeys={[toString(selectTree.get('id')) || '']}
              onSelect={this.selectTreeChange}
            >
              {this.makeTreeNode(knowledgeList)}
            </Tree>
          </TreeWrapper>}
          {sliderState === '2' &&
            <TextEditionSlider
              onValueChange={this.handleValueChange}
              gradeId={gradeId}
              subjectId={subjectId}
              autoSelect={false}
            />}
        </FlexColumn>
      </LeftWrapper>
      <RightWrapper>
        <FlexColumn style={{ width: '100%', height: '100%' }}>
          <QuestionSearchData
            source="QusSearchForLearningMaterialSystem"
            searchStyle={{ wrapper: { width: '100%' }, item: { height: 35 }}}
            whoseShow={['area', sliderState === '2' ? '' : 'grade', 'year', 'term', 'paperType', 'examType', 'questionType', 'difficulty', 'knowledgeType', 'input', 'id', 'search']}
            dataList={{ grade: gradeList }}
            searchDate={{
              id: '题目id',
            }}
            selectType={{
              grade,
              year,
              term,
              paperType,
              examType,
              province,
              city,
              county,
              difficulty,
              questionType,
              knowledgeType,
            }}
            noFetch={{ grade: true }}
            changeSelect={(value, type, cb) => this.selectChange(type, value, cb)}
          />
          <FlexRowCenter style={{ padding: '0 8px' }}>
            <FilterQuestionOrder>排序：
              <span>题目使用量<IconArrow onClick={() => this.selectChange('quoteCountSort', 'ASC')} type="arrow-up" selected={quoteCountSort === 'ASC'} /><IconArrow onClick={() => this.selectChange('quoteCountSort', 'DESC')} type="arrow-down" selected={quoteCountSort === 'DESC'} /></span>
              <span>时间<IconArrow onClick={() => this.selectChange('updatedTimeSort', 'ASC')} type="arrow-up" selected={updatedTimeSort === 'ASC'} /><IconArrow onClick={() => this.selectChange('updatedTimeSort', 'DESC')} type="arrow-down" selected={updatedTimeSort === 'DESC'} /></span>
            </FilterQuestionOrder>
            <FilterQuestionNumber>{`共有符合条件的题目${questionsMsg.total || 0}个`}</FilterQuestionNumber>
            <PlaceHolderBox />
            <Button style={{ marginRight: 10 }} type="primary" onClick={() => this.addOrRemoveQuestionFromSkep('addAll', questions)}>全部加入试题篮</Button>
            <SeeAnalysisWrapper
              onClick={() => {
                const newShowAnalysis = !showAllAnalysis;
                const newQuestionList = questions.map((item) => {
                  return item.set('showAnalysis', newShowAnalysis);
                });
                const newState = { questions: newQuestionList };
                this.setState(newState);
              }}
            >
              <ClickBox selected={showAllAnalysis}></ClickBox><SeeAnalysisValue>显示全部答案与解析</SeeAnalysisValue>
            </SeeAnalysisWrapper>
          </FlexRowCenter>
          <LineBox></LineBox>
          {isLoading ?
            <QuestionsWrapper>
              <LoadWrapper>Loading...</LoadWrapper>
            </QuestionsWrapper>
            :
            <QuestionsWrapper>
              {questions.count() > 0 ? questions.map((item, index) => {
                const beSelected = selectedQuestionList.findIndex((selectedItem) => selectedItem.get('id') === item.get('id')) > -1;
                return (<QuestionItem key={index}>
                  <span className="isSelected"></span>
                  <AIQuestionItemEdit questionData={item} />
                  <PaginationWrapper>
                    <PlaceHolderBox />
                    <Button style={{ marginRight: 10 }} type={beSelected ? 'default' : 'primary'} onClick={() => this.addOrRemoveQuestionFromSkep(beSelected ? 'remove' : 'add', item)}>{beSelected ? '移出' : '加入'}试题篮</Button>
                    <Button
                      style={{ marginRight: 10 }} type={item.get('showAnalysis') ? 'default' : 'primary'}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const newQuestionList = questions.map((it) => {
                          if (it.get('id') === item.get('id')) {
                            const showAnalysis = item.get('showAnalysis');
                            return item.set('showAnalysis', !showAnalysis);
                          }
                          return it;
                        });
                        const newState = { questions: newQuestionList };
                        this.setState(newState);
                      }}
                    >{item.get('showAnalysis') ? '隐藏' : '查看'}解析</Button>
                    <ErrorCorrect
                      questionId={item.get('id')}
                      sourceModule={sourceModule.tk.universalTopicSelection.id}
                    />
                  </PaginationWrapper>
                </QuestionItem>);
              })
                :
                <LoadWrapper>
                  <div>
                    <img role="presentation" src={emptyImg} />
                    <p style={{ textAlign: 'center' }}>这里空空如也！</p>
                  </div>
                </LoadWrapper>}
            </QuestionsWrapper>}
          {questionsMsg.pageCount > 1 ? <LineBox></LineBox> : ''}
          <PaginationWrapper style={{ justifyContent: 'space-between', padding: '0 10px' }}>
            {selectedQuestionList.count() > 0 || questions.count() > 0 ? <Button icon="shopping-cart" type={selectedQuestionList.count() > 0 ? 'primary' : 'default'} onClick={this.qbSkepClick}>试题篮（{selectedQuestionList.count()}）</Button> : null}
            {questionsMsg.pageCount > 1 ?
              <Pagination
                current={pageIndex} total={questionsMsg.total || 0} pageSize={pageSize}
                onChange={(page) => this.selectChange('pageIndex', page)}
              /> : ''}
          </PaginationWrapper>
        </FlexColumn>
      </RightWrapper>
    </RootWrapper>);
  }
}

// 传入 gradeId 以及 subjectId 则不需要 phaseSubjectId，反之亦然.（数据三个数据有谁传谁，权重: phaseSubjectId > gradeId > subjectId）
QuestionSearch.propTypes = {
  gradeId: PropTypes.number,
  subjectId: PropTypes.number,
  phaseSubjectId: PropTypes.number,
  knowledgeIdList: PropTypes.array,
  selectQuestion: PropTypes.func.isRequired,
  source: PropTypes.string,
};

export default QuestionSearch;
