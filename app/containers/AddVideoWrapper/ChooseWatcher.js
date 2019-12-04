/**
 * Created by DELL02 on 2017/10/11.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import { createStructuredSelector } from 'reselect';
import { FlexRowDiv, FlexColumnDiv } from 'components/Div';
import { Button,Row, Col, Checkbox, Modal,Form} from 'antd';
import { setChooseWatcherOpenAction,setChooseWatcherRolesAction, setAddLessonVideoAction, setBatchAddVideoAction } from './actions';
import { makeChooseWatcherOpen,makeChooseWatcherRoles, makeIsBatchAddVideoValue } from './selectors';
const roles = [
  {label: '全职老师',value:1},
  {label: '兼职老师',value:2},
  {label: 'CC/CR',value:3}
];
const createForm = Form.create;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const ContentDiv = styled(FlexColumnDiv)`
  height:150px;
  width:100%;
  justify-content:space-between;
`;
export class ChooseWatcher extends React.PureComponent{
  constructor(props){
    super(props);
    this.onSubmitAction = this.onSubmitAction.bind(this);
  }
  onSubmitAction() {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        if(this.props.isBatchAddVideo){
          this.props.dispatch(setBatchAddVideoAction());
        }else{
          this.props.dispatch(setAddLessonVideoAction());
        }

      } else {
        console.log('error', error, values);
      }
    });

  }
  render(){
    const { getFieldDecorator } = this.props.form;
    console.log('chooserolessss',this.props.selectRoles.toJS())
    return (
     <Modal
       visible={this.props.modalOpen}
       title="设置"
       footer=""
       maskClosable={false}
       onCancel={this.props.onModalCloseAction}
     >
       <ContentDiv>
      <Row type={'flex'}>
        <Col span={6}>请选择观看对象：</Col>
      </Row>
       <Row type={'flex'} justify={'center'} style={{width:'100%'}}>
         <Form>
           <FormItem>
             {getFieldDecorator('checkboxGroup',{
               rules: [
                 { required: true, message: '请至少选择一个观看对象' }
               ]
             })(<CheckboxGroup options={roles}></CheckboxGroup>)}

           </FormItem>
         </Form>
       </Row>
       <Row type={'flex'} justify={'center'}>
         <Col span={6}>
           <Button type="primary" onClick={this.onSubmitAction}>确定</Button>
         </Col>
       </Row>
       </ContentDiv>
     </Modal>
    )
  }
}

ChooseWatcher.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalOpen:PropTypes.bool.isRequired,
  selectRoles:PropTypes.instanceOf(Immutable.List).isRequired,
  onModalCloseAction: PropTypes.func.isRequired,
  isBatchAddVideo:PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  modalOpen: makeChooseWatcherOpen(),
  selectRoles: makeChooseWatcherRoles(),
  isBatchAddVideo: makeIsBatchAddVideoValue(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onModalCloseAction:() => {
      dispatch(setChooseWatcherOpenAction(false));
      dispatch(setChooseWatcherRolesAction(fromJS([])))
    }
  };
}
ChooseWatcher = createForm({
  onFieldsChange(props,changedFields){
    props.dispatch(setChooseWatcherRolesAction(fromJS(changedFields.checkboxGroup.value)))
},
mapPropsToFields(props) {
  return {
    checkboxGroup:{
      ...props.selectRoles.toJS(),
      value:props.selectRoles.toJS()
    }
  }
}
})(ChooseWatcher);
export default connect(mapStateToProps, mapDispatchToProps)(ChooseWatcher);
