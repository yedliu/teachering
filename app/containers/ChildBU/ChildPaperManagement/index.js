import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Spin } from 'antd';
import Home from './Home';
import EditPage from './EditPage';
import PreviewPaper from './module/PreviewPaper';
import QuestionPicker from './QuestionPicker';
import  * as actions from './redux/action';

const ChildPaper = styled.div`
  background: #fff;
  padding: 5;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const ScreenSpin = styled(Spin)`
  position: absolute !important;
  right: 0;
  top: 40%;
  left: 0;
  margin: auto;
`;

class ChildPaperManagement extends React.Component {
  componentDidMount() {
    this.getInitDataList();
  }

  getInitDataList = () => {
    const { dispatch } = this.props;
    dispatch(actions.getPaperList());
    dispatch(actions.getSubjectList());
    dispatch(actions.getPaperTypeList());
    dispatch(actions.getPaperDifficulty());
    dispatch(actions.getYearList());
    dispatch(actions.getQuestionTypeList());
    dispatch(actions.getStateList());
  }
  render() {
    const { showPage, preview, spinning } = this.props;
    console.log(spinning, 'spinning');
    return (
      <ChildPaper>
        {showPage === 'home' && <Home />}
        {showPage === 'edit' && <EditPage />}
        {showPage === 'picker' && <QuestionPicker />}
        {preview && <PreviewPaper /> }
        {spinning && <ScreenSpin spinning size="large" />}
      </ChildPaper>
    );
  }
}

const mapStateToProps = state => {
  const subState = state.get('childPaperManagement');
  const showPage = subState.get('currentPage');
  const preview = subState.get('preview');
  return {
    showPage,
    preview,
    spinning: subState.get('spinning'),
  };
};

export default connect(mapStateToProps)(ChildPaperManagement);
