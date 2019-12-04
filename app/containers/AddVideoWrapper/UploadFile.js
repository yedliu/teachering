/**
 * Created by DELL02 on 2017/10/11.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import Immutable, { fromJS } from 'immutable';
import { AppLocalStorage } from 'utils/localStorage';
import { UploadAjax } from 'utils/helpfunc';
import { Config } from 'utils/config';
import { createStructuredSelector } from 'reselect';
import { FlexRowDiv, FlexColumnDiv } from 'components/Div';
import { Button,Row,Col,Checkbox,Modal,Input,Select,DatePicker,Form,Progress,message,Icon} from 'antd';
import { setUploadModalOpenAction, setUploadModalContentIndexAction, setUploadFileInfoAction, setUploadFileAction, setUploadFileInfoInitAction, setButtonLoadingAction } from './actions';
import { makeUploadModalOpen, makeUploadModalContentIndex, makeUploadFileInfo,makeLessonTypeData, makeGradeListData, makeSubjectListData, makeButtonLoadState } from './selectors';
const roles = [
  {label: '全职老师',value:'1'},
  {label: '兼职老师',value:'2'},
  {label: 'CC/CR',value:'3'}
];
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;
const ContentDiv = styled(FlexColumnDiv)`
  height:150px;
  width:100%;
  padding:0 40px;
  justify-content:space-between;
`;
const FileInput = styled(FlexRowDiv)`
  width:100%;
  height:30px;
  label{
    cursor:pointer;
    width:100px;
    height:30px;
    line-height:30px;
    text-align:center;
    border:1px solid #eee;
    border-radius:4px;
    transition:all 0.3s ease;
    &:hover{border-color:#108ee9;}
  }
  input[type=file]{
    opacity:0;
  }
`;
export class UploadFile extends React.PureComponent{
  constructor(props){
    super(props);
    this.makeUploadModalContent = this.makeUploadModalContent.bind(this);
    this.changeUploadFileAction = this.changeUploadFileAction.bind(this);
    this.setUploadVideoTime = this.setUploadVideoTime.bind(this);
    this.onSubmitAction = this.onSubmitAction.bind(this);
    this.uploadFileAction = this.uploadFileAction.bind(this);
    this.onValidTeacherNameAction = this.onValidTeacherNameAction.bind(this);
    this.onValidChooseWatcherAction = this.onValidChooseWatcherAction.bind(this);
    this.state = {
      showProgress:false,
      rate:0,
    }
  }
  componentDidMount(){
  }
  onSubmitAction() {
    //this.props.dispatch(setUploadFileAction());
  }
  changeUploadFileAction(e) {
    const LimitSize = 1024*1000*100;
    if(e.target.files[0].size > LimitSize){
      alert('视频大于100M!')
      return;
    }
    this.props.dispatch(setUploadFileInfoAction('file',fromJS(e.target.files[0])));
  }
  onValidTeacherNameAction() {
    this.props.form.validateFields(['teacherName','subject','grade','lessonType','lesStartTime'],(error,values) =>{
      if(!error){
        this.props.dispatch(setUploadModalContentIndexAction(2));
      }else{
       console.log('error')
      }
    })
  }
  onValidChooseWatcherAction() {
    this.props.form.validateFields(['checkboxGroup'],(error,values) =>{
      if(!error){
        this.props.dispatch(setButtonLoadingAction(true));
        this.uploadFileAction();
      }else{
        console.log('error');
      }
    })
  }
  uploadFileAction() {
    const me = this;
    var fd = new FormData();
    // var xhr = new XMLHttpRequest();
    const uploadFileInfo = this.props.uploadFileInfo;
    fd.append('file',uploadFileInfo.get('file'));
    fd.append('belongTypes',uploadFileInfo.get('belongTypes'));
    fd.append('grade',uploadFileInfo.get('grade'));
    fd.append('lesStartTime',uploadFileInfo.get('lesStartTime').format('YYYY-MM-DD'));
    fd.append('lessonType',uploadFileInfo.get('lessonType'));
    fd.append('subject',uploadFileInfo.get('subject'));
    fd.append('teacherName',uploadFileInfo.get('teacherName'));
    me.setState({showProgress:true});
    function uploadProgress(e){
      me.setState({rate:e.loaded / e.total})
    }
    UploadAjax({
      url:`${Config.trlink}/api/lessonGoodVideo/uploadMp4`,
      headers:{"mobile":AppLocalStorage.getMobile(),"password":AppLocalStorage.getPassWord()},
      data:fd,
      method:'POST',
      dataType:'json',
      // onuploadprogress:uploadProgress,
    }).then((result)=>{
      const repos  = result.response;
      if(repos.code == '0'){
        message.success('上传成功！',2)
        this.props.dispatch(setButtonLoadingAction(false));
        me.props.dispatch(setUploadModalOpenAction(false));
        me.props.dispatch(setUploadModalContentIndexAction(0));
        me.props.dispatch(setUploadFileInfoInitAction(fromJS({})));
        // me.setState({showProgress:false,rate:0})
      }else{
        message.error('上传失败！',2)
        this.props.dispatch(setButtonLoadingAction(false));
      }
    }).catch((err)=>{
      message.info('上传失败！',2)
      this.props.dispatch(setButtonLoadingAction(false));
    })

  }

  setUploadVideoTime(value) {
    if(!value){
      this.props.dispatch(setUploadFileInfoAction('lesStartTime',null));
      return;
    }
    this.props.dispatch(setUploadFileInfoAction('lesStartTime',value));
  }
  makeUploadModalContent(index) {
    console.log('filesss',this.props.uploadFileInfo.get('file')?this.props.uploadFileInfo.get('file').name:'' )
    const { getFieldDecorator } = this.props.form;
    const makeFirstContent=()=>{
      return <ContentDiv>
        <Row>
          <Col>添加文件：</Col>
        </Row>
        <Row>
          <Col span={24}>
            <FileInput>
              <label htmlFor="in_file"><span><Icon type="upload" />点击添加文件</span><input value={this.props.uploadFileInfo.getIn(['file','name'])} type="file" accept="audio/mp4, video/mp4" id="in_file" name="file" onChange={(e) => this.changeUploadFileAction(e)}/></label>
              <span>{this.props.uploadFileInfo.get('file') ? this.props.uploadFileInfo.get('file').name :''}</span>
            </FileInput>
          </Col>
        </Row>
        <Row type={'flex'} justify={'center'}>
          <Col>当前只支持MP4文件，视频不大于100M</Col>
        </Row>
        <Row type={'flex'} justify={'center'}>
          <Button onClick={()=>{
            this.props.dispatch(setUploadModalContentIndexAction(1))
          }}>下一步</Button>
        </Row>
      </ContentDiv>
    }
    const makeNextContent = () =>{
      return <ContentDiv>
        <Row>
          <Col>添加信息：</Col>
        </Row>
        <Row type={'flex'}>
          <Col span={6}>
            <FormItem>
            {getFieldDecorator('teacherName',{
              onChange:(e) =>{
                this.props.dispatch(setUploadFileInfoAction('teacherName',e.target.value));
              },
              initialValue:this.props.uploadFileInfo.get('teacherName',''),
              rules: [
                { required: true, message: '请填写老师姓名！' }
              ]
            })(<Input placeholder="老师姓名"/>)}
            </FormItem>
          </Col>
          <Col span={6} style={{margin:'0 30px'}}>
            <FormItem>
              {getFieldDecorator('subject',{
                onChange:(value)=>{
                  this.props.dispatch(setUploadFileInfoAction('subject',value));
                },
                initialValue:this.props.uploadFileInfo.get('subject',''),
                rules:[{required:true,message:'请选择科目！'}]
              })(<Select style={{width:'120px'}}>
                {this.props.subjects.map((item,index)=>{
                  return <Option key={index} value={item.get('itemValue')}>{item.get('itemCode')}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('grade',{
                onChange:(value) =>{
                  this.props.dispatch(setUploadFileInfoAction('grade',value));
                },
                initialValue:this.props.uploadFileInfo.get('grade',''),
                rules:[{required:true,message:'请选择年级！'}]
              })(<Select style={{width:'120px'}}>
                {this.props.grade.map((item,index)=>{
                  return <Option key={index} value={item.get('itemValue')}>{item.get('itemCode')}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row type={'flex'}>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('lessonType',{
                onChange:(value)=>{
                  this.props.dispatch(setUploadFileInfoAction('lessonType',value));
                },
                initialValue:this.props.uploadFileInfo.get('lessonType',''),
                rules:[{required:true,message:'请选择课程类型！'}]
              })(<Select style={{width:'120px'}}>
                {this.props.lessontypes.map((item,index)=>{
                  return <Option key={index} value={item.get('itemValue')}>{ index===0 ? item.get('itemCode') : item.get('itemValue')}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
          <Col span={6} style={{margin:'0 30px'}}>
            <FormItem>
              {getFieldDecorator('lesStartTime',{
                onChange:this.setUploadVideoTime,
                initialValue:this.props.uploadFileInfo.get('lesStartTime',null),
                rules:[{required:true,message:'请选择时间！'}]
              })(<DatePicker></DatePicker>)}
            </FormItem>
            {/*<DatePicker*/}
              {/*value={this.props.uploadFileInfo.get('lesStartTime',null)}*/}
              {/*onChange={this.setUploadVideoTime}*/}
            {/*></DatePicker>*/}
          </Col>
        </Row>
        <Row type={'flex'} justify={'center'}>
          <Col span={6}>
            <Button onClick={()=>{
              this.props.dispatch(setUploadModalContentIndexAction(0))
            }}>上一步</Button>
          </Col>
          <Col span={6}>
            <Button onClick={this.onValidTeacherNameAction}>下一步</Button>
          </Col>
        </Row>
      </ContentDiv>
    }
    const makeLastedContent = () =>{
      //const { getFieldDecorator } = this.props.form;
      return <ContentDiv>
        <Row type={'flex'}>
          <Col span={6}>请选择观看对象：</Col>
        </Row>
        <Row type={'flex'} justify={'center'}>
          <Form>
            <FormItem>
              {getFieldDecorator('checkboxGroup',{
                onChange:(checkedValues) =>{
                  this.props.dispatch(setUploadFileInfoAction('belongTypes',checkedValues.join(',')))
                },
                initialValue:this.props.uploadFileInfo.get('belongTypes') ? this.props.uploadFileInfo.get('belongTypes').split(',') : [],
                rules: [
                  { required: true, message: '请至少选择一个观看对象' }
                ]
              })(<CheckboxGroup options={roles}></CheckboxGroup>)}

            </FormItem>
          </Form>
        </Row>
        <Row type={'flex'} justify={'center'}>
          <Col span={6}>
            <Button type="primary" onClick={()=>{
              this.props.dispatch(setUploadModalContentIndexAction(1))
            }}>上一步</Button>
          </Col>
          <Col span={6}>
            <Button type="primary" loading={this.props.buttonLoading} onClick={this.onValidChooseWatcherAction}>确定</Button>
          </Col>
        </Row>
        {/*<Row style={{marginTop:'20px'}}>*/}
          {/*{this.state.showProgress ? (<Progress percent={this.state.rate.toFixed(2)*100}></Progress>) : ''}*/}
        {/*</Row>*/}
      </ContentDiv>
    }
    switch (index) {
      case 0:
        return <div>{makeFirstContent()}</div>;
      case 1:
        return <div>{makeNextContent()}</div>;
      case 2:
        return <div>{makeLastedContent()}</div>
      default:
        return <div>......</div>
    }
  }
  render(){
    console.log('infoooo',this.props.uploadFileInfo.toJS())
    return (
      <Modal
        visible={this.props.modalOpen}
        title="上传视频"
        footer=""
        width={'600px'}
        maskClosable={false}
        onCancel={this.props.onCloseModalAction}
      >

        {this.makeUploadModalContent(this.props.contentIndex)}
      </Modal>
    )
  }
}
UploadFile.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  contentIndex:PropTypes.number.isRequired,
  uploadFileInfo:PropTypes.instanceOf(Immutable.Map).isRequired,
  grade:PropTypes.instanceOf(Immutable.List).isRequired,
  subjects:PropTypes.instanceOf(Immutable.List).isRequired,
  lessontypes:PropTypes.instanceOf(Immutable.List).isRequired,
  onCloseModalAction:PropTypes.func.isRequired,
  buttonLoading:PropTypes.bool.isRequired,

};

const mapStateToProps = createStructuredSelector({
  modalOpen:makeUploadModalOpen(),
  contentIndex: makeUploadModalContentIndex(),
  uploadFileInfo: makeUploadFileInfo(),
  grade: makeGradeListData(),
  subjects: makeSubjectListData(),
  lessontypes: makeLessonTypeData(),
  buttonLoading:makeButtonLoadState(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onCloseModalAction: () => {
      dispatch(setUploadModalOpenAction(false));
      dispatch(setUploadFileInfoInitAction(fromJS({})));
      dispatch(setUploadModalContentIndexAction(0));
    },
  };
}
UploadFile = createForm()(UploadFile);
export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
