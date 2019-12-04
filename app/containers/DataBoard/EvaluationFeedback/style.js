import styled from 'styled-components';

export const Root = styled.div`
  background: #fff;
  padding: 10px 20px;
`;

export const Content = styled.div`
  margin-top: 10px;
  table{
    thead{
      th{
        text-align: center;
      }
    }

    td{
      text-align: center;
    }
  }
`;

export const ReportOverview = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #678;
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e9e9e9;
  background: #f8f9fa
`;

export const ReportFail = styled.div`
  height: 600px;
  line-height: 600px;
  text-align: center;
  font-size: 16px;
`;

export const DetailWrapper = styled.div`
  height: 600px;
  overflow: auto;
  table{
    thead{
      th{
        text-align: center;
      }
    }

    td{
      text-align: center;
    }
    .question-wrapper{
      text-align: left;
    }
  }
`;

export const QuestionWrapper = styled.div`
  .optionList-wrapper{
    padding-left: 5px;
    font-size: 14px;
    line-height: 1.5;
  }
  .analysis-wrapper{
    margin-top: 15px;
    font-size: 14px;
    .analysis-item-label{
      font-weight: 700;
    }
  }

  .answerList-wrapper{
    font-size: 14px;
    .answerList-item-label{
      font-weight: 700;
    }
  }
  .student-answer{
    margin: 20px 0;
    font-size: 14px;
    .answer{
      height: 14px;
      display: inline-block;
      padding: 5px;
      background: #ffe5e7;
    }
  }
  .bottom-block{
    display: flex;
    justify-content: flex-end;
    color: #999;
    span{
      margin-left: 20px;
    }
  }
`;
