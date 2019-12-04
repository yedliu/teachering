import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import { FlexColumn, FlexRow, FlexRowCenter } from 'components/FlexBox';
import { createStructuredSelector } from 'reselect';
import {
  Form,
  Modal,
  Select,
  message,
  Input,
  InputNumber,
  TreeSelect,
  Button
} from 'antd';
import makeSelectCourseSystem, {
  makeSelectClassTypeId,
  makeSelectClassTypeList,
  makeSelectCourseContentId,
  makeSelectCourseContentList,
  makeSelectCourseModuleId,
  makeSelectCourseModuleList,
  makeSelectCourseTypeId,
  makeSelectCourseTypeList,
  makeSelectCrudId,
  makeSelectEditionId,
  makeSelectEditionList,
  makeSelectGradeId,
  makeSelectGradeList,
  makeSelectInputDto,
  makeSelectSubjectId,
  makeSelectSubjectList,
  makeSelectAddExit,
  makeSelectModalAttr,
  getKnowledgeList,
} from './selectors';
import {
  deleteAction,
  getClassTypeAction,
  getCourseContentAction,
  getCourseModuleAction,
  getCourseTypeAction,
  getEditionAction,
  getGradeAction,
  getSubjectAction,
  saveAction,
  setClassTypeIdAction,
  setClassTypeListAction,
  setCourseContentIdAction,
  setCourseContentListAction,
  setCourseModuleIdAction,
  setCourseModuleListAction,
  setCourseTypeIdAction,
  setCourseTypeListAction,
  setCrudIdAction,
  setEditionIdAction,
  setGradeIdAction,
  setInputDtoAction,
  setSubjectIdAction,
  sortAction,
  setAddExit,
  setModalAttrAction,
  getknowledgeTreeAction,
} from './actions';
import EditDateModal from './component/EditDateModal/index';
import EditLevelModal from './component/EditLevelModal/index';
import EditNameModal from './component/EditNameModule';
import ListView, { ListViewItem } from '../../components/ListView/index';
const pic_null = window._baseUrl.imgCdn + '18cdee41-78a4-4873-b815-17cbf07aaab2.png';
import courseSystemEndpointApi from '../../api/tr-cloud/course-system-endpoint/index';
import courseSystemApi from 'api/tr-cloud/course-system-endpoint';
const Wrapper = styled(FlexColumn)`
  flex-grow: 1;
  height: auto;
  background-color: white;
  font-size: 14px;
`;

const HeaderWrapper = styled(FlexRowCenter)`
  width: 100%;
  height: auto;
  background-color: white;
  padding: 20px 0 15px;
  padding-left: 20px;
  flex-wrap: wrap;
`;

const BodyWrapper = styled(FlexRow)`
  justify-content: flex-start;
  width: 100%;
  height: auto;
  background-color: #f5f6f8;
  flex-grow: 1;
  overflow: auto;
  .iySlzp {
    min-height: 60px !important;
  }
`;

const FormItem = Form.Item;
export class CourseSystem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      upDownStatus: false,
      showDateModal: false,
      showEditLevelModal: false,
    };
    this.currentItem = null;
  }
  componentDidMount() {
    this.props.dispatch(getGradeAction());
  }
  changeUpDownStatus = async (e, item, level, index) => {
    e.stopPropagation();
    let params = {
      id: item.id,
      state: item.state,
    };
    let res = null;
    let api = courseSystemEndpointApi;
    if (item.state === 1) {
      res = await api.downCourseSystem(params);
    } else {
      res = await api.upCourseSystem(params);
    }
    if (res.code === '0') {
      this.props.handleUpDownShelve(e, level, index, this.props, item, params);
    } else {
      message.warning(`${res.message}`);
    }
  };
  goToUpDown = (e, level, index, props) => {
    let { dispatch } = props;
    e.stopPropagation();
    if (props.addExist) {
      message.warning('请先完成之前的操作');
      dispatch(setCrudIdAction(0));
      return;
    }
    dispatch(setInputDtoAction(props.inputDto.set('level', level)));
    let deleteId;
    if (level === 1) {
      deleteId = props.classTypeList.get(index).get('id');
      dispatch(setCrudIdAction(deleteId));
    } else if (level === 2) {
      deleteId = props.courseTypeList.get(index).get('id');
      dispatch(setCrudIdAction(deleteId));
    } else if (level === 3) {
      deleteId = props.courseModuleList.get(index).get('id');
      dispatch(setCrudIdAction(deleteId));
    } else if (level === 4) {
      deleteId = props.courseContentList.get(index).get('id');
      dispatch(setCrudIdAction(deleteId));
    }
  };
  // 设置ila
  setILA = async (e, item, level, index) => {
    e.stopPropagation();
    let params = { id: item.id, ilaFlag: Number(item.ilaFlag) };
    let res = null;
    try {
      if (item.ilaFlag === 0) {
        res = await courseSystemEndpointApi.enableILA(params);
      } else if (item.ilaFlag === 1) {
        res = await courseSystemEndpointApi.disableILA(params);
      } else {
        message.warning('参数错误:ilaFlag');
      }
    } catch (e) {
      message.warning('服务不可用');
    }
    if (res && res.code === '0') {
      // 变换当前item的isILAFlag状态
      this.props.handleILAFlag(this.props, index, item);
    } else if (res) {
      message.warning(res.message);
    }
  }
  // 显示编辑日期
  showEditDate = (item, index) => {
    this.setState({ showDateModal: true });
    this.currentItem = item;
    this.currentItem.curIndex = index;
  }
  // 编辑日期
  handleEditDate = (values) => {
    let params = Object.assign(this.currentItem, { month: Number(values.month) });
    let index = params.curIndex;
    delete params.curIndex;
    courseSystemApi.updateCourseSystem(this.currentItem.id, params).then(res => {
      if (res.code === '0') {
        let list = this.props.courseModuleList.toJS();
        list[index].month = values.month;
        this.props.dispatch(setCourseModuleListAction(fromJS(list)));
        this.setState({ showDateModal: false });
        this.currentItem = null;
      } else {
        message.warning(`${res.message}`);
      }
    }).catch(() => {
      message.warning('服务不可用');
    });
  }

  handleLevelClick = () => {
    this.setState({ showEditLevelModal: true });
  }
  handleLevelCancel = () => {
    this.setState({ showEditLevelModal: false });
  }
  handleLevelOk = () => {
    this.setState({ showEditLevelModal: false });
  }
  render() {
    let classTypeItems = [];
    let courseTypeItems = [];
    let courseModuleItems = [];
    let courseContentItems = [];
    const { showEditLevelModal } = this.state;
    const { gradeId, subjectId } = this.props;
    if (this.props.classTypeList.size > 0) {
      classTypeItems = this.props.classTypeList.toJS().map((item, index) => {
        const style = {};
        let selected = false;
        if (item.editable) {
          return (
            <ListViewItem
              key={item.id}
              name={this.props.inputDto.get('name')}
              editable
              onChange={e => this.props.onChange(e, this.props.inputDto)}
              save={this.props.save}
              cancel={this.props.cancel}
            />
          );
        } else {
          if (item.id === this.props.classTypeId) {
            selected = true;
          }
          if (index !== this.props.classTypeList.toJS().length) {
            style.borderBottom = '1px solid #F0F0F0';
          }
          return (
            <ListViewItem
              selected={selected}
              style={style}
              key={item.id}
              name={item.name}
              toolBarVisible={item.toolBarVisible}
              editable={item.editable}
              onMouseOver={() => this.props.onMouseOver(1, index, this.props)}
              onMouseLeave={() => this.props.onMouseLeave(1, this.props)}
              draggable
              onDragStart={e => this.props.onDragStart(e, 1, index)}
              onDrop={e => this.props.onDrop(e, 1, index, this.props)}
              onDragOver={e => this.props.onDragOver(e)}
              onClick={() =>
                this.props.handleCourseSystemItemOnClick(1, item.id)
              }
              goToUpdate={e => this.props.goToUpdate(e, 1, index, this.props)}
              goToDelete={e => this.props.goToDelete(e, 1, index, this.props)}
              handleDelete={e =>
                this.props.handleDelete(e, 1, index, this.props)
              }
              handlePopCancel={e => this.props.handlePopCancel(e)}
              isShowUpDown={true}
              upDownStatus={item.state}
              changeUpDownStatus={e => {
                this.changeUpDownStatus(e, item, 1, index);
              }}
              goToUpDown={e => this.goToUpDown(e, 1, index, this.props)}
              ila={{ isILA: item.ilaFlag, setILA: e => this.setILA(e, item, 1, index) }}
            />
          );
        }
      });
    } else {
      classTypeItems.push(
        <div
          key={1}
          style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}
        >
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>,
      );
    }
    if (this.props.courseTypeList.size > 0) {
      courseTypeItems = this.props.courseTypeList.toJS().map((item, index) => {
        const style = {};
        let selected = false;
        if (item.editable) {
          return (
            <ListViewItem
              key={item.id}
              name={this.props.inputDto.get('name')}
              editable
              onChange={e => this.props.onChange(e, this.props.inputDto)}
              save={this.props.save}
              cancel={this.props.cancel}
            />
          );
        } else {
          if (item.id === this.props.courseTypeId) {
            selected = true;
          }
          if (index !== this.props.courseTypeList.toJS().length) {
            style.borderBottom = '1px solid #F0F0F0';
          }
          return (
            <ListViewItem
              selected={selected}
              style={style}
              key={item.id}
              name={item.name}
              toolBarVisible={item.toolBarVisible}
              editable={item.editable}
              onMouseOver={() => this.props.onMouseOver(2, index, this.props)}
              onMouseLeave={() => this.props.onMouseLeave(2, this.props)}
              draggable
              onDragStart={e => this.props.onDragStart(e, 2, index)}
              onDrop={e => this.props.onDrop(e, 2, index, this.props)}
              onDragOver={e => this.props.onDragOver(e)}
              onClick={() =>
                this.props.handleCourseSystemItemOnClick(2, item.id)
              }
              goToUpdate={e => this.props.goToUpdate(e, 2, index, this.props)}
              goToDelete={e => this.props.goToDelete(e, 2, index, this.props)}
              handleDelete={e =>
                this.props.handleDelete(e, 2, index, this.props)
              }
              handlePopCancel={e => this.props.handlePopCancel(e)}
              isShowUpDown={true}
              upDownStatus={item.state}
              changeUpDownStatus={e => {
                this.changeUpDownStatus(e, item, 2, index);
              }}
              goToUpDown={e => this.goToUpDown(e, 2, index, this.props)}
            />
          );
        }
      });
    } else {
      courseTypeItems.push(
        <div
          key={1}
          style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}
        >
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>,
      );
    }
    if (this.props.courseModuleList.size > 0) {
      courseModuleItems = this.props.courseModuleList
        .toJS()
        .map((item, index) => {
          const style = {};
          let selected = false;
          if (item.id === this.props.courseModuleId) {
            selected = true;
          }
          if (index !== this.props.courseModuleList.toJS().length) {
            style.borderBottom = '1px solid #F0F0F0';
          }
          return (
            <ListViewItem
              selected={selected}
              style={style}
              key={item.id}
              title={item.name}
              name={
                <div>
                  <span style={{ lineHeight: 1.2 }}>{item.name}</span>
                  <span style={{ display: 'block', margin: '-12px 0 10px', fontSize: 12, color: '#999', lineHeight: 1.2 }}>{item.alias}</span>
                </div>
              }
              toolBarVisible={item.toolBarVisible}
              editable={item.editable}
              onMouseOver={() => this.props.onMouseOver(3, index, this.props)}
              onMouseLeave={() => this.props.onMouseLeave(3, this.props)}
              draggable
              onDragStart={e => this.props.onDragStart(e, 3, index)}
              onDrop={e => this.props.onDrop(e, 3, index, this.props)}
              onDragOver={e => this.props.onDragOver(e)}
              onClick={() =>
                this.props.handleCourseSystemItemOnClick(3, item.id)
              }
              goToUpdate={e => this.props.goToUpdate(e, 3, index, this.props)}
              goToDelete={e => this.props.goToDelete(e, 3, index, this.props)}
              handleDelete={e =>
                this.props.handleDelete(e, 3, index, this.props)
              }
              handlePopCancel={e => this.props.handlePopCancel(e)}
              isShowUpDown={true}
              upDownStatus={item.state}
              changeUpDownStatus={e => {
                this.changeUpDownStatus(e, item, 3, index);
              }}
              goToUpDown={e => this.goToUpDown(e, 3, index, this.props)}
              dateBtn={{ month: item.month }}
              showEditDate={() => { this.showEditDate(item, index) }}
            />
          );
        });
    } else {
      courseModuleItems.push(
        <div
          key={1}
          style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}
        >
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>,
      );
    }
    if (this.props.courseContentList.size > 0) {
      courseContentItems = this.props.courseContentList
        .toJS()
        .map((item, index) => {
          const style = {};
          let selected = false;
          if (item.editable) {
            return (
              <ListViewItem
                key={item.id}
                name={this.props.inputDto.get('name')}
                num={item.courseHour}
                editable
                inputNum
                onChange={e => this.props.onChange(e, this.props.inputDto)}
                inputNumChange={value =>
                  this.props.inputNumChange(value, this.props)
                }
                save={this.props.save}
                cancel={this.props.cancel}
              />
            );
          } else {
            if (item.id === this.props.courseContentId) {
              selected = true;
            }
            if (index !== this.props.courseContentList.toJS().length) {
              style.borderBottom = '1px solid #F0F0F0';
            }
            return (
              <ListViewItem
                selected={selected}
                style={style}
                key={item.id}
                name={item.name}
                num={item.courseHour}
                inputNum
                toolBarVisible={item.toolBarVisible}
                editable={item.editable}
                onMouseOver={() => this.props.onMouseOver(4, index, this.props)}
                onMouseLeave={() => this.props.onMouseLeave(4, this.props)}
                draggable
                onDragStart={e => this.props.onDragStart(e, 4, index)}
                onDrop={e => this.props.onDrop(e, 4, index, this.props)}
                onDragOver={e => this.props.onDragOver(e)}
                onClick={() =>
                  this.props.handleCourseSystemItemOnClick(4, item.id)
                }
                goToUpdate={e => this.props.goToUpdate(e, 4, index, this.props)}
                goToDelete={e => this.props.goToDelete(e, 4, index, this.props)}
                handleDelete={e =>
                  this.props.handleDelete(e, 4, index, this.props)
                }
                handlePopCancel={e => this.props.handlePopCancel(e)}
                isShowUpDown={true}
                upDownStatus={item.state}
                changeUpDownStatus={e => {
                  this.changeUpDownStatus(e, item, 4, index);
                }}
                goToUpDown={e => this.goToUpDown(e, 4, index, this.props)}
              />
            );
          }
        });
    } else {
      courseContentItems.push(
        <div
          key={1}
          style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}
        >
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>,
      );
    }
    return (
      <Wrapper>
        <HeaderWrapper>
          <Select
            className={'selectCls'}
            size="large"
            style={{ paddingRight: 40, width: '240px' }}
            value={this.props.gradeId.toString()}
            onChange={this.props.handleGradeSelectOnChange}
          >
            {this.props.gradeList.toJS().map(grade => (
              <Select.Option
                value={grade.id.toString()}
                key={grade.id}
                title={grade.name}
              >
                {grade.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            className={'selectCls'}
            size="large"
            style={{ paddingRight: 40, width: '240px' }}
            value={this.props.subjectId.toString()}
            onChange={this.props.handleSubjectSelectOnChange}
          >
            {this.props.subjectList.toJS().map(subject => (
              <Select.Option
                value={subject.id.toString()}
                key={subject.id}
                title={subject.name}
              >
                {subject.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            className={'selectCls'}
            size="large"
            style={{ paddingRight: 40, width: '240px' }}
            value={this.props.editionId.toString()}
            onChange={this.props.handleEditionSelectOnChange}
          >
            {this.props.editionList.toJS().map(edition => (
              <Select.Option
                value={edition.id.toString()}
                key={edition.id}
                title={edition.name}
              >
                {edition.name}
              </Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            onClick={this.handleLevelClick}
            style={{ marginTop: '-8px' }}
          >课程体系等级</Button>
          {showEditLevelModal ? <EditLevelModal
            showEditLevelModal={showEditLevelModal}
            onCancel={this.handleLevelCancel}
            queryParams={{ gradeId, subjectId }}
            onOk={this.handleLevelOk}
          /> : ''}
          {/* <Switch defaultChecked={true} onChange={this.props.handleSwitchOnChange} style={{ width: 60, height: 26 }} checkedChildren="显示" unCheckedChildren="隐藏" /> */}
        </HeaderWrapper>
        <BodyWrapper>
          <div style={{ whiteSpace: 'nowrap', width: '100%' }}>
            <ListView
              title={'班型'}
              onFooterBtnClick={() =>
                this.props.handleOnFooterBtnClick(
                  1,
                  this.props.classTypeList,
                  this.props.inputDto,
                  this.props.addExist,
                )
              }
            >
              {classTypeItems}
            </ListView>
            <ListView
              title={'课程类型'}
              onFooterBtnClick={() =>
                this.props.handleOnFooterBtnClick(
                  2,
                  this.props.courseTypeList,
                  this.props.inputDto,
                  this.props.addExist,
                )
              }
            >
              {courseTypeItems}
            </ListView>
            <ListView
              title={'模块'}
              onFooterBtnClick={() => {
                this.props.handleOnFooterBtnClick(
                  3,
                  this.props.courseModuleList,
                  this.props.inputDto,
                  this.props.addExist,
                  this.props,
                );
              }}
            >
              {courseModuleItems}
            </ListView>
            <ListView
              title={'课程内容'}
              moreWidth={300}
              onFooterBtnClick={() =>
                this.props.handleOnFooterBtnClick(
                  4,
                  this.props.courseContentList,
                  this.props.inputDto,
                  this.props.addExist,
                  this.props,
                )
              }
            >
              {courseContentItems}
            </ListView>
          </div>
        </BodyWrapper>
        {this.props.modalAttr.get('visible') && (
          <CourseContentModal
            {...this.props.inputDto.toJS()}
            knowledgeList={this.props.knowledgeList.toJS()}
            ref={form => {
              this.form = form;
            }}
            visible={this.props.modalAttr.get('visible')}
            onChange={values => this.props.modalOnChange(this.props, values)}
            onCancel={() => this.props.handleModalOnCancel(this.props)}
            onCreate={() => this.props.handleModalOnOk(this.form, this.props)}
          />
        )}
        {
          this.state.showDateModal ? <EditDateModal onSubmit={(data) => { this.handleEditDate(data) }} onCancel={() => { this.setState({ showDateModal: false }) }} data={this.currentItem} /> : null
        }
        {this.props.modalAttr.get('nameModalVisible') &&
          <EditNameModal
            onCancel={() => {
              const { dispatch, modalAttr } = this.props;
              dispatch(setModalAttrAction(modalAttr.set('nameModalVisible', false)));
              dispatch(setAddExit(false));
            }}
            name={this.props.inputDto.get('name')}
            alias={this.props.inputDto.get('alias')}
            onSubmit={(values) => {
              const { dispatch, inputDto, save } = this.props;
              const { name, alias } = values;
              dispatch(setInputDtoAction(
                inputDto
                  .set('alias', alias)
                  .set('name', name),
              ));
              save();
            }}
          />}
      </Wrapper>
    );
  }
}
const TreeNode = TreeSelect.TreeNode;
// 递归遍历树
const generateTree = list =>
  list.map(item => (
    <TreeNode value={String(item.id)} title={item.name} key={item.id}>
      {item.children && item.children.length > 0 && generateTree(item.children)}
    </TreeNode>
  ));
// 新增课程内容弹框
const CourseContentModal = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  // mapPropsToFields(props) {
  //   console.log('mapPropsToFields', props);
  //   return {
  //     name: {
  //       ...props.name,
  //       value: props.name,
  //     },
  //     courseHour: {
  //       ...props.courseHour,
  //       value: props.courseHour,
  //     },
  //     knowledgeIds: {
  //       knowledgeIds: [...props.knowledgeIds],
  //       value: knowledgeIds, // tree的velue必须是array<string>
  //     },
  //   };
  // },
})(props => {
  const {
    visible,
    onCancel,
    onCreate,
    form,
    knowledgeList,
    knowledgeIds,
  } = props;
  const knowledgeIdsArr = knowledgeIds
    ? knowledgeIds.map(item => String(item))
    : [];
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
  const tProps = {
    treeCheckable: true,
    searchPlaceholder: '请选择关联知识点',
    treeNodeFilterProp: 'title',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
  };
  return (
    <Modal
      visible={visible}
      title="课程内容"
      okText="保存"
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form layout="horizontal" style={{ width: '80%', margin: '0 auto' }}>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            initialValue: props.name,
            rules: [
              { required: true, message: '请输入名称' },
              {
                whitespace: true,
                message: '请输入名称',
              } /* , { max: 20, message: '不能超过20个字符' } */,
            ],
          })(<Input placeholder="请输入名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="建议授课课时">
          {getFieldDecorator('courseHour', {
            initialValue: props.courseHour,
            rules: [{ required: true, message: '请输入课时' }],
          })(<InputNumber min={0} step={0.5} />)}
          课时
        </FormItem>
        <FormItem {...formItemLayout} label="关联知识点">
          {getFieldDecorator('knowledgeIds', {
            rules: [{ type: 'array', max: 10, message: '最多选择10个知识点' }],
            initialValue: knowledgeIdsArr,
          })(
            <TreeSelect {...tProps} allowClear>
              {generateTree(knowledgeList)}
            </TreeSelect>,
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

CourseSystem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleGradeSelectOnChange: PropTypes.func.isRequired,
  handleSubjectSelectOnChange: PropTypes.func.isRequired,
  handleEditionSelectOnChange: PropTypes.func.isRequired,
  gradeList: PropTypes.instanceOf(Immutable.List).isRequired,
  subjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  editionList: PropTypes.instanceOf(Immutable.List).isRequired,
  gradeId: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  subjectId: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  editionId: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  classTypeList: PropTypes.instanceOf(Immutable.List).isRequired,
  courseTypeList: PropTypes.instanceOf(Immutable.List).isRequired,
  courseModuleList: PropTypes.instanceOf(Immutable.List).isRequired,
  courseContentList: PropTypes.instanceOf(Immutable.List).isRequired,
  classTypeId: PropTypes.number.isRequired,
  courseTypeId: PropTypes.number.isRequired,
  courseModuleId: PropTypes.number.isRequired,
  courseContentId: PropTypes.number.isRequired,
  inputDto: PropTypes.instanceOf(Immutable.Map).isRequired,
  handleModalOnOk: PropTypes.func.isRequired,
  handleOnFooterBtnClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  goToUpdate: PropTypes.func.isRequired,
  goToDelete: PropTypes.func.isRequired,
  handleSwitchOnChange: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  handleCourseSystemItemOnClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handlePopCancel: PropTypes.func.isRequired,
  inputNumChange: PropTypes.func.isRequired,
  addExist: PropTypes.bool.isRequired,
  handleModalOnCancel: PropTypes.func.isRequired,
  modalOnChange: PropTypes.func.isRequired,
  form: PropTypes.object,
  modalAttr: PropTypes.object,
  knowledgeList: PropTypes.instanceOf(Immutable.List).isRequired,
};

const mapStateToProps = createStructuredSelector({
  CourseSystem: makeSelectCourseSystem(),
  gradeList: makeSelectGradeList(),
  subjectList: makeSelectSubjectList(),
  editionList: makeSelectEditionList(),
  gradeId: makeSelectGradeId(),
  subjectId: makeSelectSubjectId(),
  editionId: makeSelectEditionId(),
  classTypeList: makeSelectClassTypeList(),
  courseTypeList: makeSelectCourseTypeList(),
  courseModuleList: makeSelectCourseModuleList(),
  courseContentList: makeSelectCourseContentList(),
  classTypeId: makeSelectClassTypeId(),
  courseTypeId: makeSelectCourseTypeId(),
  courseModuleId: makeSelectCourseModuleId(),
  courseContentId: makeSelectCourseContentId(),
  inputDto: makeSelectInputDto(),
  crudId: makeSelectCrudId(),
  addExist: makeSelectAddExit(),
  modalAttr: makeSelectModalAttr(),
  knowledgeList: getKnowledgeList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleGradeSelectOnChange: value => {
      dispatch(setGradeIdAction(value));
      dispatch(getSubjectAction());
    },
    handleSubjectSelectOnChange: value => {
      dispatch(setSubjectIdAction(value));
      dispatch(getEditionAction());
    },
    handleEditionSelectOnChange: value => {
      dispatch(setEditionIdAction(value));
      dispatch(getClassTypeAction());
    },
    handleCourseSystemItemOnClick: (level, value) => {
      // console.log('点击了：', level, value);
      if (level === 1) {
        dispatch(setClassTypeIdAction(value));
        dispatch(getCourseTypeAction());
      } else if (level === 2) {
        dispatch(setCourseTypeIdAction(value));
        dispatch(getCourseModuleAction());
      } else if (level === 3) {
        dispatch(setCourseModuleIdAction(value));
        dispatch(getCourseContentAction());
      } else if (level === 4) {
        dispatch(setCourseContentIdAction(value));
      }
    },
    handleOnFooterBtnClick: (level, list, inputDto, exit, props) => {
      if (exit) {
        message.warning('请先完成之前的操作');
        return false;
      }
      dispatch(setCrudIdAction(0));
      dispatch(
        setInputDtoAction(
          inputDto
            .set('level', level)
            .set('name', '')
            .set('alias', '')
            .set('courseHour', 0)
            .set('knowledgeIds', []),
        ),
      );
      const _new = Immutable.fromJS({
        id: 0,
        name: '',
        courseHour: 0,
        editable: true,
      });
      if (level === 1) {
        dispatch(setClassTypeListAction(list.push(_new)));
      } else if (level === 2) {
        dispatch(setCourseTypeListAction(list.push(_new)));
      } else if (level === 3) {
        dispatch(setModalAttrAction(props.modalAttr.set('nameModalVisible', true)));
      } else if (level === 4) {
        dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
        dispatch(getknowledgeTreeAction());
      }
      dispatch(setAddExit(true));
    },
    onChange: (e, value) => {
      dispatch(setInputDtoAction(value.set('name', e.target.value)));
    },
    inputNumChange: (value, props) => {
      dispatch(setInputDtoAction(props.inputDto.set('courseHour', value)));
    },
    save: () => {
      dispatch(setAddExit(false));
      dispatch(saveAction());
    },
    cancel: () => {
      dispatch(setAddExit(false));
      dispatch(getClassTypeAction());
    },
    onMouseOver: (level, index, props) => {
      if (level === 1) {
        const editor = props.classTypeList.find(
          value => value.get('editable') === true,
        );
        if (editor) {
          return;
        }
        const list = props.classTypeList.map((value, index2) =>
          value.set('toolBarVisible', index === index2),
        );
        dispatch(setClassTypeListAction(list));
      } else if (level === 2) {
        const editor = props.courseTypeList.find(
          value => value.get('editable') === true,
        );
        if (editor) {
          return;
        }
        const list = props.courseTypeList.map((value, index2) =>
          value.set('toolBarVisible', index === index2),
        );
        dispatch(setCourseTypeListAction(list));
      } else if (level === 3) {
        const editor = props.courseModuleList.find(
          value => value.get('editable') === true,
        );
        if (editor) {
          return;
        }
        const list = props.courseModuleList.map((value, index2) =>
          value.set('toolBarVisible', index === index2),
        );
        dispatch(setCourseModuleListAction(list));
      } else if (level === 4) {
        const editor = props.courseContentList.find(
          value => value.get('editable') === true,
        );
        if (editor) {
          return;
        }
        const list = props.courseContentList.map((value, index2) =>
          value.set('toolBarVisible', index === index2),
        );
        dispatch(setCourseContentListAction(list));
      }
    },
    onMouseLeave: (level, props) => {
      console.log('props.crudId:', props.crudId);
      if (props.crudId !== 0) {
        return;
      }
      if (level === 1) {
        const list = props.classTypeList.map(value =>
          value.set('toolBarVisible', false),
        );
        dispatch(setClassTypeListAction(list));
      } else if (level === 2) {
        const list = props.courseTypeList.map(value =>
          value.set('toolBarVisible', false),
        );
        dispatch(setCourseTypeListAction(list));
      } else if (level === 3) {
        const list = props.courseModuleList.map(value =>
          value.set('toolBarVisible', false),
        );
        dispatch(setCourseModuleListAction(list));
      } else if (level === 4) {
        const list = props.courseContentList.map(value =>
          value.set('toolBarVisible', false),
        );
        dispatch(setCourseContentListAction(list));
      }
    },
    goToUpdate: (e, level, index, props) => {
      e.stopPropagation();
      if (props.addExist) {
        message.warning('请先完成之前的操作');
        return;
      }
      if (level === 1) {
        const list = props.classTypeList.map((value, index2) =>
          value.set('editable', index === index2),
        );
        dispatch(setClassTypeListAction(list));
        const classType = props.classTypeList.get(index);
        dispatch(setCrudIdAction(classType.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('name', classType.get('name')),
          ),
        );
      } else if (level === 2) {
        const list = props.courseTypeList.map((value, index2) =>
          value.set('editable', index === index2),
        );
        dispatch(setCourseTypeListAction(list));
        const courseType = props.courseTypeList.get(index);
        dispatch(setCrudIdAction(courseType.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('name', courseType.get('name')),
          ),
        );
      } else if (level === 3) {
        dispatch(setModalAttrAction(props.modalAttr.set('nameModalVisible', true)));
        const courseModule = props.courseModuleList.get(index);
        dispatch(setCrudIdAction(courseModule.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('alias', courseModule.get('alias'))
              .set('name', courseModule.get('name')),
          ),
        );
      } else if (level === 4) {
        // const list = props.courseContentList.map((value, index2) =>
        //   value.set('editable', index === index2)
        // );
        // dispatch(setCourseContentListAction(list));
        dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
        const courseContent = props.courseContentList.get(index);
        dispatch(setCrudIdAction(courseContent.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('name', courseContent.get('name'))
              .set('courseHour', courseContent.get('courseHour'))
              .set('knowledgeIds', courseContent.get('knowledgeIds')),
          ),
        );
        dispatch(getknowledgeTreeAction());
      }
      dispatch(setAddExit(true));
    },
    goToDelete: (e, level, index, props) => {
      e.stopPropagation();
      if (props.addExist) {
        message.warning('请先完成之前的操作');
        dispatch(setCrudIdAction(0));
        return;
      }
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      let deleteId;
      if (level === 1) {
        deleteId = props.classTypeList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 2) {
        deleteId = props.courseTypeList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 3) {
        deleteId = props.courseModuleList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 4) {
        deleteId = props.courseContentList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      }
    },
    handleDelete: (e, level, index, props) => {
      e.stopPropagation();
      if (props.addExist) {
        message.warning('请先完成之前的操作');
        return;
      }
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      let deleteId;
      if (level === 1) {
        deleteId = props.classTypeList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 2) {
        deleteId = props.courseTypeList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 3) {
        deleteId = props.courseModuleList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 4) {
        deleteId = props.courseContentList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      }
      dispatch(deleteAction());
    },
    handlePopCancel: e => {
      e.stopPropagation();
      dispatch(setCrudIdAction(0));
    },
    handleSwitchOnChange: checked => {
      console.log('课程体系显示？', checked);
    },
    onDragStart: (e, level, index) => {
      e.stopPropagation();
      console.log('拖动开始', level, index);
      e.dataTransfer.setData('text', JSON.stringify({ level, index }));
    },
    onDrop: (e, level, index, props) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('text'));
      if (level !== data.level) {
        console.log('不同层级不能换位置');
        return;
      }
      let list;
      if (level === 1) {
        list = props.classTypeList;
      } else if (level === 2) {
        list = props.courseTypeList;
      } else if (level === 3) {
        list = props.courseModuleList;
      } else if (level === 4) {
        list = props.courseContentList;
      }
      const oldData = list.get(data.index);
      const newData = list.get(index);
      const arr = list.set(data.index, newData).set(index, oldData);
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      if (level === 1) {
        dispatch(setClassTypeListAction(arr));
      } else if (level === 2) {
        dispatch(setCourseTypeListAction(arr));
      } else if (level === 3) {
        dispatch(setCourseModuleListAction(arr));
      } else if (level === 4) {
        dispatch(setCourseContentListAction(arr));
      }
      dispatch(sortAction());
      console.log('拖动结束', level, index, arr.toJS());
    },
    onDragOver: e => {
      e.preventDefault();
    },
    handleModalOnCancel: props => {
      dispatch(setAddExit(false));
      dispatch(setModalAttrAction(props.modalAttr.set('visible', false)));
    },
    handleModalOnOk: (form, props) => {
      console.log('点击了保存按钮', form);
      form.validateFields((err, values) => {
        if (err) {
          console.log('校验结果：', err, values);
          return;
        }
        console.log('props.inputDto:', props.inputDto.toJS());
        dispatch(setAddExit(false));
        dispatch(saveAction());
      });
    },
    modalOnChange: (props, values) => {
      console.log('form表单变动：', values);
      let dto = props.inputDto;
      if (values.name) {
        dto = dto.set('name', values.name.value);
      }
      if (values.courseHour) {
        dto = dto.set('courseHour', values.courseHour.value);
      }
      if (values.knowledgeIds) {
        dto = dto.set('knowledgeIds', values.knowledgeIds.value);
      }
      dispatch(setInputDtoAction(dto));
    },
    handleUpDownShelve: (e, level, index, props, item, params) => {
      // 改当前item状态
      let listArr = [
        props.classTypeList,
        props.courseTypeList,
        props.courseModuleList,
        props.courseContentList,
      ];
      let actionArr = [
        setClassTypeListAction,
        setCourseTypeListAction,
        setCourseModuleListAction,
        setCourseContentListAction,
      ];
      let list = listArr[level - 1].toJS();
      list[index].state = params.state === 0 ? 1 : 0;
      dispatch(actionArr[level - 1](fromJS(list)));
      let transList = [];
      let transAction = [];
      if (params.state === 0 && level > 1) {
        // 上架把各级别的父节点的都上架
        // transList = listArr.slice(0, level - 1);
        // transAction = actionArr.slice(0, level - 1);
        // level, list, pid, transList, transAction
        handleParent(
          level,
          listArr[level - 2].toJS(),
          item.pid,
          listArr,
          actionArr,
        );
      } else {
        // 下架把子级的都下架
        transList = listArr.slice(level, listArr.length);
        transAction = actionArr.slice(level, listArr.length);
        if (transList.length > 0) {
          transList.forEach((child, i) => {
            let itemList = child.toJS();
            itemList.forEach((item1, index1) => {
              itemList[index1].state = 0;
            });
            dispatch(transAction[i](fromJS(itemList)));
          });
        }
      }
      function handleParent(level, list, pid, transList, transAction) {
        let currentParent = {};
        list.forEach((item, index) => {
          if (pid === item.id) {
            list[index].state = 1;
            currentParent = item;
            dispatch(transAction[level - 2](fromJS(list)));
            console.log(transAction[level - 2]);
          }
        });
        if (level === 2) {
          return false;
        } else {
          let nextLevel = level - 1;
          handleParent(
            nextLevel,
            transList[nextLevel - 2].toJS(),
            currentParent.pid,
            transList,
            transAction,
          );
        }
      }
    },
    handleILAFlag: (props, index, item) => {
      let list = props.classTypeList.toJS();
      list[index].ilaFlag = item.ilaFlag ? 0 : 1;
      dispatch(setClassTypeListAction(fromJS(list)));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseSystem);
