/*
 *
 * TextbookEdition
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { createStructuredSelector } from 'reselect';
import { RootWrapper } from 'components/CommonFn/style';
import styled from 'styled-components';
import { Form, Input, Button, Select, Table, Modal, message, TreeSelect, Popconfirm } from 'antd';
const FormItem = Form.Item;
import ListView, { ListViewItem } from '../../components/ListView/index';
const pic_null = window._baseUrl.imgCdn + '18cdee41-78a4-4873-b815-17cbf07aaab2.png';
import {  FlexColumn, FlexRow, FlexRowCenter } from 'components/FlexBox';

import {
  makeSelectPhase,
  makeSelectPhaseList,
  makeSelectSubjectList,
  makeSelectSubject,
  makeSelectGradeList,
  makeSelectGradeId,
  makeSelectSubjectId,
  makeSelectSubjectEditionList,
  makeSelectAddNew,
  makeSelectInputChangeList,
  makeSelectTextbookList,
  makeSelectTextbook,
  makeSelectCrudId,
  makeSelectEditionList,
  makeSelectEditionId,
  makeSelectKnowledgeList,
  makeSelectSelectedKnowledgeList,
  makeSelectKnowledge,
  makeSelectKnowledgeCrudId,
  makeSelectInputDto,
  makeSelectFirstNodeList,
  makeSelectFirstNodeId,
  makeSelectAddExit,
  makeSelectSecondNodeList,
  makeSelectSecondNodeId,
  makeSelectThreeNodeList,
  makeSelectThreeNodeId,
  makeSelectFourNodeList,
  makeSelectFourNodeId,
  makeSelectModalAttr,
  makeSelectAddLevel
} from './selectors';
import {
  getPhaseListAction,
  setPhaseAction,
  getSubjectListAction,
  setSubjectAction,
  setGradeIdAction,
  getGradeAction,
  setSubjectIdAction,
  getSubjectAction,
  setAddNew,
  setInputChangeAction,
  getTextbookListAction,
  saveTextbookAction,
  setCrudIdAction,
  deleteAction,
  getEditionListAction,
  setInputDtoAction,
  setKnowledgeCrudIdAction,
  setFirstNodeListAction,
  setAddExit,
  getFirstNodeListAction,
  saveAction,
  setFirstNodeIdAction,
  deleteNodeAction,
  setSecondNodeListAction,
  setSecondNodeIdAction,
  getSecondNodeListAction,
  setEditionIdAction,
  setThreeNodeListAction,
  setThreeNodeIdAction,
  getThreeNodeListAction,
  setFourNodeListAction,
  getFourNodeListAction,
  setFourNodeIdAction,
  setModalAttrAction,
  getKnowledgeListAction,
  deleteLevelAction,
  setAddLevelAction,
  sortAction
} from './actions';

const RootWrapperBox = styled(RootWrapper)`
  background: #fff;
`;

const ButtonBox = styled.div`
  display: flex;
  margin-left: 10px;
`;
const TitleButton = styled.div`
  width: 150px;
  height: 40px;
  background-color: ${(props) => (props.active ? 'rgba(153, 153, 153, 1)' : 'rgba(242, 242, 242, 1)')};
  text-align: center;
  line-height: 40px;
  font-size: ${(props) => (props.active ? '16px' : '14px')};
  color:${(props) => (props.active ? '#fff' : '#333')};
  font-weight: 400;
  cursor: pointer;
`;

const BottomLine = styled.div`
  height: 2px;
  width: 100%;
  background: #333;
`;

const BodyWrapper = styled(FlexRow)`
  justify-content:flex-start;
  width: 100%;
  height: auto;
  background-color: #f5f6f8;
  flex-grow:1;
  overflow:auto;
  .iySlzp {
    min-height: 60px!important;
  }
`;

const Wrapper = styled(FlexColumn)`
  flex-grow:1;
  height: auto;
  background-color: white;
  font-size: 14px;
  flex: 1;
`;

const HeaderWrapper = styled(FlexRowCenter)`
  width: 100%;
  height: auto;
  background-color: white;
  padding:20px 0 15px;
  padding-left: 20px;
  flex-wrap:wrap
`;

const AddBox = styled.div`
  height: 644px;
  width: 300px;
  margin-top: 25px;
  margin-left: 20px;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  line-height: 644px;
`;

const AddNewBox = styled.div`
  width: 93px;
  height: 47px;
  display: inline-block;
  border: 1px solid #797979;
  color: #333;
  background: #fff;
  text-align: center;
  line-height: 47px;
  cursor: pointer;
`;

const TableWrapper = styled(FlexRow)`
  flex: 1;
  width: 100%;
  height: 80%;
  margin-top: 15px;
  border: 1px solid #ddd;
  background-color: white;
  .ant-table-wrapper {
    flex: 1!important;
  }
`;

let yHeight = 0;
export class TextbookEdition extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    showModule: true
  };

  componentDidMount() {
    this.props.dispatch(getPhaseListAction());
    this.props.dispatch(getGradeAction());
    yHeight = this.bodyWrapper.offsetHeight - 50;
  }

  columns = (props) => [
    {
      title: '版本名称',
      dataIndex: 'name',
      key: 'name',
      width: 250
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 250,
      render: (text, record, index) => (
        <span>
          <a href="#" onClick={() => this.props.amend(index, this.form, props)}>
            修改
          </a>
          <span className="ant-divider" />
          <Popconfirm title="确定删除吗?" onConfirm={() => this.props.delete(index, props)}>
            <a href="#">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ];

  renderTextbook() {
    return (
      <Wrapper>
        <HeaderWrapper>
          <Select
            style={{ width: 120, marginRight: 20 }}
            labelInValue
            value={{
              key: this.props.phase.get('id').toString(),
              label: this.props.phase.get('name')
            }}
            onChange={(value) => this.props.handlePhaseSelectOnChange(value, this.props)}
          >
            {this.props.phaseList.map(
              (phase) =>
                phase.get('id') !== 5 && (
                  <Select.Option
                    key={phase.get('id')}
                    title={phase.get('name')}
                    value={phase.get('id').toString()}
                  >
                    {phase.get('name')}
                  </Select.Option>
                )
            )}
          </Select>
          <Select
            style={{ width: 120, marginRight: 20 }}
            labelInValue
            value={{
              key: this.props.subject.get('id').toString() || '',
              label: this.props.subject.get('name') > 0 || ''
            }}
            onChange={(value) => this.props.handleSubjectSelectOnChange(value, this.props)}
          >
            {this.props.subjectList.map(
              (subject) =>
                subject.get('id') !== 17 && (
                  <Select.Option
                    key={subject.get('id')}
                    title={subject.get('name')}
                    value={subject.get('id').toString()}
                  >
                    {subject.get('name')}
                  </Select.Option>
                )
            )}
          </Select>
          <Button
            type={'primary'}
            style={{ marginRight: 25 }}
            onClick={() => this.props.dispatch(getTextbookListAction())}
          >
            查询
          </Button>
          <Button type={'primary'} onClick={() => this.props.handleAddNewClick(this.props)}>
            新增版本
          </Button>
        </HeaderWrapper>
        <TableWrapper innerRef={(w) => { this.bodyWrapper = w }}>
          <Table
            columns={this.columns(this.props)}
            scroll={{ y: yHeight }}
            dataSource={this.props.textbookList.toJS()}
            pagination={false}
            rowKey={(record) => record.id}
            style={{ marginTop: 30 }}
          />
        </TableWrapper>
      </Wrapper>
    );
  }

  renderEdition() {
    let firstNode = [];
    let secondNode = [];
    let threeNode = [];
    let fourNode = [];
    if (this.props.firstNodeList.size > 0) {
      firstNode = this.props.firstNodeList.toJS().map((item, index) => {
        const style = {};
        let selected = false;
        if (item.editable) {
          return (
            <ListViewItem
              key={item.id}
              name={this.props.inputDto.get('name')}
              editable
              onChange={(e) => this.props.onNodeChange(e, this.props.inputDto)}
              save={this.props.save}
              cancel={this.props.cancel}
            />
          );
        } else {
          if (item.id === this.props.firstNodeId) {
            selected = true;
          }
          if (index !== 0 && index !== this.props.firstNodeList.toJS().length) {
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
              onDragStart={(e) => this.props.onDragStart(e, 1, index)}
              onDrop={(e) => this.props.onDrop(e, 1, index, this.props)}
              onDragOver={(e) => this.props.onDragOver(e)}
              onClick={() => this.props.handleNodeItemOnClick(1, item.id, this.props)}
              goToUpdate={(e) => this.props.goToUpdate(e, 1, index, this.props)}
              goToDelete={(e) => this.props.goToDelete(e, 1, index, this.props)}
              handleDelete={(e) => this.props.handleDelete(e, 1, index, this.props)}
              handlePopCancel={(e) => this.props.handlePopCancel(e)}
            />
          );
        }
      });
    } else {
      firstNode.push(
        <div key={1} style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}>
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>
      );
    }
    if (this.props.secondNodeList.size > 0) {
      secondNode = this.props.secondNodeList.toJS().map((item, index) => {
        const style = {};
        let selected = false;
        if (item.editable) {
          return (
            <ListViewItem
              key={item.id}
              name={this.props.inputDto.get('name')}
              editable
              onChange={(e) => this.props.onNodeChange(e, this.props.inputDto)}
              save={this.props.save}
              cancel={this.props.cancel}
            />
          );
        } else {
          if (item.id === this.props.secondNodeId) {
            selected = true;
          }
          if (index !== 0 && index !== this.props.secondNodeList.toJS().length) {
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
              onDragStart={(e) => this.props.onDragStart(e, 2, index)}
              onDrop={(e) => this.props.onDrop(e, 2, index, this.props)}
              onDragOver={(e) => this.props.onDragOver(e)}
              onClick={() => this.props.handleNodeItemOnClick(2, item.id, this.props)}
              goToUpdate={(e) => this.props.goToUpdate(e, 2, index, this.props)}
              goToDelete={(e) => this.props.goToDelete(e, 2, index, this.props)}
              handleDelete={(e) => this.props.handleDelete(e, 2, index, this.props)}
              handlePopCancel={(e) => this.props.handlePopCancel(e)}
            />
          );
        }
      });
    } else {
      secondNode.push(
        <div key={1} style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}>
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>
      );
    }
    if (this.props.threeNodeList.size > 0) {
      threeNode = this.props.threeNodeList.toJS().map((item, index) => {
        const style = {};
        let selected = false;
        if (item.editable) {
          return (
            <ListViewItem
              key={item.id}
              name={this.props.inputDto.get('name')}
              editable
              onChange={(e) => this.props.onNodeChange(e, this.props.inputDto)}
              save={this.props.save}
              cancel={this.props.cancel}
            />
          );
        } else {
          if (item.id === this.props.threeNodeId) {
            selected = true;
          }
          if (index !== 0 && index !== this.props.threeNodeList.toJS().length) {
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
              onDragStart={(e) => this.props.onDragStart(e, 3, index)}
              onDrop={(e) => this.props.onDrop(e, 3, index, this.props)}
              onDragOver={(e) => this.props.onDragOver(e)}
              onClick={() => this.props.handleNodeItemOnClick(3, item.id, this.props)}
              goToUpdate={(e) => this.props.goToUpdate(e, 3, index, this.props)}
              goToDelete={(e) => this.props.goToDelete(e, 3, index, this.props)}
              handleDelete={(e) => this.props.handleDelete(e, 3, index, this.props)}
              handlePopCancel={(e) => this.props.handlePopCancel(e)}
            />
          );
        }
      });
    } else {
      threeNode.push(
        <div key={1} style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}>
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>
      );
    }
    if (this.props.fourNodeList.size > 0) {
      fourNode = this.props.fourNodeList.toJS().map((item, index) => {
        const style = {};
        let selected = false;
        if (item.editable) {
          return (
            <ListViewItem
              key={item.id}
              name={this.props.inputDto.get('name')}
              editable
              onChange={(e) => this.props.onNodeChange(e, this.props.inputDto)}
              save={this.props.save}
              cancel={this.props.cancel}
            />
          );
        } else {
          if (item.id === this.props.fourNodeId) {
            selected = true;
          }
          if (index !== 0 && index !== this.props.fourNodeList.toJS().length) {
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
              onMouseOver={() => this.props.onMouseOver(4, index, this.props)}
              onMouseLeave={() => this.props.onMouseLeave(4, this.props)}
              draggable
              onDragStart={(e) => this.props.onDragStart(e, 4, index)}
              onDrop={(e) => this.props.onDrop(e, 4, index, this.props)}
              onDragOver={(e) => this.props.onDragOver(e)}
              onClick={() => this.props.handleNodeItemOnClick(4, item.id, this.props)}
              goToUpdate={(e) => this.props.goToUpdate(e, 4, index, this.props)}
              goToDelete={(e) => this.props.goToDelete(e, 4, index, this.props)}
              handleDelete={(e) => this.props.handleDelete(e, 4, index, this.props)}
              handlePopCancel={(e) => this.props.handlePopCancel(e)}
            />
          );
        }
      });
    } else {
      fourNode.push(
        <div key={1} style={{ textAlign: 'center', marginTop: '80px', fontSize: '14px' }}>
          <img src={pic_null} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: '20px' }}>暂无数据</p>
        </div>
      );
    }
    return (
      <Wrapper>
        <HeaderWrapper>
          <Select
            style={{ width: 120, marginRight: 20 }}
            value={this.props.gradeId.toString()}
            onChange={(value) => this.props.handleGradeSelectOnChange(value, this.props)}
          >
            {this.props.gradeList.toJS().map((grade, index) => (
              <Select.Option key={index} title={grade.name || ''} value={grade.id.toString() || ''}>
                {grade.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 120, marginRight: 20 }}
            value={this.props.subjectId ? this.props.subjectId.toString() : ''}
            onChange={(value) => this.props.handleSubjectEditionSelectOnChange(value, this.props)}
          >
            {this.props.subjectEditionList.toJS().map(
              (subject) =>
                subject.id !== 17 && (
                  <Select.Option
                    key={subject.id === 17 ? '' : subject.id}
                    title={subject.id === 17 ? '' : subject.name}
                    value={subject.id === 17 ? '' : subject.id.toString()}
                  >
                    {subject.name}
                  </Select.Option>
                )
            )}
          </Select>
          <Select
            style={{ width: 120, marginRight: 20 }}
            value={this.props.editionId && this.props.subjectId ? this.props.editionId.toString() : ''}
            onChange={(value) => this.props.handleEditionSelectOnChange(value, this.props)}
          >
            {this.props.editionList &&
              this.props.editionList.toJS().map((edition) => (
                <Select.Option key={edition.id} title={edition.name} value={edition.id.toString()}>
                  {edition.name}
                </Select.Option>
              ))}
          </Select>
          <Button
            type={'primary'}
            style={{ marginRight: 25 }}
            onClick={() => this.props.dispatch(getFirstNodeListAction())}
          >
            查询
          </Button>
        </HeaderWrapper>
        <BodyWrapper>
          <div style={{ whiteSpace: 'nowrap', width: '100%' }}>
            <ListView
              title={'1级节点'}
              onFooterBtnClick={() =>
                this.props.handleOnFooterBtnClick(
                  1,
                  this.props.firstNodeList,
                  this.props.inputDto,
                  this.props.addExist
                )}
            >
              {firstNode}
            </ListView>
            <ListView
              title={'2级节点'}
              onFooterBtnClick={() =>
                this.props.handleOnFooterBtnClick(
                  2,
                  this.props.secondNodeList,
                  this.props.inputDto,
                  this.props.addExist,
                  this.props
                )}
            >
              {secondNode}
            </ListView>
            {this.props.threeNodeList.size > 0 || this.props.addLevel.toJS().showThree ? (
              <ListView
                title={'3级节点'}
                topDelete
                handleDeleteTop={(e) => this.props.handleDeteleTitle(e)}
                handleDeleteLevel={(e) => this.props.handleLevel(e, 3, this.props)}
                onFooterBtnClick={() =>
                  this.props.handleOnFooterBtnClick(
                    3,
                    this.props.threeNodeList,
                    this.props.inputDto,
                    this.props.addExist,
                    this.props
                  )}
              >
                {threeNode}
              </ListView>
            ) : null}
            {this.props.fourNodeList.size > 0 || this.props.addLevel.toJS().showFour ? (
              <ListView
                title={'4级节点'}
                topDelete
                handleDeleteTop={(e) => this.props.handleDeteleTitle(e)}
                handleDeleteLevel={(e) => this.props.handleLevel(e, 4, this.props)}
                onFooterBtnClick={() =>
                  this.props.handleOnFooterBtnClick(
                    4,
                    this.props.fourNodeList,
                    this.props.inputDto,
                    this.props.addExist,
                    this.props
                  )}
              >
                {fourNode}
              </ListView>
            ) : null}
            {this.props.fourNodeList.size > 0 || this.props.addLevel.toJS().showFour ? (
              ''
            ) : (
              <AddBox>
                <AddNewBox onClick={() => this.props.hanleAppendChild(this.props)}>+新增层级</AddNewBox>
              </AddBox>
            )}
          </div>
        </BodyWrapper>
      </Wrapper>
    );
  }

  render() {
    const { showModule } = this.state;
    return (
      <RootWrapperBox>
        <ButtonBox>
          <TitleButton
            active={showModule}
            onClick={() => {
              this.setState({ showModule: true });
            }}
          >
            教材版本管理
          </TitleButton>
          <TitleButton
            active={!showModule}
            onClick={() => {
              this.setState({ showModule: false });
            }}
          >
            教材目录管理
          </TitleButton>
        </ButtonBox>
        <BottomLine />
        {showModule ? this.renderTextbook() : this.renderEdition()}
        <CollectionCreateForm
          {...this.props.inputList.toJS()}
          ref={(form) => { this.form = form }}
          visible={this.props.models.get('visible')}
          onChange={(values) => this.props.onChange(this.props, values)}
          onCancel={() => this.props.handleModelClick(this.props)}
          onCreate={() => this.props.handleModalOnOk(this.form, this.props)}
          phaseList={this.props.phaseList}
          subjectList={this.props.subjectList}
          phaseId={this.props.inputList.get('phaseId')}
          subjectId={this.props.inputList.get('subjectId')}
        />
        {this.props.modalAttr.get('visible') ? (
          <EditionCreateForm
            visible={this.props.modalAttr.get('visible')}
            {...this.props.inputDto.toJS()}
            knowledgeList={this.props.knowledgeList.toJS()}
            ref={(form) => { this.form = form }}
            onCancel={() => this.props.handleModalOnCancel(this.props)}
            onCreate={() => this.props.handleEditionModalOnOk(this.form, this.props)}
            onChange={(values) => this.props.modalOnChange(this.props, values)}
          />
        ) : (
          ''
        )}
      </RootWrapperBox>
    );
  }
}

const CollectionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: {
        ...props.name,
        value: props.name
      },
      phaseId: {
        ...props.phaseId,
        value: props.phaseId.toString()
      },
      phaseList: {
        ...props.phaseList,
        value: props.phaseList
      },
      subjectId: {
        ...props.subjectId,
        value: props.subjectId === 17 ? '' : props.subjectId.toString()
      },
      subjectList: {
        ...props.subjectList,
        value: props.subjectList
      }
    };
  }
})((props) => {
  const { visible, onCancel, onCreate, form } = props;
  const { getFieldDecorator } = form;
  const options = props.phaseList.map((item) => {
    return (
      item.get('id') !== 5 && (
        <Select.Option key={item.get('id')} value={item.get('id').toString()} title={item.get('name')}>
          {item.get('name')}
        </Select.Option>
      )
    );
  });
  const subjectOptions = props.subjectList.map((item) => {
    return (
      item.get('id') !== 17 && (
        <Select.Option
          key={item.get('id') === 17 ? '' : item.get('id')}
          value={item.get('id') === 17 ? '' : item.get('id').toString()}
          title={item.get('id') === 17 ? '' : item.get('name')}
        >
          {item.get('name')}
        </Select.Option>
      )
    );
  });
  return (
    <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title="新增/编辑版本信息">
      <Form>
        <FormItem label="版本名称">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入名称' },
              { whitespace: true, message: '请输入名称' },
              { max: 20, message: '不能超过20个字符' }
            ]
          })(<Input placeholder="请输入名称" />)}
        </FormItem>
        <FormItem label="学段">{getFieldDecorator('phaseId')(<Select>{options}</Select>)}</FormItem>
        <FormItem label="学科">{getFieldDecorator('subjectId')(<Select>{subjectOptions}</Select>)}</FormItem>
      </Form>
    </Modal>
  );
});

const TreeNode = TreeSelect.TreeNode;

const generateTree = (list) =>
  list.map((item) => (
    <TreeNode value={String(item.id)} title={item.name} key={item.id}>
      {item.children && item.children.length > 0 && generateTree(item.children)}
    </TreeNode>
  ));

const EditionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  }
})((props) => {
  const { visible, onCancel, onCreate, form, knowledgeList, knowledgeIds } = props;
  const knowledgeIdsArr = knowledgeIds ? knowledgeIds.map((item) => String(item)) : [];
  const { getFieldDecorator } = form;
  const tProps = {
    treeCheckable: true,
    searchPlaceholder: '请选择关联知识点',
    treeNodeFilterProp: 'title',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };

  return (
    <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title="新增/编辑节点信息">
      <Form>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            initialValue: props.name,
            rules: [
              { required: true, message: '请输入名称' },
              { whitespace: true, message: '请输入名称' } /* , { max: 20, message: '不能超过20个字符' } */
            ]
          })(<Input placeholder="请输入名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="关联知识点">
          {getFieldDecorator('knowledgeIds', {
            rules: [{ type: 'array', max: 10, message: '最多选择10个知识点' }],
            initialValue: knowledgeIdsArr
          })(
            <TreeSelect {...tProps} allowClear>
              {generateTree(knowledgeList)}
            </TreeSelect>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

TextbookEdition.propTypes = {
  dispatch: PropTypes.func.isRequired,
  phase: PropTypes.instanceOf(Immutable.Map).isRequired,
  phaseList: PropTypes.instanceOf(Immutable.List).isRequired,
  handlePhaseSelectOnChange: PropTypes.func.isRequired,
  subjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  subject: PropTypes.instanceOf(Immutable.Map).isRequired,
  handleSubjectSelectOnChange: PropTypes.func.isRequired,
  handleAddNewClick: PropTypes.func.isRequired,
  handleModelClick: PropTypes.func.isRequired,
  gradeList: PropTypes.instanceOf(Immutable.List).isRequired,
  handleGradeSelectOnChange: PropTypes.func.isRequired,
  gradeId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  subjectId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  handleSubjectEditionSelectOnChange: PropTypes.func.isRequired,
  subjectEditionList: PropTypes.instanceOf(Immutable.List).isRequired,
  models: PropTypes.instanceOf(Immutable.Map).isRequired,
  inputList: PropTypes.instanceOf(Immutable.Map).isRequired,
  onChange: PropTypes.func.isRequired,
  textbookList: PropTypes.instanceOf(Immutable.List).isRequired,
  textbook: PropTypes.instanceOf(Immutable.Map).isRequired,
  handleModalOnOk: PropTypes.func.isRequired,
  amend: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  editionList: PropTypes.instanceOf(Immutable.List).isRequired,
  editionId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  handleEditionSelectOnChange: PropTypes.func.isRequired,
  knowledgeList: PropTypes.instanceOf(Immutable.List).isRequired,
  selectedKnowledgeList: PropTypes.instanceOf(Immutable.List).isRequired,
  knowledgeCrudId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  inputDto: PropTypes.instanceOf(Immutable.Map).isRequired,
  onKnowledgeChange: PropTypes.func.isRequired,
  firstNodeList: PropTypes.instanceOf(Immutable.List).isRequired,
  firstNodeId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  handleOnFooterBtnClick: PropTypes.func.isRequired,
  addExist: PropTypes.bool.isRequired,
  handleNodeItemOnClick: PropTypes.func.isRequired,
  secondNodeList: PropTypes.instanceOf(Immutable.List).isRequired,
  secondNodeId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  threeNodeList: PropTypes.instanceOf(Immutable.List).isRequired,
  threeNodeId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  fourNodeList: PropTypes.instanceOf(Immutable.List).isRequired,
  fourNodeId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
  handleModalOnCancel: PropTypes.func.isRequired,
  handleEditionModalOnOk: PropTypes.func.isRequired,
  modalOnChange: PropTypes.func.isRequired,
  modalAttr: PropTypes.object,
  handleDeteleTitle: PropTypes.func.isRequired,
  handleLevel: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  // TextbookEdition: makeSelectTextbookEdition(),
  phase: makeSelectPhase(),
  phaseList: makeSelectPhaseList(),
  subjectList: makeSelectSubjectList(),
  subject: makeSelectSubject(),
  gradeList: makeSelectGradeList(),
  gradeId: makeSelectGradeId(),
  subjectId: makeSelectSubjectId(),
  subjectEditionList: makeSelectSubjectEditionList(),
  models: makeSelectAddNew(),
  inputList: makeSelectInputChangeList(),
  textbookList: makeSelectTextbookList(),
  textbook: makeSelectTextbook(),
  crudId: makeSelectCrudId(),
  editionList: makeSelectEditionList(),
  editionId: makeSelectEditionId(),
  knowledgeList: makeSelectKnowledgeList(),
  selectedKnowledgeList: makeSelectSelectedKnowledgeList(),
  Knowledge: makeSelectKnowledge(),
  knowledgeCrudId: makeSelectKnowledgeCrudId(),
  inputDto: makeSelectInputDto(),
  firstNodeList: makeSelectFirstNodeList(),
  firstNodeId: makeSelectFirstNodeId(),
  addExist: makeSelectAddExit(),
  secondNodeList: makeSelectSecondNodeList(),
  secondNodeId: makeSelectSecondNodeId(),
  threeNodeList: makeSelectThreeNodeList(),
  threeNodeId: makeSelectThreeNodeId(),
  fourNodeList: makeSelectFourNodeList(),
  fourNodeId: makeSelectFourNodeId(),
  modalAttr: makeSelectModalAttr(),
  addLevel: makeSelectAddLevel()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handlePhaseSelectOnChange: (value, props) => {
      dispatch(setPhaseAction(props.phase.set('id', value.key).set('name', value.label)));
      dispatch(getSubjectListAction());
    },
    handleSubjectSelectOnChange: (value, props) => {
      dispatch(setSubjectAction(props.subject.set('id', value.key).set('name', value.label)));
    },
    handleGradeSelectOnChange: (value, props) => {
      dispatch(setGradeIdAction(value));
      dispatch(getSubjectAction());
    },
    handleSubjectEditionSelectOnChange: (value, props) => {
      dispatch(setSubjectIdAction(value));
      dispatch(getEditionListAction());
      let list = props.addLevel;
      if (props.threeNodeList.size === 0) {
        list = list.set('showThree', false).set('showFour', false);
        dispatch(setAddLevelAction(list));
      }
    },
    handleEditionSelectOnChange: (value, props) => {
      dispatch(setEditionIdAction(value));
      dispatch(getFirstNodeListAction());
      let list = props.addLevel;
      if (props.threeNodeList.size === 0) {
        list = list.set('showThree', false).set('showFour', false);
        dispatch(setAddLevelAction(list));
      }
    },
    handleAddNewClick: (props) => {
      dispatch(setCrudIdAction(0));
      dispatch(setAddNew(props.models.set('visible', true)));
      dispatch(
        setInputChangeAction(
          props.inputList
            .set('phaseId', props.phase.get('id'))
            .set('subjectId', props.subject.get('id'))
            .set('name', '')
        )
      );
    },
    handleModelClick: (props) => {
      dispatch(setAddNew(props.models.set('visible', false)));
    },
    onChange: (props, values) => {
      let list = props.inputList;
      if (values.name) {
        list = list.set('name', values.name.value);
      }
      if (values.phaseId) {
        list = list.set('phaseId', values.phaseId.value);
      }
      if (values.subjectId) {
        list = list.set('subjectId', values.subjectId.value);
      }
      dispatch(setInputChangeAction(list));
    },
    handleModalOnOk: (form, props) => {
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        dispatch(saveTextbookAction());
      });
    },
    amend: (index, form, props) => {
      const bookList = props.textbookList.get(index);
      dispatch(setCrudIdAction(bookList.get('id')));
      dispatch(setAddNew(props.models.set('visible', true)));
      dispatch(
        setInputChangeAction(
          props.inputList
            .set('name', bookList.get('name'))
            .set('phaseId', bookList.get('phaseId'))
            .set('subjectId', bookList.get('subjectId'))
        )
      );
    },
    delete: (index, props) => {
      const deleteId = props.textbookList.get(index).get('id');
      dispatch(setCrudIdAction(deleteId));
      dispatch(deleteAction());
    },
    onKnowledgeChange: (e, value) => {
      dispatch(setInputDtoAction(value.set('name', e.target.value)));
    },
    save: () => {
      console.log('save');
      dispatch(setAddExit(false));
      dispatch(saveAction());
    },
    cancel: () => {
      console.log('cancel');
      dispatch(setAddExit(false));
      dispatch(getFirstNodeListAction());
    },
    onMouseOver: (level, index, props) => {
      if (level === 1) {
        const editor = props.firstNodeList.find((value) => value.get('editable') === true);
        if (editor) {
          return;
        }
        const list = props.firstNodeList.map((value, index2) => value.set('toolBarVisible', index === index2));
        dispatch(setFirstNodeListAction(list));
      } else if (level === 2) {
        const editor = props.secondNodeList.find((value) => value.get('editable') === true);
        if (editor) {
          return;
        }
        const list = props.secondNodeList.map((value, index2) => value.set('toolBarVisible', index === index2));
        dispatch(setSecondNodeListAction(list));
      } else if (level === 3) {
        const editor = props.threeNodeList.find((value) => value.get('editable') === true);
        if (editor) {
          return;
        }
        const list = props.threeNodeList.map((value, index2) => value.set('toolBarVisible', index === index2));
        dispatch(setThreeNodeListAction(list));
      } else if (level === 4) {
        const editor = props.fourNodeList.find((value) => value.get('editable') === true);
        if (editor) {
          return;
        }
        const list = props.fourNodeList.map((value, index2) => value.set('toolBarVisible', index === index2));
        dispatch(setFourNodeListAction(list));
      }
    },
    onMouseLeave: (level, props) => {
      if (props.knowledgeCrudId !== 0) {
        return;
      }
      if (level === 1) {
        const list = props.firstNodeList.map((value) => value.set('toolBarVisible', false));
        dispatch(setFirstNodeListAction(list));
      } else if (level === 2) {
        const list = props.secondNodeList.map((value) => value.set('toolBarVisible', false));
        dispatch(setSecondNodeListAction(list));
      } else if (level === 3) {
        const list = props.threeNodeList.map((value) => value.set('toolBarVisible', false));
        dispatch(setThreeNodeListAction(list));
      } else if (level === 4) {
        const list = props.fourNodeList.map((value) => value.set('toolBarVisible', false));
        dispatch(setFourNodeListAction(list));
      }
    },
    onDragStart: (e, level, index) => {
      e.stopPropagation();
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
        list = props.firstNodeList;
      } else if (level === 2) {
        list = props.secondNodeList;
      } else if (level === 3) {
        list = props.threeNodeList;
      } else if (level === 4) {
        list = props.fourNodeList;
      }
      const oldData = list.get(data.index);
      const newData = list.get(index);
      const arr = list.set(data.index, newData).set(index, oldData);
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      if (level === 1) {
        dispatch(setFirstNodeListAction(arr));
      } else if (level === 2) {
        dispatch(setSecondNodeListAction(arr));
      } else if (level === 3) {
        dispatch(setThreeNodeListAction(arr));
      } else if (level === 4) {
        dispatch(setFourNodeListAction(arr));
      }
      dispatch(sortAction('ddd'));
      console.log('拖动结束', level, index, arr.toJS());
    },
    onDragOver: (e) => {
      e.preventDefault();
    },
    goToUpdate: (e, level, index, props) => {
      e.stopPropagation();
      if (props.addExist) {
        message.warning('请先完成之前的操作');
        return;
      }
      if (level === 1) {
        const list = props.firstNodeList.map((value, index2) => value.set('editable', index === index2));
        dispatch(setFirstNodeListAction(list));
        const firstType = props.firstNodeList.get(index);
        dispatch(setKnowledgeCrudIdAction(firstType.get('id')));
        dispatch(setInputDtoAction(props.inputDto.set('level', level).set('name', firstType.get('name'))));
      } else if (level === 2) {
        dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
        const secondType = props.secondNodeList.get(index);
        dispatch(setKnowledgeCrudIdAction(secondType.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('knowledgeIds', secondType.get('knowledgeIds'))
              .set('name', secondType.get('name'))
          )
        );
        dispatch(getKnowledgeListAction());
      } else if (level === 3) {
        dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
        const threeType = props.threeNodeList.get(index);
        dispatch(setKnowledgeCrudIdAction(threeType.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('knowledgeIds', threeType.get('knowledgeIds'))
              .set('name', threeType.get('name'))
          )
        );
        dispatch(getKnowledgeListAction());
      } else if (level === 4) {
        dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
        const fourType = props.fourNodeList.get(index);
        dispatch(setKnowledgeCrudIdAction(fourType.get('id')));
        dispatch(
          setInputDtoAction(
            props.inputDto
              .set('level', level)
              .set('knowledgeIds', fourType.get('knowledgeIds'))
              .set('name', fourType.get('name'))
          )
        );
        dispatch(getKnowledgeListAction());
      }
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
        deleteId = props.firstNodeList.get(index).get('id');
        dispatch(setKnowledgeCrudIdAction(deleteId));
      } else if (level === 2) {
        deleteId = props.secondNodeList.get(index).get('id');
        dispatch(setKnowledgeCrudIdAction(deleteId));
      } else if (level === 3) {
        deleteId = props.threeNodeList.get(index).get('id');
        dispatch(setKnowledgeCrudIdAction(deleteId));
      } else if (level === 4) {
        deleteId = props.fourNodeList.get(index).get('id');
        dispatch(setKnowledgeCrudIdAction(deleteId));
      }
      console.log('deleteId:', deleteId);
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
        deleteId = props.firstNodeList.get(index).get('id');
        dispatch(setKnowledgeCrudIdAction(deleteId));
      } else if (level === 2) {
        deleteId = props.secondNodeList.get(index).get('id');
        dispatch(setKnowledgeCrudIdAction(deleteId));
      } else if (level === 3) {
        deleteId = props.threeNodeList.get(index).get('id');
        dispatch(setKnowledgeCrudIdAction(deleteId));
      } else if (level === 4) {
        deleteId = props.fourNodeList.get(index).get('id');
        dispatch(setKnowledgeCrudIdAction(deleteId));
      }
      dispatch(deleteNodeAction());
    },
    handlePopCancel: (e) => {
      e.stopPropagation();
      dispatch(setKnowledgeCrudIdAction(0));
    },
    handleOnFooterBtnClick: (level, list, inputDto, exit, props) => {
      if (exit) {
        message.warning('请先完成之前的操作');
        return false;
      }
      dispatch(setKnowledgeCrudIdAction(0));
      dispatch(setInputDtoAction(inputDto.set('level', level).set('name', '').set('knowledgeIds', [])));
      const _new = Immutable.fromJS({ id: 0, name: '', editable: true });
      if (level === 1) {
        dispatch(setFirstNodeListAction(list.push(_new)));
      } else if (level === 2) {
        dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
        dispatch(getKnowledgeListAction());
      } else if (level === 3) {
        dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
        dispatch(getKnowledgeListAction());
      } else if (level === 4) {
        dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
        dispatch(getKnowledgeListAction());
      }
      dispatch(setAddExit(true));
    },
    onNodeChange: (e, value) => {
      dispatch(setInputDtoAction(value.set('name', e.target.value)));
    },
    handleNodeItemOnClick: (level, value, props) => {
      let list = props.addLevel;
      if (level === 1) {
        if (props.threeNodeList.size === 0) {
          list = list.set('showThree', false);
          dispatch(setAddLevelAction(list));
        }
        dispatch(setFirstNodeIdAction(value));
        dispatch(getSecondNodeListAction());
      } else if (level === 2) {
        if (props.threeNodeList.size === 0) {
          list = list.set('showThree', false).set('showFour', false);
          dispatch(setAddLevelAction(list));
        }
        dispatch(setSecondNodeIdAction(value));
        dispatch(getThreeNodeListAction());
      } else if (level === 3) {
        if (props.fourNodeList.size === 0) {
          list = list.set('showFour', false);
          dispatch(setAddLevelAction(list));
        }
        dispatch(setThreeNodeIdAction(value));
        dispatch(getFourNodeListAction());
      } else if (level === 4) {
        dispatch(setFourNodeIdAction(value));
      }
    },
    handleModalOnCancel: (props) => {
      dispatch(setAddExit(false));
      dispatch(setModalAttrAction(props.modalAttr.set('visible', false)));
    },
    handleEditionModalOnOk: (form, props) => {
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
      if (values.knowledgeIds) {
        dto = dto.set('knowledgeIds', values.knowledgeIds.value);
      }
      dispatch(setInputDtoAction(dto));
    },
    handleDeteleTitle: (e) => {
      console.log(444);
    },
    handleLevel: (e, level, props) => {
      e.stopPropagation();
      let deleteId;
      let list = props.addLevel;
      if (level === 3) {
        if (props.threeNodeList.size === 0) {
          list = list.set('showThree', false);
          dispatch(setAddLevelAction(list));
        } else {
          deleteId = props.secondNodeId;
          dispatch(deleteLevelAction(deleteId));
          list = list.set('showThree', false).set('showFour', false);
          dispatch(setAddLevelAction(list));
          dispatch(getThreeNodeListAction());
          dispatch(getFourNodeListAction());
        }
      } else if (level === 4) {
        if (props.fourNodeList.size === 0) {
          list = list.set('showFour', false);
          dispatch(setAddLevelAction(list));
        } else {
          deleteId = props.threeNodeId;
          dispatch(deleteLevelAction(deleteId));
          dispatch(getFourNodeListAction());
        }
      }
      dispatch(getFirstNodeListAction());
    },
    hanleAppendChild: (props) => {
      let list = props.addLevel;
      if (props.threeNodeList.size > 0 && props.secondNodeList.size > 0) {
        list = list.set('showFour', true);
        dispatch(setAddLevelAction(list));
        return;
      } else if (list.get('showThree') && !list.get('showFour')) {
        message.warning('请先选择三级节点');
        return;
      }
      if (props.secondNodeList.size > 0) {
        list = list.set('showThree', true);
        dispatch(setAddLevelAction(list));
        console.log('here');
      } else if (!list.get('showTree') && !list.get('showFour')) {
        message.warning('请先选择二级节点');
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextbookEdition);
