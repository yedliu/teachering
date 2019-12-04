import React from 'react';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import { changePage, setErrorMessage, saveExamPaper, togglePaperPreview } from '../redux/action';

const confirm = Modal.confirm;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
`;

const EditHeader = ({ goQuestionPickerPage, goIndexPage, savePaper, paperPreview, title = '新增试卷' }) => {
  return (
    <HeaderWrapper>
      <div>
        <Button style={{ marginRight: 5 }} onClick={goQuestionPickerPage}>返回选题</Button>
        <Button type="danger" onClick={() => {
          confirm({
            title: '确立放弃组卷?',
            content: '放弃组卷当前数据不会保存',
            okText: '放弃组卷',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
              goIndexPage();
            },
            onCancel() {
              console.log('取消放弃组卷');
            },
          });
        }}>放弃组卷</Button>
      </div>
      <h3 className="title">{title}</h3>
      <div>
        <Button style={{ marginRight: 5 }} onClick={paperPreview}>预览</Button>
        <Button type="primary"  onClick={savePaper}>保存</Button>
      </div>
    </HeaderWrapper>
  );
};

const mapStateToProps = state => {
  const subState = state.get('childPaperManagement');
  const params = subState.get('paperParams');
  const id = params.get('id');
  return {
    title: id ? '编辑试卷' : '新增试卷',
  };
};

const mapDispatchToProps = (dispatch) => ({
  goQuestionPickerPage: () => {
    dispatch(changePage('picker'));
    dispatch(setErrorMessage(fromJS({})));
  },
  goIndexPage: () => {
    dispatch(changePage('home'));
    dispatch(setErrorMessage(fromJS({})));
  },
  savePaper: () => { dispatch(saveExamPaper()) },
  paperPreview: () => { dispatch(togglePaperPreview(true)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditHeader);