import React from 'react';
import styled from 'styled-components';
import { toNumber } from 'lodash';
import { fromJS } from 'immutable';
import { message, Button, Modal, Radio, Input, Popconfirm } from 'antd';
import { FlexRowCenter } from 'components/FlexBox';
import { numberToChinese } from 'components/CommonFn';

const RadioGroup = Radio.Group;
const Wrapper = styled.div`
  width: 100%;
  height: auto;
`;
const RowFlex = styled(FlexRowCenter)`
  height: 80px;
  flex-wrap: wrap;
`;
const EditSpan = styled.span`
  display: inline-block;
  margin: 0 5px;
  color: #4B8EFF;
  text-decoration: underline;
  cursor: pointer;
`;

class ChooseQuestionInPaper extends React.Component {
  state = {
    editModalShowState: false,
    editGroupIndex: 0,
    selectedType: '0',
    questionIndexList: [],
  }
  isEditRuleGroup = false;
  showEditModal = (state = {}) => {
    this.setState(Object.assign({}, {
      selectedType: '0',
      questionIndexList: [],
      editModalShowState: true,
    }, state));
    console.log('showEditModal');
  }
  onChangeRule = (e) => {
    const { ruleList } = this.props;
    const value = e.target.value;
    const listCount = toNumber(ruleList.find(item => item.get('itemCode') === value).get('extra'));
    this.setState({
      selectedType: value,
      questionIndexList: new Array(listCount).fill('')
    });
  }
  cancelModal = () => {
    this.setState({ editModalShowState: false }, () => {
      this.isEditRuleGroup = false;
    });
  }
  editGroupSure = () => {
    const { editGroup } = this.props;
    const finishEdit = editGroup(this.state);
    if (finishEdit.pass) {
      console.log('seuccess');
    } else {
      message(finishEdit.msg);
    }
  }
  addOrEditChooseGroup = () => {
    const { editGroupIndex } = this.state;

    const { groupList, ruleList, max } = this.props;
    const { questionIndexList, selectedType } = this.state;
    const type = ruleList.find((item) => item.get('itemCode') === selectedType);
    console.log(max, questionIndexList);
    if (questionIndexList.some((it) => it > max)) {
      message.warn('题号超出题目数量');
      return;
    }
    if (!type || (toNumber(type.get('extra')) !== new Set(questionIndexList.filter(it => it > 0)).size)) {
      message.warn('题号漏填或有重复');
      return;
    }
    const group = {
      selectedType: toNumber(selectedType),
      questionIndexList: questionIndexList.map((it) => toNumber(it)),
      groupIndex: groupList.count() + 1,
    };

    if (this.isEditRuleGroup && editGroupIndex > 0) {
      this.reChooseRule(group);
    } else {
      this.addChooseGroup(group);
    }
  }
  addChooseGroup = (group) => {
    const { changeRuleGroup } = this.props;
    if (changeRuleGroup) changeRuleGroup(Object.assign(group, { type: 'add' }), this.cancelModal);
  }
  reChooseRule = (group) => {
    const { editGroupIndex } = this.state;
    const { changeRuleGroup } = this.props;
    if (changeRuleGroup) changeRuleGroup(Object.assign(group, { groupIndex: editGroupIndex, type: 'edit' }), this.cancelModal);
  }
  deleteRule = (groupIndex) => {
    const { changeRuleGroup } = this.props;
    console.log(groupIndex, 'groupIndex - groupIndex');
    if (changeRuleGroup) changeRuleGroup({ groupIndex, type: 'delete' });
  }
  render() {
    const { groupList = fromJS([]), ruleList = fromJS([]), onlyView } = this.props;
    const { editModalShowState, selectedType, questionIndexList } = this.state;
    console.log(onlyView, 'onlyView');
    return (<Wrapper>
      {onlyView ? (<p><strong>选做题：</strong></p>) : (<div style={{ margin: '15px 0 5px' }}>
        <label><strong>选做题：</strong></label>
        <Button
          title="切换题目顺序后对应分组会自动更改"
          size="small" type="primary" onClick={this.showEditModal}
        >添加一组</Button>
      </div>)}
      {groupList.count() > 0 ? groupList.map((group, index) => {
        return (<div key={index}>
          <label>第{numberToChinese(group.get('groupIndex'))}组：{group.get('list').map(it => `第${it}题`).join('、')}（{group.get('name')}）</label>
          {onlyView ? null : (<EditSpan onClick={() => {
            this.isEditRuleGroup = true;
            this.showEditModal({
              editGroupIndex: toNumber(group.get('groupIndex')),
              selectedType: group.get('id'),
              questionIndexList: (group.get('list').toJS() || []).slice(0, group.get('extra')),
            });
          }}>修改</EditSpan>)}
          {onlyView ? null : (<Popconfirm placement="top" title="确认删除" onConfirm={() => this.deleteRule(group.get('groupIndex'))} okText="确认" cancelText="取消">
            <EditSpan>删除</EditSpan>
          </Popconfirm>)}
        </div>);
      }) : <p style={{ color: '#aaa' }}>本试卷没有设置选做题</p>}
      <Modal
        title="添加选做题"
        visible={editModalShowState}
        onCancel={this.cancelModal}
        onOk={this.addOrEditChooseGroup}
        zIndex={1001}
      >
        <RowFlex>
          <label>请选择选作方式：</label>
          <RadioGroup onChange={this.onChangeRule} value={selectedType}>
            {ruleList.map((rule) => (<Radio key={rule.get('id')} value={rule.get('itemCode')}>{rule.get('itemName')}</Radio>))}
          </RadioGroup>
        </RowFlex>
        <RowFlex>
          <label>{questionIndexList.length > 0 ? '请输入题号：' : '请先选择选做方式'}</label>
          {questionIndexList.map((it, index) => (<Input style={{ width: 50, marginRight: 20 }} type="number" key={index} value={it || ''} onChange={(e) => {
            const value = e.target.value;
            if (/^[1-9][0-9]*$/.test(value) || value === '') {
              questionIndexList.splice(index, 1, value);
              this.setState({ questionIndexList });
            }
          }}
          />))}
        </RowFlex>
      </Modal>
    </Wrapper>);
  }
}

export default ChooseQuestionInPaper;

// TODO: 添加修改和删除
// TODO：回调 editGroup，记得教研
// TODO: 补充 md
