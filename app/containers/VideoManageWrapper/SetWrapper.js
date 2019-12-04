
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import { AppLocalStorage } from 'utils/localStorage';
import { fileRender, UploadAjax } from 'utils/helpfunc';
import { Config } from 'utils/config';
import { Button,Row, Col, Checkbox, Modal,Select,Input,message,Form} from 'antd';
import { FadeInDiv, fadeIn, FlexRowDiv, FlexColumnDiv, DivShadow } from 'components/Div';
import { makeSetWrapperOpenValue, makeFirstDirectionItem, makeTreeDirectionData, makeSetCoverInfoValue, makeSelectedOperateVideoItem, makeSecondDirectionItem,
  makeThirdDirectionItem} from './selectors';
import { setSetWrapperOpenAction, getFirstDirectionItemAction, setVideoCoverInfoAction, setVideoCoverAction, setChangOperateVideoValueAction, setChangeSelectDirectionIdAction,
  submitOperateVideoAction} from './actions';
const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;
const CoverDiv = styled.div`
  width:200px;
  height:80px;
  border:1px solid #ddd;
  img{
    width:100%;
    height:80px;
  }
`;
const ItemDiv = styled.div`
  margin:10px 0;
`;
const RowItemDiv = styled(FlexRowDiv)`
   width:200px;
  height:80px;
`;
const InputImg = styled(CoverDiv)`
  position:relative;
  label{
    position:absolute;
  }
`;
export class SetWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props){
    super(props);
    this.makeMenu = this.makeMenu.bind(this);
    this.uploadCoverAction = this.uploadCoverAction.bind(this);
    this.onSubmitAction = this.onSubmitAction.bind(this);
  }
  makeMenu(){

  }
  onSubmitAction() {
    this.props.form.validateFields(['firstDirection','speaker','title'],(error,value) =>{
      if(!error){
        this.props.dispatch(submitOperateVideoAction())
      }else{
        console.log('error',value)
      }
    })
  }
  componentDidMount(){
    console.log('123')
  }
  uploadCoverAction() {
    const me = this;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    const uploadFileInfo = this.props.setCoverInfo;
    fd.append('file',uploadFileInfo.get('file'));
    fd.append('id',uploadFileInfo.get('id'));
    UploadAjax({
      url:`${Config.trlink}/api/lessonGoodVideo/uploadCover`,
      method:'POST',
      headers:{mobile:AppLocalStorage.getMobile(),password:AppLocalStorage.getPassWord()},
      data:fd,
      dataType:'json',
      async:true,
    }).then((result) =>{
      const repos = result.response;
      if(repos.code == '0'){
        message.success(repos.message,2)
      }else{
        message.error('上传失败！',2)
      }

    }).catch((err) =>{
      console.log('errrr',err)
      message.error('上传失败！',2)
    })
  }
  componentDidMount(){
    //this.props.dispatch(getFirstDirectionItemAction());
  }

  render() {
    console.log('set_selectedvideo>>',this.props.selectedOperateVideo.toJS())
    const { getFieldDecorator } = this.props.form;
    // console.log('second_direction',this.props.firstDirection.toJS())
    return (
        <Modal
          visible={this.props.modalOpen}
          title="设置"
          footer=""
          width={'620px'}
          maskClosable={false}
          onCancel={()=> this.props.dispatch(setSetWrapperOpenAction(false))}
        >
          <Form>
          <ItemDiv>
            <FormItem>
              {getFieldDecorator('firstDirection',{
                trigger:'onSelect',
                onSelect:(value,option) =>{
                  this.props.onChangeFirstDirection(value,option)
                },
                rules: [{ required: true, message: '请选择一级目录' }]
              })(<Select style={{width:'130px'}} placeholder="一级目录">
                {/*<Option key="-1" value="undefined"></Option>*/}
                {this.props.firstDirection.map((item,index)=>{
                  return <Option key={index} value={`${item.get('id')}`}>{item.get('name')}</Option>
                })}
              </Select>)}
            </FormItem>
          </ItemDiv>
          <ItemDiv >
            <FormItem>
              {getFieldDecorator('secondDirection',{
                trigger:'onSelect',
                rules: [{ required: false, message: '请选择二级目录' }],
                onSelect:(value,option) => {
                  this.props.onChangeSecondDirection(value,option);
                }
              })(<Select style={{width:'130px'}} placeholder="二级目录">
                {this.props.secondDirection.map((item,index)=>{
                  return <Option key={index} value={`${item.get('id')}`}>{item.get('name')}</Option>
                })}
              </Select>)}
            </FormItem>
          </ItemDiv>
          <ItemDiv>
            <FormItem>
              {getFieldDecorator('thirdDirection',{
                trigger:'onSelect',
                rules: [{ required: false, message: '请选择三级目录' }],
                onSelect:(value,option) => {
                  this.props.onChangeThirdDirection(value,option)
                }
              })(<Select style={{width:'130px'}} placeholder="三级目录">
                {this.props.thirdDirection.map((item, index) => {
                  return <Option key={index} value={`${item.get('id')}`}>{item.get('name')}</Option>
                })}
              </Select>)}
            </FormItem>
          </ItemDiv>
          <Row type={'flex'} style={{margin:'10px 0'}}>
            <Col span={2}>
              封面：
            </Col>
            <Col span={20}>
              {this.props.selectedOperateVideo.get('cover') ? (<InputImg><img ref={(img) => this.img = img} src={this.props.selectedOperateVideo.get('cover')} alt=""/>
                <label>
                  <input type="file" accept="image/jpeg,image/png" onChange={(e) =>{
                    if(e.target.files[0]){
                      fileRender(this,e.target.files[0]);
                      this.props.dispatch(setVideoCoverInfoAction('file',e.target.files[0]));
                      this.props.dispatch(setVideoCoverInfoAction('id',this.props.selectedOperateVideo.get('id')));
                      setTimeout(()=>{
                        this.uploadCoverAction();
                      },200)
                    }
                  }}/>
                </label>
              </InputImg>):(<InputImg>
                <img src="" ref={(img) => this.img = img}/>
                <label>
                  <input type="file" accept="image/jpeg,image/png" onChange={(e) =>{
                    fileRender(this,e.target.files[0]);
                    this.props.dispatch(setVideoCoverInfoAction('file',e.target.files[0]));
                    this.props.dispatch(setVideoCoverInfoAction('id',this.props.selectedOperateVideo.get('id')));
                    setTimeout(()=>{
                      this.uploadCoverAction();
                    },200)
                  }}/>
                </label>
              </InputImg>)}
            </Col>
          </Row>
          <Row type={'flex'} style={{margin:'10px 0'}}>
            <Col span={2}>标题:</Col>
            <Col>
              <FormItem>
                {getFieldDecorator('title',{
                  rules: [{ required: true, message: '请填写标题！'}],
                  onChange:(e) =>{
                    this.props.onChangeTitleAction(e.target.value);
                  }
                })(<Input maxLength={'15'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type={'flex'} style={{margin:'10px 0'}}>
            <Col span={2}>主讲人:</Col>
            <Col>
              <FormItem>
                {getFieldDecorator('speaker',{
                  rules: [{ required: true, message: '请填写主讲人！'}],
                  onChange:(e) =>{
                    this.props.onChangeSpeakerAction(e.target.value);
                  }
                })(<Input maxLength={'10'}/>)}
              </FormItem>
            </Col>
            <Col style={{margin:'0 10px'}}>
              <Checkbox
                checked={this.props.selectedOperateVideo.get('autoState')}
                onChange={this.props.onChangeStateAction}
              >提交后自动上架</Checkbox>
            </Col>
          </Row>
          <Row type={'flex'} justify={'center'}>
            <Button onClick={()=>{
              this.onSubmitAction();
            }}>确定</Button>
          </Row>
          </Form>
        </Modal>
    );
  }
}

SetWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalOpen:PropTypes.bool.isRequired,
  firstDirection:PropTypes.instanceOf(Immutable.List).isRequired,
  secondDirection:PropTypes.instanceOf(Immutable.List).isRequired,
  thirdDirection:PropTypes.instanceOf(Immutable.List).isRequired,
  directionTree:PropTypes.instanceOf(Immutable.List).isRequired,
  setCoverInfo:PropTypes.instanceOf(Immutable.Map).isRequired,
  selectedOperateVideo:PropTypes.instanceOf(Immutable.Map).isRequired,
  onChangeFirstDirection: PropTypes.func.isRequired,
  onChangeSecondDirection:PropTypes.func.isRequired,
  onChangeThirdDirection:PropTypes.func.isRequired,
  onChangeTitleAction:PropTypes.func.isRequired,
  onChangeSpeakerAction:PropTypes.func.isRequired,
  onChangeStateAction:PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({
  modalOpen: makeSetWrapperOpenValue(),
  firstDirection: makeFirstDirectionItem(),
  secondDirection: makeSecondDirectionItem(),
  thirdDirection: makeThirdDirectionItem(),
  directionTree: makeTreeDirectionData(),
  setCoverInfo: makeSetCoverInfoValue(),
  selectedOperateVideo: makeSelectedOperateVideoItem(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeFirstDirection: (value,option) => {
      console.log('propssss',value,option.props.children)
      dispatch(setChangOperateVideoValueAction('firstLevelDirectoryName',option.props.children))
      dispatch(setChangOperateVideoValueAction('firstLevelDirectoryId',value));
      dispatch(setChangOperateVideoValueAction('secondLevelDirectoryName',undefined));
      dispatch(setChangOperateVideoValueAction('secondLevelDirectoryId',''));
      dispatch(setChangOperateVideoValueAction('thirdLevelDirectoryId',''));
      dispatch(setChangOperateVideoValueAction('thirdLevelDirectoryName',undefined));
      dispatch(setChangeSelectDirectionIdAction(fromJS({label:'二级目录',id:value})));
      dispatch(getFirstDirectionItemAction());
    },
    onChangeSecondDirection: (value,option) =>{
      dispatch(setChangOperateVideoValueAction('secondLevelDirectoryName',option.props.children));
      dispatch(setChangOperateVideoValueAction('secondLevelDirectoryId',value));
      dispatch(setChangOperateVideoValueAction('thirdLevelDirectoryName',undefined));
      dispatch(setChangOperateVideoValueAction('thirdLevelDirectoryId',''));
      dispatch(setChangeSelectDirectionIdAction(fromJS({label:'三级目录',id:value})));
      dispatch(getFirstDirectionItemAction());
    },
    onChangeThirdDirection:(value,option) =>{
      dispatch(setChangOperateVideoValueAction('thirdLevelDirectoryName',option.props.children));
      dispatch(setChangOperateVideoValueAction('thirdLevelDirectoryId',value));
    },
    onChangeTitleAction: (value) => dispatch(setChangOperateVideoValueAction('title',value)),
    onChangeSpeakerAction: (value) => dispatch(setChangOperateVideoValueAction('speaker',value)),
    onChangeStateAction:(e) => dispatch(setChangOperateVideoValueAction('autoState',e.target.checked ? 1 : 0))
  };
}
SetWrapper = createForm({
  onFieldsChange:(props,changedFields) =>{
    // console.log('props,chencField',props,changedFields)
   // if(changedFields){}
  },
  mapPropsToFields:(props) =>{
    return {
      'firstDirection':{
        value:props.selectedOperateVideo.get('firstLevelDirectoryName')||undefined
      },
      'secondDirection':{
        value:props.selectedOperateVideo.get('secondLevelDirectoryName')||undefined
      },
      'thirdDirection':{
        value:props.selectedOperateVideo.get('thirdLevelDirectoryName')||undefined
      },
      'title':{
        value:props.selectedOperateVideo.get('title')||''
      },
      'speaker':{
        value:props.selectedOperateVideo.get('speaker')||''
      }
    }
  }
})(SetWrapper)
export default connect(mapStateToProps, mapDispatchToProps)(SetWrapper);


