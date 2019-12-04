import React from 'react';
import styled from 'styled-components';
import { Form, Select, Modal, Button, Checkbox, Radio, Tree  } from 'antd';
const TreeNode = Tree.TreeNode;
import QbLabel from './QbLabel';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const FormWrapper = styled.div`
  .ant-radio-group{
    display: block;
  }
`;

const FormItem = Form.Item;

// 编辑题目标签
const ModalForm = Form.create({
  onValuesChange(props, values) {
    const { onValuesChange } = props;
    onValuesChange && onValuesChange(values);
  },
  mapPropsToFields(props) {
    const {
      sourceId,
      phaseCode,
      chapterDirectoryIdList = [],
      sceneIdList,
      practicalList = [],
      sourceList = [],
      sceneList = [],
      phaseList = [],
    } = props;
    return {
      sourceId: {
        value: sourceId ? `${sourceId}` : void 0,
      },
      phaseCode: {
        value: phaseCode  ? phaseCode : void 0,
      },
      chapterDirectoryIdList: {
        value: chapterDirectoryIdList,
      },
      sceneIdList: {
        value: sceneIdList.map(el => `${el}`),
      },
      practicalList: {
        value: practicalList,
      },
      sourceList: {
        value: sourceList,
      },
      sceneList: {
        value: sceneList,
      },
      phaseList,
    };
  },
})(props => {
  const {
    loading,
    onCancel,
    onSave,
    form,
    sourceList,
    sceneList,
    phaseList,
    treeData,
    onLoadData,
    knowledgeNames,
    onSelectPhase,
    onCheckTree,
    checkedKeys,
    onDelMenu
  } = props;
  const {
    getFieldDecorator,
    validateFields, // 校验必填字段
  } = form;
  const SourceOption = sourceList.map(item => (
    <Select.Option key={item.id} value={`${item.id}`} title={item.name}>
      {item.name}
    </Select.Option>
  ));
  const handleDel = (item) => {
    onDelMenu(item);
  };
  const borderStyle = {
    padding: 10, border: '1px solid #eee'
  };
  const renderTreeNodes = (data) => {
    return data.map((item, index) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} disableCheckbox={item.level < 3} isLeaf={!item.hasChild}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} disableCheckbox={item.level < 3} isLeaf={!item.hasChild} />;
    });
  };
  return (
    <Modal
      title="编辑题目标签"
      visible
      width={800}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" size="large" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          size="large"
          loading={loading}
          onClick={() => {
            validateFields(err => {
              if (err) return;
              if (knowledgeNames.length === 0) return;
              onSave();
            });
          }}
        >
          保存
        </Button>,
      ]}
      maskClosable={false}
    >
      <FormWrapper>
        <Form layout="vertical">
          <FormItem label="题目来源">
            {getFieldDecorator('sourceId', {
              rules: [{ required: true, message: '请选择题目来源' }],
            })(<Select placeholder="请选择题目来源">{SourceOption}</Select>)}
          </FormItem>
          <FormItem label="关联题库目录" required>
            {
              knowledgeNames.length > 0 ? knowledgeNames.map((item, index) => {
                return <QbLabel data={item.pathNameList || []} key={index} onDel={() => { handleDel(item) }} />;
              }) : <span style={{ color: 'red' }}>请添加关联题库目录</span>
            }
          </FormItem>
          <div style={borderStyle}>
            <FormItem label="学段" labelCol={{ style: { width: 50, lineHeight: '32px', float: 'left' }}} wrapperCol={{ style: { float: 'left' }}}>
              {getFieldDecorator('phaseCode', {
                rules: [{ required: true, message: '请选择学段' }],
              })(
                <RadioGroup onChange={onSelectPhase}>
                  {phaseList.map(item => <Radio key={item.id} value={item.id}>{item.name}</Radio>)}
                </RadioGroup>)}
            </FormItem>
            <div style={borderStyle}>
              {
                treeData.length > 0 ? <Tree loadData={onLoadData} checkable onCheck={onCheckTree} checkedKeys={checkedKeys} checkStrictly>
                  {renderTreeNodes(treeData)}
                </Tree> : '暂无数据'
              }
            </div>
          </div>
          <FormItem label="使用场景">
            {getFieldDecorator('sceneIdList', {
              rules: [],
            })(<CheckboxGroup options={sceneList} />)}
          </FormItem>
        </Form>
      </FormWrapper>
    </Modal>
  );
});

export default ModalForm;
