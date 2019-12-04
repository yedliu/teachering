/*
 *
 * ReplaceTopuestionModalicModal
 *
 */

import React, { PropTypes } from 'react';
// import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import { Button } from 'antd';

// images
const loading = window._baseUrl.imgCdn + '0ac05111-ab12-46ff-ba1e-7aa21875f810.gif';

const absoluteCss = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const FlexCenter = styled.div`
  display: flex;
  align-items: center;
`;
const Masking = styled.div`
  ${absoluteCss}
  width: 100%;
  height: 100%;
  background:rgba(0,0,0,.3);
  z-index: 999;
`;
const Content = styled.div`
  background: white;
  ${absoluteCss}
  left: auto;
  width: 640px;
  min-width: 640px;
`;
const Loading = styled(FlexCenter)`
  ${absoluteCss}
  height: 50px;
  justify-content: center;
  margin: auto;
`;
const LoadingGif = styled.div`
  background: url(${loading}) no-repeat;
  background-size: 100% 100%;
  width: 40px;
  height: 40px;
  margin: 0 10px;
`;
const Questions = styled.div`

`;
const Header = styled(FlexCenter)`
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
  ${absoluteCss}
  top: auto;
  height: 80px;
  justify-content: center;
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

  render() {
    const { isLoading, close, choose, switchBatch, AIHomeworkParams } = this.props;
    const AIChangeQuestionTarget = AIHomeworkParams.get('AIChangeQuestionTarget') || fromJS({});
    const AIChangeQuestionList = AIHomeworkParams.get('AIChangeQuestionList') || fromJS([]);
    const questionList = AIChangeQuestionList.unshift(AIChangeQuestionTarget);
    const { selectIndex } = this.state;
    // console.log('questionList', questionList);
    return (
      <Masking
        onClick={() => {
          if (isLoading) {
            close();
          }
        }}
      >
        <Content onClick={(e) => e.stopPropagation()}>
          {isLoading ? (
            <Loading>
              <LoadingGif />正在为您更换题目，请稍等...
            </Loading>
          ) : (
            <Questions>
              <Header>
                {questionList.map((item, index) => {
                  return (<Button
                    key={item.id}
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
                    onClick={switchBatch}
                  />换一批
                </div>
              </Header>
              <Bottom>
                <Button size="large" onClick={close}>取消</Button>
                <Button disabled={selectIndex === 0} type="primary" size="large" onClick={() => choose(questionList.get(selectIndex))}>替换</Button>
              </Bottom>
            </Questions>
          )}
        </Content>
      </Masking>
    );
  }
}

ReplaceQuestionModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  questionList: PropTypes.array,
  isLoading: PropTypes.bool,
  close: PropTypes.func.isRequired, // 关闭事件
  choose: PropTypes.func.isRequired, // 替换事件
  switchBatch: PropTypes.func.isRequired, // 换一批事件
  AIHomeworkParams: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default ReplaceQuestionModal;
