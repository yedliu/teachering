
/**
 * Created by DELL02 on 2017/10/11.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import Immutable, { fromJS } from 'immutable';
import moment from 'moment';
import { FlexRowDiv, FlexColumnDiv } from 'components/Div';
import { Button,Row, Col, Checkbox, Modal, Radio,Select,Input,InputNumber,DatePicker} from 'antd';
import { setSearchPanelOpenAction, changeSearchPanelAction, setSearchFieldItemsAction, setSearchItemsInitAction, getVideoRecordListAction, setSearchBySetItems, setSearchBySetItemInit, getFirstDirectionItemAction, setChangeSelectDirectionIdAction } from './actions';
import { makeSearchPanelOpen , makeSearchPanelContentIndex, makeSearchItemsValue, makeSearchBySetItems, makeFirstDirectionItem, makeSecondDirectionItem,makeThirdDirectionItem} from './selectors';
import { makeLessonTypeData, makeGradeListData, makeSubjectListData } from 'containers/LeftNavC/selectors';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const ContentDiv = styled(FlexColumnDiv)`
  min-height:300px;
  height:350px;
  width:100%;
  padding:20px 0;
  justify-content:space-between;
  .ant-checkbox-wrapper + .ant-checkbox-wrapper{
    margin-left:0;
  }
`;
const Span = styled.span`
  margin:0 5px;
`;
const MenuItem = [{label:0,value:'按课程属性筛选'},{label:1,value:'按视频设置筛选'}];
const LessonType = {itemValue:'',itemCode:'课程类型'};
const VideoState = [{label:'上架',value:'1'},{label:'下架',value:'0'}];
export class SearchPanel extends React.PureComponent{
  constructor(props){
    super(props);
    this.makeSearchPanelContent = this.makeSearchPanelContent.bind(this);
    this.setSearchTimeAction = this.setSearchTimeAction.bind(this);
    this.onCheckAllAction = this.onCheckAllAction.bind(this);
    this.onSubjectCheckAllAction = this.onSubjectCheckAllAction.bind(this);
    this.onChangeCheckGroupAction = this.onChangeCheckGroupAction.bind(this);
    this.onChangeSubjectCheckGroupAction = this.onChangeSubjectCheckGroupAction.bind(this);
    this.onChangeFieldAction = this.onChangeFieldAction.bind(this);
    this.onChangeBySetFieldAction = this.onChangeBySetFieldAction.bind(this);
    this.onChangeFirstDirectionFunc = this.onChangeFirstDirectionFunc.bind(this);
    this.onChangeSecondDirectionFunc = this.onChangeSecondDirectionFunc.bind(this);
    this.onChangeThirdDirectionFunc = this.onChangeThirdDirectionFunc.bind(this);
    this.onInitStateAction = this.onInitStateAction.bind(this);
    this.state = {
      gradeIndeterminate:true,
      gradeCheckAll:false,
      subjectIndeterminate:true,
      subjectCheckAll:false,
      searchByProps:{},
      searchBySet:{},
      firstDirectionName:undefined,
      secondDirectionName:undefined,
      thirdDirectionName:undefined,
    }
  }
  onInitStateAction() {
    this.setState({searchByProps:{},searchBySet:{}, firstDirectionName:undefined, secondDirectionName:undefined, thirdDirectionName:undefined});
  }
  onChangeFieldAction(field,value){
    this.setState({searchByProps:{...this.state.searchByProps,[field]:value}})
  }
  onChangeBySetFieldAction(field,value) {
    this.setState({searchBySet:{...this.state.searchBySet,[field]:value}});
  }
  onChangeFirstDirectionFunc(value,option,) {
    this.setState({firstDirectionName:option.props.children,secondDirectionName:undefined,thirdDirectionName:undefined})
    this.setState({searchBySet:{...this.state.searchBySet, 'firstLevelDirectoryId':value,'secondLevelDirectoryId':'','thirdLevelDirectoryId':''}});
    this.props.dispatch(setChangeSelectDirectionIdAction(fromJS({label:'二级目录',id:value})));
    this.props.dispatch(getFirstDirectionItemAction());
  }
  onChangeSecondDirectionFunc(value,option){
    this.setState({secondDirectionName:option.props.children,thirdDirectionName:undefined});
    this.setState({searchBySet:{...this.state.searchBySet, 'secondLevelDirectoryId':value,'thirdLevelDirectoryId':''}});
    this.props.dispatch(setChangeSelectDirectionIdAction(fromJS({label:'三级目录',id:value})));
    this.props.dispatch(getFirstDirectionItemAction());
  }
  onChangeThirdDirectionFunc(value,option) {
    this.setState({thirdDirectionName:option.props.children})
    this.setState({searchBySet:{...this.state.searchBySet, 'thirdLevelDirectoryId':value}});
  }
  setSearchTimeAction(field,value) {
    if(!value){
      //this.props.dispatch(setSearchFieldItemsAction(field,''));
      this.setState({searchByProps:{...this.state.searchByProps,[field]:''}});
      return;
    }
    //this.props.dispatch(setSearchFieldItemsAction(field,value.format('YYYY-MM-DD')))
    this.setState({searchByProps:{...this.state.searchByProps,[field]:value.format('YYYY-MM-DD')}});
  }
  onCheckAllAction(e) {
    const gradeOptions = e.target.checked ? this.props.grades.map((item) => item.get('itemValue')).join(',') : '';
    this.setState({
      gradeIndeterminate:false,
      gradeCheckAll:e.target.checked,
    })
    //this.props.dispatch(setSearchFieldItemsAction('phaseNames',gradeOptions))
    this.setState({searchByProps:{...this.state.searchByProps,'phaseNames':gradeOptions}});
  }
  onSubjectCheckAllAction(e) {
    const subjectOptions = e.target.checked ? this.props.subjects.map((item) => item.get('itemValue')).join(',') : '';
    this.setState({
      subjectIndeterminate:false,
      subjectCheckAll:e.target.checked,
    })
    //this.props.dispatch(setSearchFieldItemsAction('subjectNames',subjectOptions))
    this.setState({searchByProps:{...this.state.searchByProps,'subjectNames':subjectOptions}});
  }
  onChangeCheckGroupAction(checkValue) {
    const gradeOptions = this.props.grades.toJS();
    const checkedList = checkValue.join(',');
    this.setState({
      gradeCheckAll:gradeOptions.length === checkValue.length,
      gradeIndeterminate:!!checkedList.length && (checkValue.length < gradeOptions.length)
    })
    //this.props.dispatch(setSearchFieldItemsAction('phaseNames',checkedList));
    this.setState({searchByProps:{...this.state.searchByProps,'phaseNames':checkedList}});
  }
  onChangeSubjectCheckGroupAction(checkValue) {
    const subjectOptions = this.props.subjects.toJS();
    const checkedList = checkValue.join(',');
    this.setState({
      subjectIndeterminate: !!subjectOptions.length && (checkValue.length < subjectOptions.length),
      subjectCheckAll:subjectOptions.length === checkValue.length,
    })
    //this.props.dispatch(setSearchFieldItemsAction('subjectNames',checkedList));
    this.setState({searchByProps:{...this.state.searchByProps,'subjectNames':checkedList}});

  }
  makeSearchPanelContent(index) {
    const gradeOptions = this.props.grades.map((item) => item.get('itemValue')).toJS();
    const subjectOptions = this.props.subjects.map((item) => item.get('itemValue')).toJS();
    const lessontypeOption = this.props.lessontype.unshift(fromJS(LessonType));
    const makeSearchVideoProps=()=>{
      return <ContentDiv>
      <Row type={'flex'} justify={'space-between'}>
        <Col span={11}>
          <Row type={'flex'} justify={'space-between'}>
            <Col span={10}>
              <Input
                placeholder="老师姓名"
                //value={this.props.searchItems.get('teacherName','')}
                value={this.state.searchByProps.teacherName}
                onChange={(e)=>{
                  this.onChangeFieldAction('teacherName',e.target.value);
                  //this.props.dispatch(setSearchFieldItemsAction('teacherName',e.target.value))
                }}
              />
            </Col>
            <Col span={10}>
              <Select
                style={{width:'120px'}}
                placeholder="课程类型"
                //value={this.props.searchItems.get('lessonType') ? this.props.searchItems.get('lessonType') : '课程类型'}
                value={this.state.searchByProps.lessonType ||''}
                onSelect={(value)=>{
                  //this.props.dispatch(setSearchFieldItemsAction('lessonType',value))
                  this.onChangeFieldAction('lessonType',value)
                }}
              >
                {lessontypeOption.map((item,index)=>{
                  return <Option key={index} value={item.get('itemValue')}>{index === 0 ? item.get('itemCode') : item.get('itemValue')}</Option>
                })}
              </Select>
            </Col>
          </Row>
        </Col>
        <Col span={11}>
          <Row type={'flex'}>
            <Col span={7}>
             观看次数：
            </Col>
            <Col span={17}>
              <InputNumber
                min={0}
                type="number"
                //value={this.props.searchItems.get('minWatchCount',0)}
                value={this.state.searchByProps.minWatchCount ||0}
                onChange={(value)=>{
                //this.props.dispatch(setSearchFieldItemsAction('minWatchCount',value))
                  this.onChangeFieldAction('minWatchCount',value)
              }}></InputNumber>
              <Span>至</Span>
              <InputNumber
                type="number"
                min={0}
                //value={this.props.searchItems.get('maxWatchCount',0)}
                value={this.state.searchByProps.maxWatchCount || 0}
                onChange={(value)=>{
                  //this.props.dispatch(setSearchFieldItemsAction('maxWatchCount',value))
                  this.onChangeFieldAction('maxWatchCount',value)
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row type={'flex'}>
        <Col span={3}>上课日期：</Col>
        <Col span={20}>
          <DatePicker
            placeholder="上课开始时间"
           //value={this.props.searchItems.get('beginLesTime') ? moment(this.props.searchItems.get('beginLesTime')) : null}
            value={this.state.searchByProps.beginLesTime ? moment(this.state.searchByProps.beginLesTime) : null}
            onChange={(value) => {
              this.setSearchTimeAction('beginLesTime',value)
            }}
          ></DatePicker>
          <Span>至</Span>
          <DatePicker
            placeholder="上课结束时间"
            //value={this.props.searchItems.get('endLesTime') ? moment(this.props.searchItems.get('endLesTime')) : null}
            value={this.state.searchByProps.endLesTime ? moment(this.state.searchByProps.endLesTime) : null}
            onChange={(value) => this.setSearchTimeAction('endLesTime',value)}
          ></DatePicker>
        </Col>
      </Row>
      <Row type={'flex'}>
        <Col span={3}>入库日期：</Col>
        <Col span={20}>
          <DatePicker
            placeholder="入库开始时间"
            //value={this.props.searchItems.get('beginPutTime') ? moment(this.props.searchItems.get('beginPutTime')) : null}
            value={this.state.searchByProps.beginPutTime ? moment(this.state.searchByProps.beginPutTime) : null}
            onChange={(value) => this.setSearchTimeAction('beginPutTime',value)}
          ></DatePicker>
          <Span>至</Span>
          <DatePicker
            placeholder="入库结束时间"
            //value={this.props.searchItems.get('endPutTime') ? moment(this.props.searchItems.get('endPutTime')) : null}
            value={this.state.searchByProps.endPutTime ? moment(this.state.searchByProps.endPutTime) : null}
            onChange={(value) => this.setSearchTimeAction('endPutTime',value)}
          ></DatePicker>
        </Col>
      </Row>
        <Row type={'flex'}>
          <Col span={3}>年级：</Col>
          <Col span={20}>
            <Checkbox
              indeterminate={this.state.gradeIndeterminate}
              checked={this.state.gradeCheckAll}
              onChange={this.onCheckAllAction}
            >全选</Checkbox>
            <CheckboxGroup
              options={gradeOptions}
              //value={this.props.searchItems.get('phaseNames') ? this.props.searchItems.get('phaseNames').split(',') : []}
              value={this.state.searchByProps.phaseNames ? this.state.searchByProps.phaseNames.split(',') : []}
              onChange={this.onChangeCheckGroupAction}
            ></CheckboxGroup>
          </Col>
        </Row>
        <Row type={'flex'}>
          <Col span={3}>科目：</Col>
          <Col span={20}>
            <Checkbox
              indeterminate={this.state.subjectIndeterminate}
              checked={this.state.subjectCheckAll}
              onChange={this.onSubjectCheckAllAction}
            >全选</Checkbox>
            <CheckboxGroup
              options={subjectOptions}
              //value={this.props.searchItems.get('subjectNames') ? this.props.searchItems.get('subjectNames').split(',') : []}
              value={this.state.searchByProps.subjectNames ? this.state.searchByProps.subjectNames.split(',') : []}
              onChange={this.onChangeSubjectCheckGroupAction}
            ></CheckboxGroup>
          </Col>
        </Row>
        <Row type={'flex'}>
          <Col span={3}>状态：</Col>
          <CheckboxGroup
            options={VideoState}
            value={this.state.searchByProps.state || []}
            onChange={(checkboxValue) => this.onChangeFieldAction('state',checkboxValue) }
          >
          </CheckboxGroup>
        </Row>
        <Row justify={'center'} type={'flex'}>
          <Button onClick={()=>{
            const stateObj = this.state.searchByProps.state;
            const resultInfo = Object.assign({},this.state.searchByProps,{'state':stateObj ? stateObj.length ===2 ? '':stateObj.join(',') :''});
            this.props.dispatch(setSearchFieldItemsAction(fromJS(resultInfo)));
            this.props.dispatch(setSearchBySetItemInit(fromJS({})));
            this.props.dispatch(getVideoRecordListAction());
            this.props.dispatch(setSearchPanelOpenAction(false));
            this.onInitStateAction();
          }}>确定</Button>
        </Row>
      </ContentDiv>
    }
    const makeSearchVideoExit=()=>{
      console.log('setBySet',this.state.searchBySet)
      return <ContentDiv>
        <Row type={'flex'}>
          <Select
            style={{width:'120px'}}
            placeholder="一级目录"
            value={this.state.firstDirectionName}
            onSelect={this.onChangeFirstDirectionFunc}
          >
            {this.props.firstDirectionItem.map((item,index)=>{
              return <Option key={item.get('id')} value={`${item.get('id')}`}>{item.get('name')}</Option>
            })}
          </Select>
          <Select
            style={{width:'120px',margin:'0 30px'}}
            placeholder="二级目录"
            value={this.state.secondDirectionName}
            onSelect={this.onChangeSecondDirectionFunc}
          >
            {this.props.secondDirectionItem.map((item,index)=>{
              return <Option key={index} value={`${item.get('id')}`}>{item.get('name')}</Option>
            })}
          </Select>
          <Select
            style={{width:'120px'}}
            placeholder="三级目录"
            value={this.state.thirdDirectionName}
            onSelect={this.onChangeThirdDirectionFunc}
          >
            {this.props.thirdDirectionItem.map((item,index)=>{
              return <Option key={index} value={`${item.get('id')}`}>{item.get('name')}</Option>
            })}
          </Select>
        </Row>
        <Row type={'flex'}>
          <Col span={10}>
            <Input
              placeholder="标题"
              //value={this.props.searchBySetItems.get('title','')}
              value={this.state.searchBySet.title || ''}
              onChange={(e)=>{
              //this.props.dispatch(setSearchBySetItems('title',e.target.value));
                this.onChangeBySetFieldAction('title',e.target.value)
            }}/>
          </Col>
        </Row>
        <Row type={'flex'}>
          <Col span={10}>
            <Input
              placeholder="主讲人"
              //value={this.props.searchBySetItems.get('speaker','')}
              value={this.state.searchBySet.speaker || ''}
              onChange={(e)=>{
              //this.props.dispatch(setSearchBySetItems('speaker',e.target.value));
                this.onChangeBySetFieldAction('speaker',e.target.value)
            }}/>
          </Col>
        </Row>
        <Row type={'flex'}>
          <Col span={3}>
            观看次数：
          </Col>
          <Col span={17}>
            <InputNumber
              min={0}
              type="number"
              //value={this.props.searchBySetItems.get('minWatchCount',0)}
              value={this.state.searchBySet.minWatchCount || 0}
              onChange={(value)=>{
                //this.props.dispatch(setSearchBySetItems('minWatchCount',value))
                this.onChangeBySetFieldAction('minWatchCount',value)
              }}></InputNumber>
            <Span>至</Span>
            <InputNumber
              type="number"
              min={0}
              //value={this.props.searchBySetItems.get('maxWatchCount',0)}
              value={this.state.searchBySet.maxWatchCount || 0}
              onChange={(value)=>{
                //this.props.dispatch(setSearchBySetItems('maxWatchCount',value))
                this.onChangeBySetFieldAction('maxWatchCount',value)
              }}
            />
          </Col>
        </Row>
        <Row type={'flex'}>
          <Col span={3}>状态：</Col>
          <CheckboxGroup
            options={VideoState}
            //value={this.props.searchBySetItems.get('state') ? this.props.searchBySetItems.get('state').split(',') : []}
            value={this.state.searchBySet.state||[]}
            //onChange={this.props.onChangeSetStateCheckboxAction}
            onChange={(checkboxValue) => {
              this.onChangeBySetFieldAction('state',checkboxValue)
            }}
          >
          </CheckboxGroup>
        </Row>
        <Row justify={'center'} type={'flex'}>
          <Button onClick={() =>{
            const stateObj = this.state.searchBySet.state;
            const resetInfo = Object.assign({},this.state.searchBySet,{"state":stateObj ? stateObj.length ===2 ? '' : stateObj.join('') :''});
            this.props.dispatch(setSearchItemsInitAction(fromJS({})));
            this.props.dispatch(setSearchBySetItems(fromJS(resetInfo)));
            this.props.dispatch(getVideoRecordListAction());
            this.props.dispatch(setSearchPanelOpenAction(false));
            this.onInitStateAction();
          }}>确定</Button>
        </Row>
      </ContentDiv>
    }
    switch (index){
      case 0:
        return <div>{makeSearchVideoProps()}</div>
      case 1:
        return <div>{makeSearchVideoExit()}</div>
      default:
        return <div>......</div>
    }
  }
  render(){
    console.log('searchitem',this.props.searchItems.toJS())
    return (
      <Modal
        visible={this.props.modalOpen}
        title="筛选视频"
        footer=""
        width={'620px'}
        style={{minHeight:'300px'}}
        maskClosable={false}
        onCancel={() => {
          this.props.dispatch(setSearchPanelOpenAction(false));

          this.onInitStateAction();
          console.log('DDD')
        }}
      >
        <div>
          <Row type={'flex'}>
            <Col span={20}>
              <RadioGroup
                value={this.props.contentIndex}
                onChange={(e)=>{
                  this.props.dispatch(changeSearchPanelAction(e.target.value))
                }}
              >
              {MenuItem.map((item,index)=>{
                return <Radio key={index} value={item.label}>{item.value}</Radio>
              })}
              </RadioGroup>
            </Col>
          </Row>
          {this.makeSearchPanelContent(this.props.contentIndex)}
        </div>
      </Modal>
    )
  }
}
SearchPanel.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalOpen:PropTypes.bool.isRequired,
  contentIndex:PropTypes.number.isRequired,
  lessontype:PropTypes.instanceOf(Immutable.List).isRequired,
  grades:PropTypes.instanceOf(Immutable.List).isRequired,
  subjects:PropTypes.instanceOf(Immutable.List).isRequired,
  searchItems:PropTypes.instanceOf(Immutable.Map).isRequired,
  onCloseModalAction:PropTypes.func.isRequired,
  // onChangeStateCheckboxAction:PropTypes.func.isRequired,
  onChangeSetStateCheckboxAction:PropTypes.func.isRequired,
  searchBySetItems: PropTypes.instanceOf(Immutable.Map).isRequired,
  firstDirectionItem: PropTypes.instanceOf(Immutable.List).isRequired,
  secondDirectionItem: PropTypes.instanceOf(Immutable.List).isRequired,
  thirdDirectionItem: PropTypes.instanceOf(Immutable.List).isRequired,
  onChangeFirstDirectionAction:PropTypes.func.isRequired,
  onChangeSecondDirectionAction:PropTypes.func.isRequired,
  onChangeThirdDirectionAction:PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  modalOpen: makeSearchPanelOpen(),
  contentIndex: makeSearchPanelContentIndex(),
  lessontype: makeLessonTypeData(),
  grades: makeGradeListData(),
  subjects: makeSubjectListData(),
  searchItems: makeSearchItemsValue(),
  searchBySetItems: makeSearchBySetItems(),
  firstDirectionItem: makeFirstDirectionItem(),
  secondDirectionItem: makeSecondDirectionItem(),
  thirdDirectionItem:makeThirdDirectionItem(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onCloseModalAction:() => {
      dispatch(setSearchPanelOpenAction(false));

    },
    // onChangeStateCheckboxAction:(checkboxValue) =>{
    //   dispatch(setSearchFieldItemsAction('state',fromJS(checkboxValue)))
    // },
    onChangeSetStateCheckboxAction:(checkboxValue) =>{
      dispatch(setSearchBySetItems('state',checkboxValue.join(',')))
    },
    onChangeFirstDirectionAction:(value) => {
      console.log('value',value)
      dispatch(setSearchBySetItems('firstLevelDirectoryId',value));
      dispatch(setSearchBySetItems('secondLevelDirectoryId',undefined));
      dispatch(setSearchBySetItems('thirdLevelDirectoryId',undefined));
      dispatch(setChangeSelectDirectionIdAction(fromJS({label:'二级目录',id:value})));
      dispatch(getFirstDirectionItemAction());
    },
    onChangeSecondDirectionAction:(value) => {
      dispatch(setSearchBySetItems('secondLevelDirectoryId',value))
      dispatch(setSearchBySetItems('thirdLevelDirectoryId',undefined))
      dispatch(setChangeSelectDirectionIdAction(fromJS({label:'三级目录',id:value})));
      dispatch(getFirstDirectionItemAction());
    },
    onChangeThirdDirectionAction:(value) => {
      dispatch(setSearchBySetItems('thirdLevelDirectoryId',value))
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
