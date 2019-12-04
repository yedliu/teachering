/*
 * PaperAnalysis
 * 试卷分析页面
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { createStructuredSelector } from "reselect";
import {  
  Button, 
  Table,
  message as antdMessage,
} from "antd";
import styled from "styled-components";
import echarts from "echarts";
import {
  setDefaultState,
  getQuestionList
} from "./actions";
import makeSelectPaperAnalysis, {
  makeSelectQuestionList
} from "./selectors";

const RootDiv = styled.div`
  transform: translate(0, 0);
  width: 100%;
  padding-top: 40px;
  max-height: 750px;
`;
const Header = styled.div`
  position: fixed;
  font-size: 20px;
  text-align: center;
  line-height: 30px;
  top: 0;
  left: 0;
  right: 0;
`;
const CloseBtn = styled.div`
  position: fixed;
  top: 10px;
  right: 20px;
`;
const Content = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;
const Title = styled.h3`
  color: #108ee9;
  font-size: 18px;
  font-weight: 700;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  position: relative;
  margin: 10px 0;
  &:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: " ";
    width: 170px;
    height: 3px;
    border-bottom: 1px solid #eee;
    background: #108ee9;
  }
`;
const Flex = styled.div`
  display: flex;
  .flex-1 {
    flex: 1;
  }
`;
const TopTableHeader = styled.div`
  background: rgb(16, 142, 233) !important;
  color: #fff;
  text-align: center;
  font-weight: 700;
  padding: 16px;
  line-height: 18px;
  font-size: 14px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  border: 1px solid #dcdcdc;
`;
const TopTableTitle = styled.div`
  display: flex;
  width: 200px;
  font-size: 14px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  border: 1px solid #dcdcdc;
  border-top: none;
`;
const TopTableChild = styled.div`
  flex: 1;
  text-align: center;
  line-height: 25px;
  border-right: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
`;
const CanvasWrapper = styled.div`
  height: 200px;
  width: 400px;
  margin: 0 auto;
`;

const TableWrapper = styled.div`
  .ant-table-content{
    text-align: center;
    .ant-table-thead{
      tr{
        th{
          background: rgb(16, 142, 233) !important;
          color: #fff;
          text-align: center;
          font-weight: 700;
        }
      }
    }
    .ant-table-tbody{
      td{
        text-align: center;
      }
      .type-name{
        font-weight: 700;
      }
    }
  }
`

export class PaperAnalysis extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderChart = this.renderChart.bind(this);
  }

  componentWillMount() {
    const {data} = this.props
    this.analysisData = this.computedData(data)
  }

  componentDidMount() {
    const id = this.props.paperId;
    const { dispatch, data, edit = false } = this.props;
    dispatch(setDefaultState());
    if(!edit) {
      dispatch(getQuestionList(id))
    }
    this.myChart = echarts.init(this.chars);
    if(edit) {
      var {questionDifficulty = []} = this.analysisData
    } else {
      const data = this.getDataFromApiData(this.props.questionList.toJS())
      var {questionDifficulty = []} = this.computedData(data) // 题量分布数据
    }
    
    this.renderChart(questionDifficulty);
  }
  componentDidUpdate() {
    const { edit = false } = this.props;
    if(edit) {
      var {questionDifficulty = []} = this.analysisData
    } else {
      const data = this.getDataFromApiData(this.props.questionList.toJS())
      // var questionDifficulty = this.props.questionDifficulty.toJS(); // 题量分布数据
      var {questionDifficulty = []} = this.computedData(data)
    }
    this.renderChart(questionDifficulty);
  }

  // 设置饼图
  renderChart(data) {
    // value 为 null 时饼图不会渲染
    const defaultData = [
      { name: "五级", value: null },
      { name: "四级", value: null },
      { name: "三级", value: null },
      { name: "二级", value: null },
      { name: "一级", value: null }
    ];
    // 数据存在且分数不为0 才渲染在饼图上
    const newData = defaultData.map(val => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].typeName === val.name && data[i].score !== 0) {
          return { name: val.name, value: data[i].score };
        }
      }
      return val;
    });
    this.myChart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "right",
        data: ["五级", "四级", "三级", "二级", "一级"]
      },
      color: ["#ff0000", "#f60", "#ffcc00", "#009dd9", "#3c3"],
      series: [
        {
          name: "试卷难度分析",
          type: "pie",
          radius: "55%",
          center: ["40%", "50%"],
          data: newData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    });
  }

  // 对接口返回的数据进行重新计算
  getDataFromApiData(paperContent) {
    const paperContentList = [];
    const typeArr = []

    if(!paperContent) return paperContentList;

    paperContent.forEach((val) => {
      if(typeArr.indexOf(val.name) >= 0) return
      typeArr.push(val.name)
      paperContentList.push({
        name: val.name,
        serialNumber: val.serialNumber,
        entryExamPaperQuesInputDTOList: val.examPaperContentQuestionOutputDTOList.map(val => {
          const questionOutputDTO = val.questionOutputDTO
          if(!!questionOutputDTO) {
            questionOutputDTO.serialNumber = val.serialNumber
            return questionOutputDTO
          }
          
          return {_PaperAnalysis: true}
        })
      })
    })
    return paperContentList;
  }

  computedData(data) {
    const grade = ["", "一级", "二级", "三级", "四级", "五级"]; // 定义难度等级
    const choiceQuestionType = 38; // 选择题
    const tfngType = 41; // 判断题
    const tempKnowledge = {}; // 临时存放知识点分析数据
    const tempQuestionDifficulty = {}; // 临时存放问题难度分析数据
    let tempCount = { // 临时存放总体分析数据
      objective: {
        typeName: "客观题",
        score: 0,
        count: 0
      },
      subjective: {
        typeName: "主观题",
        score: 0,
        count: 0
      },
    };
    let knowledge = []; // 知识点分析数据
    let questionNumber = []; // 题量分布数据
    let total = {count: [], score: []}; // 总体分析数据
    let questionDifficulty = []; // 问题难度数据
    let id = 0; // 自增id
    if(!data || data.length == 0) return {}
    for(let i = 0; i < data.length; i++){
      const tempData = data[i];
      const DTOList = tempData.entryExamPaperQuesInputDTOList;
      const listLength = DTOList.length; // 当前类型题目的数量
      const score = DTOList.reduce((a, b) => {
        const score = b.score || 0
        return a + score
      }, 0); // 当前类型题目的分数
      // 添加题量分布分析数据
      questionNumber.push({typeName: tempData.name, count: listLength, score});
      for(let j = 0; j<listLength; j++){
        const tempData1 = DTOList[j];
        const serialNumber = DTOList[j].serialNumber
        if(!tempData1._PaperAnalysis) {
          // 添加题目难度结构分析数据
          if(typeof tempQuestionDifficulty[tempData1.difficulty] === "undefined") {
            tempQuestionDifficulty[tempData1.difficulty] = {typeName: grade[tempData1.difficulty], type: tempData1.difficulty, score: tempData1.score, count: 1};
          }else {
            tempQuestionDifficulty[tempData1.difficulty].score += tempData1.score;
            tempQuestionDifficulty[tempData1.difficulty].count ++;
          }
          // 添加总体分析数据
          if((tempData1.parentTypeId === choiceQuestionType || tempData1.parentTypeId === tfngType) && tempData1.typeId != 47) { // 主管选择题不属于客观题范畴
            tempCount.objective.score += tempData1.score
            tempCount.objective.count ++
          } else {
            tempCount.subjective.score += tempData1.score
            tempCount.subjective.count ++
          }

          tempData1.knowledgeNameList && tempData1.knowledgeNameList.forEach(val => {
            // 添加知识点分析
            if(typeof tempKnowledge[val] === "undefined"){
              id++ ;
              tempKnowledge[val] = {id: id, questionIdList:{[tempData.name] : [serialNumber]}, name: val, score: tempData1.score};
            } else {
              tempKnowledge[val].score += tempData1.score;
              if(typeof tempKnowledge[val].questionIdList[tempData.name] === "undefined") {
                tempKnowledge[val].questionIdList[tempData.name] = [serialNumber]
              } else {
                // 去重
                if(tempKnowledge[val].questionIdList[tempData.name].indexOf(serialNumber) === -1){
                  tempKnowledge[val].questionIdList[tempData.name].push(serialNumber)
                }
              }
            }
          })
        }        
      }
    }
    // 对象转数组
    for(let key in tempKnowledge) {
      knowledge.push(tempKnowledge[key]);
    }
    // 对象转数组
    for(let key in tempQuestionDifficulty) {
      questionDifficulty.push(tempQuestionDifficulty[key]);
    }

    const totalScore = questionNumber.reduce((a, b) => a + b.score, 0); // 计算总分
    const totalCount = questionNumber.reduce((a, b) => a + b.count, 0); // 计算总题量
    const knowledgeTotalScore = knowledge.reduce((a, b) => a + b.score, 0); // 计算知识点总分
    // 添加 占比 字段
    knowledge = knowledge.map(val => {
      val.scorePer = val.score / knowledgeTotalScore;
      let str = ""
      for(let key in val.questionIdList){
        str += `${key}:${val.questionIdList[key].join(",")},`
      }
      str = str.slice(0, -1)
      val.questionIdList = str
      return val;
    });
    // 添加 占比 字段
    questionDifficulty = questionDifficulty.map(val => {
      val.scorePer = val.score / totalScore;
      val.countPer = val.count / totalCount;
      return val;
    });
    // 添加 占比 字段
    questionNumber = questionNumber.map(val => {
      val.scorePer = val.score / totalScore;
      val.countPer = val.count / totalCount;
      return val;
    });
    // 把tempCount对象内的数据 添加到总体分析数据中
    for(let key in tempCount) {
      total.count.push(tempCount[key]);
      total.score.push(tempCount[key]);
    }
    // 添加 占比 字段
    total.count = total.count.map(val => {
      val.scorePer = val.score / totalScore;
      val.countPer = val.count / totalCount;
      return val;
    });
    // 添加 占比 字段
    total.score = total.score.map(val => {
      val.scorePer = val.score / totalScore;
      val.countPer = val.count / totalCount;
      return val;
    })

    return {knowledge, questionNumber, total, questionDifficulty};
  }

  render() {
    const { paperName, edit = false, data } = this.props;
    if (edit) {
      var {knowledge = [], questionNumber = [], total = {}} = this.analysisData
    } else {
      const data = this.getDataFromApiData(this.props.questionList.toJS())
      var {knowledge = [], questionNumber = [], total = {}} = this.computedData(data)
    }
    
    const knowledgeColumns = [
      {
        title: '序号',
        key: 'id',
        render: (text, record, index) => `${index + 1}`
      },
      {
        title: '知识点',
        dataIndex: 'name',
      },
      {
        title: '分值（占比）',
        key: 'score',
        render: record => (
          <span>
            {record.score}({(record.scorePer * 100).toFixed(1)}
            %)
          </span>
        )
      },
      {
        title: '对应题号',
        dataIndex: 'questionIdList',
      }
    ];

    const questionNumColumns = [
      {
        title: '大题题型',
        dataIndex: 'typeName',
        className: 'type-name'
      },
      {
        title: '题目量（占比）',
        key: 'count',
        render: record => (
          <span>
            {record.count}({(record.countPer * 100).toFixed(1)}
            %)
          </span>
        )
      },
      {
        title: '分值（占比）',
        key: 'score',
        render: record => (
          <span>
            {record.score}({(record.scorePer * 100).toFixed(1)}
            %)
          </span>
        )
      }
    ];
    // 总分
    const totalPoint = total.score
      ? total.score.reduce((total, child) => total + child.score, 0)
      : 0;
    return (
      <RootDiv>
        <Header>
          {paperName}
          ——试卷分析
        </Header>
        <CloseBtn>
          <Button
            type="primary"
            size="small"
            onClick={() => this.props.onClose()}
          >
            关闭
          </Button>
        </CloseBtn>
        <Content>
          <div>
            <Title>试卷总体分布分析</Title>
            <div>
              <TopTableHeader>
                总分：
                {totalPoint}
              </TopTableHeader>
              <Flex>
                <TopTableTitle>分值分布</TopTableTitle>
                <div className="flex-1">
                  {total["score"] ? (
                    total["score"].map((val, index) => (
                      <Flex key={index}>
                        <TopTableChild style={{fontWeight: 700}}>
                          {val.typeName}
                          （占比）
                        </TopTableChild>
                        <TopTableChild>
                          {val.score}（{(val.scorePer * 100).toFixed(1)}
                          %）
                        </TopTableChild>
                      </Flex>
                    ))
                  ) : (
                    <TopTableChild>暂无数据</TopTableChild>
                  )}
                </div>
              </Flex>
              <Flex>
                <TopTableTitle>题量分布</TopTableTitle>
                <div className="flex-1">
                  {total["count"] ? (
                    total["count"].map((val, index) => (
                      <Flex key={index}>
                        <TopTableChild style={{fontWeight: 700}}>
                          {val.typeName}
                          （占比）
                        </TopTableChild>
                        <TopTableChild>
                          {val.count}（{(val.countPer * 100).toFixed(1)}
                          %）
                        </TopTableChild>
                      </Flex>
                    ))
                  ) : (
                    <TopTableChild>暂无数据</TopTableChild>
                  )}
                </div>
              </Flex>
            </div>
          </div>
          <Flex>
            <div className="flex-1" style={{ marginRight: "15px" }}>
              <Title>试卷题量分布分析</Title>
              <TableWrapper>
                <Table
                  columns={questionNumColumns}
                  dataSource={questionNumber}
                  pagination={false}
                  bordered={true}
                  rowKey={record => record.typeName}
                />
              </TableWrapper>
            </div>
            <div className="flex-1">
              <Title>试卷难度结构分析</Title>
              <CanvasWrapper innerRef={chars => (this.chars = chars)} />
            </div>
          </Flex>
          <TableWrapper>
            <Title>试卷知识点分析</Title>
            <Table
              columns={knowledgeColumns}
              dataSource={knowledge}
              pagination={false}
              bordered={true}
              rowKey={record =>  record.id}
            />
          </TableWrapper>
        </Content>
      </RootDiv>
    );
  }
}

PaperAnalysis.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  paperId: PropTypes.number,
  paperName: PropTypes.string.isRequired,
  edit: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
  PaperAnalysis: makeSelectPaperAnalysis(),
  questionList: makeSelectQuestionList()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperAnalysis);
