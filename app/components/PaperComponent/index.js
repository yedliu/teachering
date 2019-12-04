/* eslint-disable no-undefined */
/* eslint-disable max-nested-callbacks */
/*
  hasTeachingVersion: 是否有教材版本
  hasCourseSystem: 是否有课程内容
  gradeId: 年级
  subjectId: 学科
  teachingEditionId: 教材版本
  editionId: 课程内容版本
  grade: 为了根据fradeId找到parseId
  versionValue: 教材版本节点value
  systemValue: 课程体系value
  showSystemList: 展示区域（name集合）形如{name: '课程A'}
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Select, TreeSelect, message } from 'antd';
import { fromJS } from 'immutable';
import _ from 'lodash';

import { FlexRowCenter } from 'components/FlexBox';
import { getCourseSystemList, getTeachingVersionList,
  getTeachingVersions, getCourseSystemVersions,
  getExamPaperNumByCourseContent, getExamPaperNumByTextbook } from './server';
import ChooseQuestionInPaper from './chooseQuestionInPaper';

export class PaperComponent extends React.Component {
  constructor(props) {
    super(props);
    this.DEFAULT = {
      teachingVersion: fromJS({
        data: [],
        selectedId: '',
        versionTreeData: [],
        versionValue: null, // 最终选择的节点
      }),
      courseSystem: fromJS({
        data: [],
        selectedId: '',
        systemTreeData: [],
        systemValue: null, // 最终选择的节点
      }),
      myTcourseSystem: fromJS([]), // 展示用
    };
    this.state = this.DEFAULT;
    this.teachingVersionChange = this.teachingVersionChange.bind(this);
    this.teachingOnChange = this.teachingOnChange.bind(this); // 节点改变
    this.courseSystemChange = this.courseSystemChange.bind(this);
    this.courseOnChange = this.courseOnChange.bind(this); // 节点改变
    this.modalShow = this.modalShow.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  addTreeKey = (obj, disabled) => {
    obj.value = String(obj.id);
    obj.key = String(obj.id);
    obj.label = obj.name;
    if (disabled) {
      obj.selectable = false;
    }
  }

  // 选择教材版本节点
  teachingOnChange(e) {
    const { teachingVersion } = this.state;
    e && typeof e.label === 'object' ? e.label = e.label.props.children[0] : '';
    this.setState({
      teachingVersion: teachingVersion.set('versionValue', e ? fromJS(e) : null)
    });
  }

  // 选择教材版本
  teachingVersionChange(value) {
    const { teachingVersion } = this.state;
    // 获取教材版本节点
    this.setState({
      teachingVersion: teachingVersion.set('versionValue', null).set('versionTreeData', fromJS([]))
    }, () => {
      this.renderTeachingVersion(value);
    });
  }

  // 获取教材版本循环方法
  renderTeachingVersion = (value) => {
    this.setState({
      teachingVersion: this.state.teachingVersion.set('selectedId', value)
    });
    if (!value) {
      return;
    }
    const { gradeId } = this.props;
    const lastItems = []; // 把最后一级的所有节点拿到
    getTeachingVersionList(value, '', gradeId).then(res => {
      if (_.toString(res.code) === '0') {
        res.data && res.data.forEach(first => {
          getTeachingVersionList(value, first.id, gradeId).then(res1 => {
            if (!(_.toString(res1.code) === '0' && res1.data && res1.data.length > 0)) {
              this.addTreeKey(first);
              lastItems.push(first);
              return;
            }
            this.addTreeKey(first, true);
            first.children = res1.data;
            first.children.forEach(second => {
              getTeachingVersionList(value, second.id, gradeId).then(res2 => {
                if (!(_.toString(res2.code) === '0' && res2.data && res2.data.length > 0)) {
                  this.addTreeKey(second);
                  lastItems.push(second);
                  return;
                }
                this.addTreeKey(second, true);
                second.children = res2.data;
                second.children.forEach(third => {
                  getTeachingVersionList(value, third.id, gradeId).then(res3 => {
                    if (!(_.toString(res3.code) === '0' && res3.data && res3.data.length > 0)) {
                      this.addTreeKey(third);
                      lastItems.push(third);
                      return;
                    }
                    this.addTreeKey(third, true);
                    third.children = [];
                    res3.data.forEach(item => {
                      const _i = {};
                      _i.value = String(item.id);
                      _i.id = String(item.id);
                      _i.key = item.id;
                      _i.label = item.name;
                      third.children.push(_i);
                      lastItems.push(_i);
                    });
                  });
                });
              });
            });
          });
        });
        setTimeout(() => {
          // 请求结束渲染页面
          this.setState({
            teachingVersion: this.state.teachingVersion.set('versionTreeData', fromJS(res.data))
          }, () => {
            /** 关联统计数据 */
            const ids = lastItems.map(i => i.id);
            this.getPaperNum(ids, lastItems, getExamPaperNumByTextbook, () => {
              this.setState({
                teachingVersion: this.state.teachingVersion.set('versionTreeData', fromJS(res.data))
              });
            });
            /** 关联统计数据 */
          });
        }, 600);
      } else {
        message.error('获取教材版本节点失败');
      }
    });
  }

  // 选择课程体系节点
  courseOnChange(e) {
    const { courseSystem } = this.state;
    e && typeof e.label === 'object' ? e.label = e.label.props.children[0] : '';
    this.setState({
      courseSystem: courseSystem.set('systemValue', e ? fromJS(e) : null)
    });
  }

  // 选择课程体系
  courseSystemChange(value) {
    const { courseSystem } = this.state;
    this.setState({
      courseSystem: courseSystem.set('systemValue', null).set('systemTreeData', fromJS([]))
    }, () => {
      // 获取课程体系节点
      this.renderCourseSsystem(value);
    });
  }

  // 获取课程内容循环方法
  renderCourseSsystem = (value) => {
    this.setState({
      courseSystem: this.state.courseSystem.set('selectedId', value)
    });
    if (!value) {
      return;
    }
    const { gradeId, subjectId } = this.props;
    getCourseSystemList(gradeId, subjectId, value).then(res => {
      if (_.toString(res.code) === '0') {
        const ids = []; // 把第四级的所有关联试卷数据拿到
        const fourthItems = []; // 把第四级的所有节点拿到
        const loopChildren = (list) => {
          list && list.forEach(item => {
            this.addTreeKey(item, _.toNumber(item.level) !== 4 ? true : false);
            if (item.children) {
              loopChildren(item.children);
              if (_.toNumber(item.level) === 3) {
                item.children.forEach(item => {
                  ids.push(item.id);
                  fourthItems.push(item);
                });
              }
            }
          });
        };
        loopChildren(res.data);
        this.setState({
          courseSystem: this.state.courseSystem.set('systemTreeData', fromJS(res.data))
        }, () => {
          /** 关联统计数据 */
          this.getPaperNum(ids, fourthItems, getExamPaperNumByCourseContent, () => {
            this.setState({
              courseSystem: this.state.courseSystem.set('systemTreeData', fromJS(res.data))
            });
          });
          /** 关联统计数据 */
        });
      } else {
        message.error(res.message || '获取课程体系出错');
      }
    });
  }

  getPaperNum = (ids, items, apiFunc, cb) => {
    if (ids.length === 0) return;
    apiFunc(ids).then(_res => {
      if (_.toString(_res.code) === '0') {
        const map = _res.data;
        // 给所有第四级挂上统计数据
        items && items.forEach(item => {
          // console.log('item.id', item.id)
          const total = map[item.id];
          if (total) {
            item.label = <span>{item.label}<i style={{ color: '#108ee9', fontStyle: 'normal' }}> (已关联{total}份测评)</i></span>;
          } else {
            item.label = <span>{item.label}<i style={{ color: '#ccc', fontStyle: 'normal' }}> (暂无关联测评)</i></span>;
          }
        });
      } else {
        message.error('获取关联统计数据失败');
      }
      cb();
    });
  }

  getVersionAndCourse = () => {
    // 获取版本和课程
    const { subjectId, gradeId, gradeList, versionValue, systemValue } = this.props;
    getTeachingVersions(subjectId, gradeId, gradeList).then(res => {
      if (_.toString(res.code) === '0') {
        this.setState({
          teachingVersion: this.state.teachingVersion.set('data', fromJS(res.data)).set('versionValue', versionValue ? fromJS(versionValue) : null)
        });
      } else {
        message.error('获取教材版本出错');
      }
    });
    getCourseSystemVersions(subjectId, gradeId).then(res => {
      if (_.toString(res.code) === '0') {
        this.setState({
          courseSystem: this.state.courseSystem.set('data', fromJS(res.data)).set('systemValue', systemValue ? fromJS(systemValue) : null)
        });
      } else {
        if (_.toString(res.code) === '-99') {
          message.error('获取课程体系超时');
        } else {
          message.error('获取课程体系出错');
        }
      }
    });
    // 获取节点
    const { teachingEditionId, editionId } = this.props;
    if (teachingEditionId) {
      this.renderTeachingVersion(teachingEditionId);
    }
    if (editionId) {
      this.renderCourseSsystem(editionId);
    }
  }

  // 每次打开关闭会执行的方法
  modalShow(bool) {
    if (bool) {
      const { gradeId, subjectId, gradeList } = this.props;
      if (!(gradeId > 0 && subjectId > 0)) {
        message.info('请先选择年级学科');
        return;
      }
      if (!(gradeList && gradeList.length > 0)) {
        message.info('传入的年级列表为为空, 可能会导致获取的教材版本异常');
      }
      this.setState({
        modalShow: bool
      });
      this.getVersionAndCourse();
    } else {
      this.setState(Object.assign(this.DEFAULT, { modalShow: false }));
    }
  }

  onOk(teachingVersion, courseSystem) {
    const { onOk } = this.props;
    const systemName = courseSystem.getIn(['systemValue', 'label']);
    let systemList = systemName ? [{ name: systemName }] : [];
    const item1 = (teachingVersion.get('data') || fromJS([])).find(e => _.toString(e.get('id')) === _.toString(teachingVersion.get('selectedId'))) || fromJS({});
    const item2 = (courseSystem.get('data') || fromJS([])).find(e => _.toString(e.get('id')) === _.toString(courseSystem.get('selectedId'))) || fromJS({});
    onOk(teachingVersion.set('teachingEditionName', item1.get('name')), courseSystem.set('editionName', item2.get('name')).set('showSystemList', fromJS(systemList || [])));
  }

  changeRuleGroup = (data, closeCallback) => {
    const { changeRuleGroup } = this.props;
    if (changeRuleGroup) {
      changeRuleGroup(data, closeCallback);
    }
  }

  render() {
    const {
      hasTeachingVersion, hasCourseSystem, teachingEditionName,
      showSystemList,
      groupList, ruleList, maxQuestionNum, hidden // 选做题分组专用
    } = this.props;
    // console.log('showSystemList', showSystemList.toJS());
    const { teachingVersion, courseSystem, modalShow } = this.state;
    const versionTreeData = teachingVersion.get('versionTreeData').toJS();
    const systemTreeData = courseSystem.get('systemTreeData').toJS();
    const editionId = courseSystem.get('selectedId');
    const teachingEditionId = teachingVersion.get('selectedId');
    const teachingData = teachingVersion.get('data');
    const systemData = courseSystem.get('data') ? courseSystem.get('data').filter(item => _.toString(item.get('classTypeCode')) !== '2') : [];
    const title = `关联${hasTeachingVersion ? '教材版本' : ''}${hasTeachingVersion && hasCourseSystem ? '和' : ''}${hasCourseSystem ? '课程体系' : ''}`;
    return (
      <div>
        <Button type="primary" style={{ margin: '5px 0', padding: '5px 15px' }} icon="arrows-alt" onClick={() => this.modalShow(true)}>{title}</Button>
        {hasTeachingVersion ? <div>教材版本：{teachingEditionName || '暂无'}</div> : ''}
        {hasCourseSystem ? <div>课程内容：{showSystemList && showSystemList.getIn([0, 'name']) || '暂无'}</div> : ''}
        {/* TODO：限制只有组卷或编辑时才显示 <ChooseQuestionInPaper /> */}
        {groupList && !hidden ? <ChooseQuestionInPaper
          changeRuleGroup={this.changeRuleGroup}
          groupList={groupList}
          ruleList={ruleList}
          max={maxQuestionNum}
        /> : null}
        <Modal
          visible={modalShow}
          maskClosable={false}
          width="600px"
          title={title}
          onOk={() => {
            this.onOk(teachingVersion, courseSystem);
            this.modalShow(false);
          }}
          onCancel={() => {
            this.modalShow(false);
          }}>
          {hasTeachingVersion ? (
            <FlexRowCenter style={{ height: 35 }}>
              <span style={{ display: 'inline-block', width: 60, textAlign: 'right' }}>教材版本：</span>
              <Select
                allowClear
                value={teachingEditionId || undefined}
                notFoundContent="没有数据"
                style={{
                  width: 150,
                  marginRight: 20
                }}
                placeholder={`请选择版本类型`}
                onChange={this.teachingVersionChange}
              >
                {teachingData.map((it, i) => (<Select.Option key={i} value={_.toString(it.get('id'))}>{_.toString(it.get('name') || '')}</Select.Option>))}
              </Select>
              <TreeSelect
                allowClear
                labelInValue
                treeData={versionTreeData}
                showSearch
                treeNodeFilterProp="title"
                searchPlaceholder="搜索教材版本"
                notFoundContent="没有数据"
                value={teachingVersion.get('versionValue') ? teachingVersion.get('versionValue').toJS() : undefined}
                onChange={this.teachingOnChange}
                placeholder="请选择节点（需先选择教材版本）"
                style={{ width: 300 }}
              />
            </FlexRowCenter>
          ) : ''}
          {hasCourseSystem ? (
            <div>
              <FlexRowCenter style={{ height: 35 }}>
                <span style={{ display: 'inline-block', width: 60, textAlign: 'right' }}>课程：</span>
                <Select
                  allowClear
                  value={editionId || undefined}
                  notFoundContent="没有数据"
                  style={{
                    width: 150,
                    marginRight: 20
                  }}
                  placeholder={`请选择课程}`}
                  onChange={this.courseSystemChange}>
                  {systemData.map((it, i) => (<Select.Option key={i} value={_.toString(it.get('id'))}>{_.toString(it.get('name') || '')}</Select.Option>))}
                </Select>
                <TreeSelect
                  allowClear
                  labelInValue
                  treeData={systemTreeData}
                  showSearch
                  treeNodeFilterProp="title"
                  searchPlaceholder="搜索课程内容"
                  notFoundContent="没有数据"
                  value={courseSystem.get('systemValue') ? courseSystem.get('systemValue').toJS() : undefined}
                  onChange={this.courseOnChange}
                  placeholder="请选择课程体系（需先选择课程）"
                  style={{ width: 300 }}
                />
              </FlexRowCenter>
              <span style={{ marginLeft: 10, color: 'red' }}>课程内容只能选择第四级</span>
            </div>
          ) : ''}
        </Modal>
      </div>
    );
  }
}

PaperComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(PaperComponent);
