/*
 *
 * ReplaceTopuestionModalicModal
 *
 */

import React, { PropTypes } from 'react';
import styled, { css } from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import { Button } from 'antd';
// import { PlaceHolderBox } from 'components/CommonFn/style';
import { FlexColumn, FlexRowCenter, FlexCenter } from 'components/FlexBox';
// images
const emptyImg = window._baseUrl.imgCdn + '2cfcc00d-8360-42c7-b371-4253fd4735cb.png';
const loading = window._baseUrl.imgCdn + '0ac05111-ab12-46ff-ba1e-7aa21875f810.gif';
import AIQuestionItemEdit from './AIQuestionItemShow';
// import { dataListOne } from './datamock';

const absoluteCss = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const Masking = styled.div`
  ${absoluteCss}
  width: 100%;
  height: 100%;
  background:rgba(0,0,0,.3);
  z-index: 999;
`;
const Content = styled(FlexColumn)`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  max-height: 100%;
  background: white;
  width: 640px;
  min-width: 640px;
`;
const Loading = styled(FlexCenter)`
  flex: 1;
  min-height: 200px;
  overflow-y: auto;
`;
const LoadingGif = styled.div`
  background: url(${loading}) no-repeat;
  background-size: 100% 100%;
  width: 40px;
  height: 40px;
  margin: 0 10px;
`;
const Questions = styled(FlexColumn)`
  flex: 1;
  /* height: 100%; */
`;
const Header = styled(FlexRowCenter)`
  padding: 5px;
  .button {
    width: 40px;
    height: 40px;
    font-size: 14px;
    margin: 0 3px;
  }
  .switch {
    right: 5px;
    position: absolute;
    color: #108ee9;
  }
`;
const Bottom = styled(FlexCenter)`
  height: 80px;
  button {
    margin: 0 10px;
  }
`;

export class ReplaceQuestionModal extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: 1,
    };
  }
  componentDidMount() {
    const { switchBatch, homeworkType } = this.props;
    if (switchBatch) switchBatch(homeworkType);
  }

  render() {
    const { close, choose, switchBatch, AIHomeworkParams, homeworkType } = this.props;
    const { selectIndex } = this.state;
    const AIChangeQuestionTarget = AIHomeworkParams.get('AIChangeQuestionTarget') || fromJS({});
    const AIChangeQuestionList = AIHomeworkParams.get('AIChangeQuestionList') || fromJS([]);
    const questionList = AIChangeQuestionList.unshift(AIChangeQuestionTarget);
    const isLoading = AIHomeworkParams.get('isLoadingChangeItem');
    // console.log('questionList', questionList);
    return (<Masking onClick={() => loading && close()}>
      <Content onClick={(e) => e.stopPropagation()}>
        {isLoading ? (<Loading>
          <LoadingGif />正在为您更换题目，请稍等...
        </Loading>) :
          (<Questions>
            <Header>
              {questionList.map((item, index) => {
                return (<Button
                  key={index}
                  type={selectIndex === index ? 'primary' : ''}
                  size="large" shape="circle" className="button"
                  onClick={() => {
                    this.setState({
                      selectIndex: index
                    });
                  }}
                >{index === 0 ? '原题' : index}</Button>);
              })}
              <div className="switch">
                <Button
                  className="button" type="primary" shape="circle" icon="sync"
                  onClick={() => {
                    this.setState({ selectIndex: 1 });
                    switchBatch(homeworkType);
                  }}
                />换一批
            </div>
            </Header>
            <FlexColumn style={{ padding: 10, overflowY: 'auto', flex: 1 }}>
              {AIChangeQuestionList.count() > 0 ?
                <AIQuestionItemEdit
                  questionData={questionList.get(selectIndex)}
                  index={selectIndex === 0 ? '【原题】' : selectIndex}
                /> : (<FlexCenter style={{ fontSize: 16, color: '#666', flex: 1, textAlign: 'center' }}>
                  <div>
                    <img role="presentation" src={emptyImg} />
                    <p style={{ marginTop: 10 }}>未搜索到合适题目</p>
                  </div>
                </FlexCenter>)}
            </FlexColumn>
            <Bottom>
              <Button size="large" onClick={close}>取消</Button>
              <Button disabled={selectIndex === 0 || AIChangeQuestionList.count() <= 0} type="primary" size="large" onClick={() => choose(questionList.get(selectIndex))}>替换</Button>
            </Bottom>
          </Questions>
          )}
      </Content></Masking>);
  }
}

ReplaceQuestionModal.propTypes = {
  close: PropTypes.func.isRequired, // 关闭事件
  choose: PropTypes.func.isRequired, // 替换事件
  switchBatch: PropTypes.func.isRequired, // 换一批事件
  AIHomeworkParams: PropTypes.instanceOf(Immutable.Map).isRequired,
  homeworkType: PropTypes.number.isRequired,
};

export default ReplaceQuestionModal;
