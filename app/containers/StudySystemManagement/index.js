/*
 *
 * StudySystemManagement
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Immutable from 'immutable';
import {
  getClassTypeListAction,
  getGradeListAction,
  setLeveFirstListAction,
  setLeveSecondListAction,
  setLeveThreeListAction,
  setInputDtoAction,
  setAddExit,
  getListLeveFirstAction,
  saveAction,
  setCrudIdAction,
  setClaseTypeAction,
  deleteAction,
  setLeveFirstIdAction,
  setLeveSecondIdAction,
  getSecondLevelListAction,
  getThreeLevelListAction,
  setLeveThreeIdAction,
  getGradeSubjectListAction,
  setGradeAction,
  setGradeSubjectAction,
  sortAction,
  getEditionListAction,
  setEditionAction
} from './actions';
import makeSelectStudySystemManagement, {
  makeClassTypeList,
  makeClassType,
  makeSelectGradeList,
  makeSelectGrade,
  makeSelectGradeSubjectList,
  makeSelectGradeSubject,
  makeSelectFirstLevel,
  makeSelectSecondlevel,
  makeSelectThreelevel,
  makeSelectInputDto,
  makeSelectAddExit,
  makeSelectCrudId,
  makeSelectFirstLevelId,
  makeSelectSecondLevelId,
  makeSelectThreeLevelId,
  makeEdition,
  makeEditionList
} from './selectors';
import {
  FlexRowDiv,
  FlexColumnDiv,
} from 'components/Div';
import styled from 'styled-components';
import {
  Select,
  Row,
  Col,
  message,
} from 'antd';
import ListView, { ListViewItem } from '../../components/ListView/index';
const pic_null = window._baseUrl.imgCdn + '18cdee41-78a4-4873-b815-17cbf07aaab2.png';

const RootDiv = styled(FlexColumnDiv)`
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  background: #fff;
  overflow-y: auto;
`;
const Headerwrap = styled.div`
  padding: 20px 0 15px;
  .row {
    width: 100%;
    .gutter-row > div {
      width: 100%;
    }
  }
`;
const BodyWrapper = styled(FlexRowDiv)`
  background-color: #f5f6f8;
  overflow: auto;
  > div {
    width: auto !important;
  }
`;
export class StudySystemManagement extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(getClassTypeListAction());
    this.props.dispatch(getGradeListAction());
  }
  render() {
    let firstLevelItems = [];
    let secondLevelItems = [];
    let threeLevelItems = [];
    console.log('editionList', this.props.editionList.toJS());
    if (this.props.firstLevelList.size > 0) {
      firstLevelItems = this.props.firstLevelList.toJS().map((item, index) => {
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
          if (item.id === this.props.selectFirstLevelId) {
            selected = true;
          }
          if (!selected && index !== this.props.firstLevelList.toJS().length) {
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
            />
          );
        }
      });
    } else {
      firstLevelItems.push(
        <div
          key={1}
          style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}
        >
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>
      );
    }
    if (this.props.secondlevellList.size > 0) {
      secondLevelItems = this.props.secondlevellList
        .toJS()
        .map((item, index) => {
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
            if (item.id === this.props.selectSecondLevelId) {
              selected = true;
            }
            if (
              !selected &&
              index !== this.props.secondlevellList.toJS().length
            ) {
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
              />
            );
          }
        });
    } else {
      secondLevelItems.push(
        <div
          key={1}
          style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}
        >
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>
      );
    }
    if (this.props.threelevellList.size > 0) {
      threeLevelItems = this.props.threelevellList.toJS().map((item, index) => {
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
          if (item.id === this.props.selectThreeLevelId) {
            selected = true;
          }
          if (!selected && index !== this.props.threelevellList.toJS().length) {
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
            />
          );
        }
      });
    } else {
      threeLevelItems.push(
        <div
          key={1}
          style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}
        >
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>
      );
    }
    return (
      <RootDiv className="RootDiv">
        <Headerwrap>
          <Row type="flex" justify="start" gutter={32} className="row">
            <Col span={3} className="gutter-row">
              <Select
                className={'selectCls'}
                style={{ width: 120, height: 40 }}
                size="large"
                value={{
                  key: this.props.classType.get('code').toString(),
                  label: this.props.classType.get('value')
                }}
                labelInValue
                onChange={value =>
                  this.props.handleClassTypeSelectOnChange(value, this.props)
                }
              >
                {this.props.classTypeList.map(item => (
                  <Select.Option
                    value={item.get('code').toString()}
                    key={item.get('code')}
                    title={item.get('value')}
                  >
                    {item.get('value')}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={3} className="gutter-row">
              <Select
                className={'selectCls'}
                style={{ width: 120, height: 40 }}
                size="large"
                value={{
                  key: this.props.selectgrade.get('id').toString(),
                  label: this.props.selectgrade.get('name')
                }}
                labelInValue
                onChange={value =>
                  this.props.handleGradeSelectOnChange(value, this.props)
                }
              >
                {this.props.gradeList.map(item => (
                  <Select.Option
                    value={item.get('id').toString()}
                    key={item.get('id')}
                    title={item.get('name')}
                  >
                    {item.get('name')}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={3} className="gutter-row">
              <Select
                className={'selectCls'}
                style={{ width: 120, height: 40 }}
                size="large"
                value={{
                  key: this.props.selectGradeSubject
                    .get('id')
                    .toString(),
                  label: this.props.selectGradeSubject.get('name')
                }}
                labelInValue
                onChange={value =>
                  this.props.handleSubjectSelectOnChange(value, this.props)
                }
              >
                {this.props.gradeSubjectList.map(item => (
                  <Select.Option
                    value={item.get('id').toString()}
                    key={item.get('id')}
                    title={item.get('name')}
                  >
                    {item.get('name')}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={3} className="gutter-row">
              <Select
                className={'selectCls'}
                style={{ width: '100%', height: 40 }}
                size="large"
                value={{
                  key: this.props.edition.get('id').toString(),
                  label: this.props.edition.get('name')
                }}
                labelInValue
                onChange={value =>
                  this.props.handleEditionSelectOnChange(value, this.props)
                }
              >
                {this.props.editionList.map(item => (
                  <Select.Option
                    value={item.get('id').toString()}
                    key={item.get('id')}
                    title={item.get('name')}
                  >
                    {item.get('name')}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Headerwrap>
        <BodyWrapper>
          <div
            style={{ whiteSpace: 'nowrap', textAlign: 'center', width: '100%' }}
          >
            <ListView
              className="ListViewWrap"
              title={'1级类别目录'}
              onFooterBtnClick={() =>
                this.props.handleOnFooterBtnClick(
                  1,
                  this.props.firstLevelList,
                  this.props.inputDto,
                  this.props.addExist,
                  this.props
                )
              }
            >
              {firstLevelItems}
            </ListView>
            <ListView
              className="ListViewWrap"
              title={'2级类别目录'}
              onFooterBtnClick={() =>
                this.props.handleOnFooterBtnClick(
                  2,
                  this.props.secondlevellList,
                  this.props.inputDto,
                  this.props.addExist,
                  this.props
                )
              }
            >
              {secondLevelItems}
            </ListView>
            <ListView
              className="ListViewWrap"
              title={'3级类别目录'}
              onFooterBtnClick={() =>
                this.props.handleOnFooterBtnClick(
                  3,
                  this.props.threelevellList,
                  this.props.inputDto,
                  this.props.addExist,
                  this.props
                )
              }
            >
              {threeLevelItems}
            </ListView>
          </div>
        </BodyWrapper>
      </RootDiv>
    );
  }
}

StudySystemManagement.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classTypeList: PropTypes.instanceOf(Immutable.List).isRequired,
  classType: PropTypes.instanceOf(Immutable.Map).isRequired,
  gradeList: PropTypes.instanceOf(Immutable.List).isRequired,
  selectgrade: PropTypes.instanceOf(Immutable.Map).isRequired,
  gradeSubjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  selectGradeSubject: PropTypes.instanceOf(Immutable.Map).isRequired,
  firstLevelList: PropTypes.instanceOf(Immutable.List).isRequired,
  threelevellList: PropTypes.instanceOf(Immutable.List).isRequired,
  inputDto: PropTypes.instanceOf(Immutable.Map).isRequired,
  addExist: PropTypes.bool.isRequired,
  selectFirstLevelId: PropTypes.number.isRequired,
  selectSecondLevelId: PropTypes.number.isRequired,
  selectThreeLevelId: PropTypes.number.isRequired
};

const mapStateToProps = createStructuredSelector({
  StudySystemManagement: makeSelectStudySystemManagement(),
  classTypeList: makeClassTypeList(),
  classType: makeClassType(),
  gradeList: makeSelectGradeList(),
  selectgrade: makeSelectGrade(),
  gradeSubjectList: makeSelectGradeSubjectList(),
  selectGradeSubject: makeSelectGradeSubject(),
  firstLevelList: makeSelectFirstLevel(),
  secondlevellList: makeSelectSecondlevel(),
  threelevellList: makeSelectThreelevel(),
  inputDto: makeSelectInputDto(),
  addExist: makeSelectAddExit(),
  crudId: makeSelectCrudId(),
  selectFirstLevelId: makeSelectFirstLevelId(),
  selectSecondLevelId: makeSelectSecondLevelId(),
  selectThreeLevelId: makeSelectThreeLevelId(),
  editionList: makeEditionList(),
  edition: makeEdition(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleOnFooterBtnClick: (level, list, inputDto, exit, props) => {
      if (exit) {
        message.warning('请先完成之前的操作');
        return false;
      }
      dispatch(setCrudIdAction(0));
      dispatch(
        setInputDtoAction(
          // inputDto.set('level', level).set('name', '').set('courseHour', 0).set('knowledgeIds', [])
          inputDto.set('level', level).set('name', '')
        )
      );
      const _new = Immutable.fromJS({
        id: 0,
        name: '',
        courseHour: 0,
        editable: true
      });
      if (level === 1) {
        dispatch(setLeveFirstListAction(list.push(_new)));
      } else if (level === 2) {
        if (props.firstLevelList.size === 0) {
          message.warning('请先添加上级目录');
          return;
        }
        dispatch(setLeveSecondListAction(list.push(_new)));
      } else if (level === 3) {
        if (props.secondlevellList.size === 0) {
          message.warning('请先添加上级目录');
          return;
        }
        dispatch(setLeveThreeListAction(list.push(_new)));
      }
      dispatch(setAddExit(true));
    },
    cancel: () => {
      console.log('cancel');
      dispatch(setAddExit(false));
      dispatch(getListLeveFirstAction());
    },
    onChange: (e, value) => {
      dispatch(setInputDtoAction(value.set('name', e.target.value)));
    },
    save: () => {
      console.log('save');
      dispatch(setAddExit(false));
      dispatch(saveAction());
    },
    handleClassTypeSelectOnChange: value => {
      dispatch(
        setClaseTypeAction(
          Immutable.fromJS({ code: value.key, value: value.label })
        )
      );
      dispatch(getGradeListAction());
    },
    handleGradeSelectOnChange: value => {
      dispatch(
        setGradeAction(
          Immutable.fromJS({ id: value.key, name: value.label })
        )
      );
      dispatch(getGradeSubjectListAction());
    },
    handleSubjectSelectOnChange: value => {
      dispatch(
        setGradeSubjectAction(
          Immutable.fromJS({ id: value.key, name: value.label })
        )
      );
      dispatch(getEditionListAction());
    },
    handleEditionSelectOnChange: value => {
      dispatch(
        setEditionAction(
          Immutable.fromJS({ id: value.key, name: value.label })
        )
      );
      dispatch(getListLeveFirstAction());
    },
    onMouseOver: (level, index, props) => {
      if (level === 1) {
        const editor = props.firstLevelList.find(
          value => value.get('editable') === true
        );
        if (editor) {
          return;
        }
        const list = props.firstLevelList.map((value, index2) =>
          value.set('toolBarVisible', index === index2)
        );
        dispatch(setLeveFirstListAction(list));
      } else if (level === 2) {
        const editor = props.secondlevellList.find(
          value => value.get('editable') === true
        );
        if (editor) {
          return;
        }
        const list = props.secondlevellList.map((value, index2) =>
          value.set('toolBarVisible', index === index2)
        );
        dispatch(setLeveSecondListAction(list));
      } else if (level === 3) {
        const editor = props.threelevellList.find(
          value => value.get('editable') === true
        );
        if (editor) {
          return;
        }
        const list = props.threelevellList.map((value, index2) =>
          value.set('toolBarVisible', index === index2)
        );
        dispatch(setLeveThreeListAction(list));
      }
    },
    onMouseLeave: (level, props) => {
      // console.log('props.crudId:', props.crudId);
      if (props.crudId !== 0) {
        return;
      }
      if (level === 1) {
        const list = props.firstLevelList.map(value =>
          value.set('toolBarVisible', false)
        );
        dispatch(setLeveFirstListAction(list));
      } else if (level === 2) {
        const list = props.secondlevellList.map(value =>
          value.set('toolBarVisible', false)
        );
        dispatch(setLeveSecondListAction(list));
      } else if (level === 3) {
        const list = props.threelevellList.map(value =>
          value.set('toolBarVisible', false)
        );
        dispatch(setLeveThreeListAction(list));
      }
    },
    goToUpdate: (e, level, index, props) => {
      e.stopPropagation();
      if (props.addExist) {
        message.warning('请先完成之前的操作');
        return;
      }
      if (level === 1) {
        const list = props.firstLevelList.map((value, index2) =>
          value.set('editable', index === index2)
        );
        dispatch(setLeveFirstListAction(list));
        const classType = props.firstLevelList.get(index);
        console.log('classType:', classType.toJS());
        dispatch(setCrudIdAction(classType.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('name', classType.get('name'))
          )
        );
      } else if (level === 2) {
        const list = props.secondlevellList.map((value, index2) =>
          value.set('editable', index === index2)
        );
        dispatch(setLeveSecondListAction(list));
        const courseType = props.secondlevellList.get(index);
        dispatch(setCrudIdAction(courseType.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('name', courseType.get('name'))
          )
        );
      } else if (level === 3) {
        const list = props.threelevellList.map((value, index2) =>
          value.set('editable', index === index2)
        );
        dispatch(setLeveThreeListAction(list));
        const courseModule = props.threelevellList.get(index);
        dispatch(setCrudIdAction(courseModule.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('name', courseModule.get('name'))
          )
        );
      }
      dispatch(setAddExit(true));
    },
    goToDelete: (e, level, index, props) => {
      e.stopPropagation();
      if (props.addExist) {
        message.warning('请先完成之前的操作');
        return;
      }
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      let deleteId;
      if (level === 1) {
        deleteId = props.firstLevelList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 2) {
        deleteId = props.secondlevellList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 3) {
        deleteId = props.threelevellList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      }
    },
    handlePopCancel: e => {
      e.stopPropagation();
      dispatch(setCrudIdAction(0));
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
        deleteId = props.firstLevelList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 2) {
        console.log('level === 2');
        deleteId = props.secondlevellList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      } else if (level === 3) {
        deleteId = props.threelevellList.get(index).get('id');
        dispatch(setCrudIdAction(deleteId));
      }
      dispatch(deleteAction());
      console.log('handleDelete');
    },
    handleCourseSystemItemOnClick: (level, value) => {
      console.log('点击了：', level, value);
      if (level === 1) {
        dispatch(setLeveFirstIdAction(value));
        dispatch(getSecondLevelListAction());
      } else if (level === 2) {
        dispatch(setLeveSecondIdAction(value));
        dispatch(getThreeLevelListAction());
      } else if (level === 3) {
        dispatch(setLeveThreeIdAction(value));
        // dispatch(getCourseContentAction());
      }
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
        list = props.firstLevelList;
      } else if (level === 2) {
        list = props.secondlevellList;
      } else if (level === 3) {
        list = props.threelevellList;
      }
      const oldData = list.get(data.index);
      const newData = list.get(index);
      const arr = list.set(data.index, newData).set(index, oldData);
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      if (level === 1) {
        dispatch(setLeveFirstListAction(arr));
      } else if (level === 2) {
        dispatch(setLeveSecondListAction(arr));
      } else if (level === 3) {
        dispatch(setLeveThreeListAction(arr));
      }
      dispatch(sortAction());
      console.log('拖动结束', level, index, arr.toJS());
    },
    onDragOver: e => {
      e.preventDefault();
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudySystemManagement);
