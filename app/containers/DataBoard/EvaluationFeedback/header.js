import React from 'react';
import { DatePicker, Select, Input, Row, Col, Button, message } from 'antd';
import {
  getGrade,
  getSubject,
  getBIRuleList,
  getRoleList,
  getDiffEvalList,
  getNodesList
}
from './server';

const { RangePicker } = DatePicker;
const Option = Select.Option;

export default class Header extends React.Component {
  state = {
    gradeList: [], // 年级列表
    subjectList: [], // 学科列表
    biRuleList: [], // 算法筛选列表
    roleList: [], // 评价人列表
    diffEvalList: [], // 试卷难易列表
    accurateEvalList: [], // 整体评价列表
    assignTypeList: [], // 试卷来源列表
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    // 如果 props.gradeId 发生变化，则重新请求学科数据
    if (this.props.params.gradeId !== nextProps.params.gradeId) {
      this.handleGetSubject(nextProps.params.gradeId);
    }
  }

  /**
   * @description 初始化操作，获取年级、算法筛选、评价人列表
   * @return {void}
   */
  init = () => {
    // 获取年级
    getGrade().then(data => {
      this.setState({ gradeList: data });
    });
    // 获取算法筛选列表
    getBIRuleList().then(data => {
      this.setState({ biRuleList: data });
    });
    // 获取评价人列表
    getRoleList().then(data => {
      this.setState({ roleList: data });
    });
    // // 获取试卷难易列表
    // getDiffEvalList().then(data => {
    //   console.log('getDiffEvalList', data);
    // });
    // 获取试卷难易、整体评价、试卷来源列表
    getNodesList().then(data => {
      console.log('getNodesList', data);
      const { ACCURATE_EVAL: accurateEvalList, AI_EXAMTYPE: assignTypeList, DIFFICULT_EVAL: diffEvalList } = data;
      console.log('diffEvalList',  diffEvalList);
      this.setState({
        diffEvalList,
        accurateEvalList,
        assignTypeList
      });
    });


  };

  /**
   * @description 获取学科列表
   * @param {numer} gradeId 年级 id
   */
  handleGetSubject = (gradeId) => {
    this.setState({ subjectId: void 0 });
    getSubject(gradeId).then(data => {
      this.setState({ subjectList: data });
    });
  }

  /**
   * @description Select框的值发生变化，改变父级的值
   * @param {string} type 需要改变的字段
   * @param {string} value 值
   * @return {void}
   */
  handleSelectChange = (type, value) => {
    const selectTypeList = [
      'gradeId',
      'subjectId',
      'biRule',
      'role',
      'diffEval',
      'accurateEval',
      'assignType'
    ];
    if (selectTypeList.includes(type)) {
      this.props.onChange({ [type]: value }, true);
    }
  };

  /**
   * @description Input框的值发生变化，改变父级的值
   * @param {string} type 需要改变的字段
   * @param {event} e antd Input 传入的值
   * @return {void}
   */
  handleInputChange = (type, e) => {
    const value = e.target.value;
    const inputTypeList = ['teaUserId', 'teaUserName', 'stuUserId', 'stuUserName', 'proUserName'];
    const JAVA_INIT_MAX_VALUE = 2147483647; // java init 类型数字的最大值
    if (inputTypeList.includes(type)) {
      if (type === 'teaUserId' || type === 'stuUserId') {
         // 老师ID 和 学生ID 只能输入纯数字
        if (!(/^[0-9]*$/.test(value))) {
          // 保持提示只有一个
          if (!this.messageFlag1) {
            this.messageFlag1 = true;
            message.error('ID只能输入数字', 3, () => {
              this.messageFlag1 = false;
            });
          }
          return;
        }
        // id 不能超过最大值
        if (Number(value) > JAVA_INIT_MAX_VALUE) {
          // 保持提示只有一个
          if (!this.messageFlag2) {
            this.messageFlag2 = true;
            message.error('ID的最大值为2147483647', 3, () => {
              this.messageFlag2 = false;
            });
          }
          return;
        }
      }
      this.props.onChange({ [type]: value });
    }
  };

  /**
   * @description 时间框的值发生变化，改变父级的值
   * @param {Array} value 起止时间
   * @return {void}
   */
  handleChangeTime = value => {
    console.log(value);
    this.props.onChange({ startTime: value[0], overTime: value[1] });
  };

  render() {
    const {
      gradeList,
      subjectList,
      biRuleList,
      roleList,
      diffEvalList,
      accurateEvalList,
      assignTypeList
    } = this.state;
    const {
      startTime,
      overTime,
      gradeId,
      subjectId,
      biRule,
      role,
      stuUserId,
      stuUserName,
      teaUserId,
      teaUserName,
      proUserName,
      diffEval,
      accurateEval,
      assignType,
    } = this.props.params;
    return (
      <div>
        <Row>
          <Col span={4}>
            <label>评 价 人：</label>
            <Select
              placeholder="请选择评价人"
              style={{ width: 120 }}
              value={role}
              onChange={value => {
                this.handleSelectChange('role', value);
              }}
            >
              {roleList.map(el => (
                <Option key={el.id} value={`${el.id}`}>
                  {el.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <label>时间：</label>
            <RangePicker allowClear={false} format="YYYY-MM-DD" value={[startTime, overTime]} onChange={this.handleChangeTime} />
          </Col>
          <Col span={4}>
            <label> 年&nbsp;&nbsp;&nbsp;&nbsp;级 ：</label>
            <Select
              allowClear
              value={gradeId}
              placeholder="请选择年级"
              style={{ width: 120 }}
              onChange={value => {
                this.handleSelectChange('gradeId', value);
              }}
            >
              {gradeList.map(el => (
                <Option key={el.id} value={`${el.id}`}>
                  {el.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <label>学&nbsp;&nbsp;&nbsp;&nbsp;科：</label>
            <Select
              allowClear
              value={subjectId}
              placeholder={gradeId ? '请选择学科' : '请先选择年级'}
              style={{ width: 120 }}
              onChange={value => {
                this.handleSelectChange('subjectId', value);
              }}
            >
              {subjectList.map(el => (
                <Option key={el.id} value={`${el.id}`}>
                  {el.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <label>算法筛选：</label>
            <Select
              allowClear
              value={biRule}
              placeholder="请选择算法筛选"
              style={{ width: 120 }}
              onChange={value => {
                this.handleSelectChange('biRule', value);
              }}
            >
              {biRuleList.map(el => (
                <Option key={el.id} value={`${el.id}`}>
                  {el.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Col span={4}>
            <label>老师 ID ：</label>
            <Input
              value={teaUserId}
              placeholder="请输入老师ID"
              style={{ width: 120 }}
              onChange={e => {
                this.handleInputChange('teaUserId', e);
              }}
            />
          </Col>
          <Col span={4}>
            <label>老师姓名：</label>
            <Input
              value={teaUserName}
              placeholder="请输入老师姓名"
              style={{ width: 120 }}
              onChange={e => {
                this.handleInputChange('teaUserName', e);
              }}
            />
          </Col>
          <Col span={4}></Col>
          <Col span={4}>
            <label>学生 ID ：</label>
            <Input
              value={stuUserId}
              placeholder="请输入学生ID"
              style={{ width: 120 }}
              onChange={e => {
                this.handleInputChange('stuUserId', e);
              }}
            />
          </Col>
          <Col span={4}>
            <label>学生姓名：</label>
            <Input
              value={stuUserName}
              placeholder="请输入学生姓名"
              style={{ width: 120 }}
              onChange={e => {
                this.handleInputChange('stuUserName', e);
              }}
            />
          </Col>
          <Col span={4}>
            <label>教研姓名：</label>
            <Input
              value={proUserName}
              placeholder="请输入教研姓名"
              style={{ width: 120 }}
              onChange={e => {
                this.handleInputChange('proUserName', e);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Col span={4}>
            <label>试卷难易：</label>
            <Select
              placeholder="请选择试卷难易"
              style={{ width: 120 }}
              value={diffEval}
              onChange={value => {
                this.handleSelectChange('diffEval', value);
              }}
              allowClear
            >
              {diffEvalList.map(el => (
                <Option key={el.itemCode} value={`${el.itemCode}`}>
                  {el.itemName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <label>整体评价：</label>
            <Select
              placeholder="请选择整体评价"
              style={{ width: 120 }}
              value={accurateEval}
              onChange={value => {
                this.handleSelectChange('accurateEval', value);
              }}
              allowClear
            >
              {accurateEvalList.map(el => (
                <Option key={el.itemCode} value={`${el.itemCode}`}>
                  {el.itemName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <label>试卷来源：</label>
            <Select
              placeholder="请选择试卷来源"
              style={{ width: 120 }}
              value={assignType}
              onChange={value => {
                this.handleSelectChange('assignType', value);
              }}
              allowClear
            >
              {assignTypeList.map(el => (
                <Option key={el.itemCode} value={`${el.itemCode}`}>
                  {el.itemName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={this.props.onSubmit}>
              查询
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
