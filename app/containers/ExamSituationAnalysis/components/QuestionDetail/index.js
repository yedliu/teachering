import React from 'react';
import { Modal, Pagination, Spin  } from 'antd';
import styled from 'styled-components';
import { ZmExamda } from 'zm-tk-ace';
import Moment from 'moment';
import ErrorCorrect from 'components/ErrorCorrect';
import sourceModule from 'components/ErrorCorrect/sourceModule';
const Page = styled.div`
  width:100%;
  text-align: center;
`;
const Info = styled.div`
  width:100%;
  background: #eee;
  padding: 10px;
`;
const Footer = styled.div`
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  line-height: 28px;
`;
const difficulties = ['', '一级', '二级', '三级', '四级', '五级'];
class QuestionDetail extends React.Component {
  renderFooter = () => {
    const { questionData } = this.props;
    return (
      <Footer>
        <div>
          <strong>更新时间：</strong>
          <span>{questionData.updatedTime ? Moment(questionData.updatedTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
          <strong style={{ marginLeft: 20 }}>使用次数：</strong>
          <span>{questionData.quoteCount || 0}</span>
          <strong style={{ marginLeft: 20 }}>难度：</strong>
          <span>{questionData.difficulty ? difficulties[questionData.difficulty] : '--'}</span>
        </div>
        <div style={{ display: 'flex' }}>
          <ErrorCorrect
            questionId={questionData.id}
            sourceModule={sourceModule.paper.testAnalysis}
          />
          {/* <Button type="primary" style={{ marginLeft: 20 }}>收藏</Button> */}
        </div>
      </Footer>
    );
  }
  makeKnowledgeNames =(questionData) => {
    if (!questionData) return '--';
    let main = questionData.mainKnowledgeName;
    let secondary = questionData.knowledgeNameList || [];
    if (main) {
      secondary.unshift(main);
    }
    secondary = secondary.filter(item => item !== null);
    return secondary.length > 0 ? secondary.join('，') : '--';
  }
  render() {
    const { close, questionData, questionIds, onPageChange, loading } = this.props;
    const options = ['title', 'answerList', 'analysis', 'children'];
    let knowledgeNames = this.makeKnowledgeNames(questionData);
    return (
      <Modal
        title="试题详情"
        visible={true}
        footer={this.renderFooter()}
        onCancel={close}
        width={1100}
        maskClosable={false}
      >
        <Spin spinning={loading}>
          <Page>
            <Pagination defaultCurrent={1} total={questionIds.length} onChange={onPageChange} pageSize={1} showQuickJumper />
          </Page>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <ZmExamda
              question={questionData}
              options={options}
              showRightAnswer
            />
          </div>
          <Info>
            <p>
              <strong>知识点：</strong>
              <span>{knowledgeNames}</span>
              <strong style={{ marginLeft: 20 }}>分值：</strong>
              <span>{questionData.score || 0}</span>
            </p>
            <p>
              <strong>来源：</strong>
              <span>{questionData.sourceExamPaperName || '--'}</span>
            </p>
          </Info>
        </Spin>
      </Modal>
    );
  }
}
export default QuestionDetail;
