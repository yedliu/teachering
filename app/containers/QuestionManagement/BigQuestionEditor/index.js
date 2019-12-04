import React from 'react';
import QuestionCounter from 'components/QuestionCounter';
import { Button, message, Modal, Input, Form, Affix } from 'antd';
const FormItem = Form.Item;
import _ from 'lodash';

class BigQuestionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditBig: false,
      bigName: '',
    };
    this.dragState = {
      dragElement: {},
      startTarget: '',
      lock: true,
      currentId: '',
      mode: 'add',
      currentBigIndex: null,
      isOver: false
    };
    this.stop = true;
  }
  // 移动题目后生成目标数据
  makeData=(arr, bigName) => {
    // 统一处理data
    const { questionData } = this.props;
    let data = _.cloneDeep(questionData);
    const bigIndex = _.findIndex(data, item => item.name === bigName);
    data[bigIndex].examPaperContentQuestionOutputDTOList = arr;
    return data;
  }
  // 移动题目后生成目标数据（跨大题的情况）
  makeDataTwo=(arr1, bigName1, arr2, bigName2) => {
    const { questionData } = this.props;
    let data = _.cloneDeep(questionData);
    const bigIndex1 = _.findIndex(data, item => item.name === bigName1);
    data[bigIndex1].examPaperContentQuestionOutputDTOList = arr1;
    const bigIndex2 = _.findIndex(data, item => item.name === bigName2);
    data[bigIndex2].examPaperContentQuestionOutputDTOList = arr2;
    return data;
  }
  // 处理大题容器dragdrop事件
  handleDropItem=(endTarget) => {
    this.stop = true;
    const { questionData, onChange } = this.props;
    let target = this.findSmallList(questionData, endTarget);
    let exist = _.findIndex(target, item => item.id === this.dragState.dragElement.id);
    if (exist >= 0) {
      target.splice(exist, 1);
      target.push(this.dragState.dragElement);
      onChange(this.makeData(target, endTarget));
      return;
    }
    target.push(this.dragState.dragElement);
    let startTargetSmallList = this.findSmallList(questionData, this.dragState.startTarget);
    let startDragIndex = _.findIndex(startTargetSmallList, item => item.id === this.dragState.dragElement.id);
    startTargetSmallList.splice(startDragIndex, 1);
    // let newEndTarget = this.makeData(target, endTarget)
    onChange(this.makeDataTwo(target, endTarget, startTargetSmallList, this.dragState.startTarget));
  }
  /**
   * 处理开始拖动事件
   * @param item 拖动的小题
   * @param bigName 大题的名称
   * @param e
   */
  handleDragStart=(item, bigName, e) => {
    this.setData({
      dragElement: item,
      startTarget: bigName,
      currentId: item.id
    });
  }
  /**
   * 处理dragleave事件
   * @param item 拖动的小题
   * @param bigName 大题名称
   * @param e
   */
  handleDragLeave=(item, bigName, e) => {
    // const { questionData } = this.props;
    // let target = this.findSmallList(questionData, bigName);
    if (item.id !== this.dragState.dragElement.id) {
      this.setData({
        lock: true,
      });
      // if (this.dragState.lock && item.id === target[target.length - 1].id) {
      //   const newDataArray = target.filter(item => item.id !== this.dragState.dragElement.id);
      //   newDataArray.push(this.dragState.dragElement);
      //   this.setData({
      //     lock: false,
      //   }, () => {
      //     onChange(this.makeData(newDataArray, bigName));
      //   });
      // } else {
      //   this.setData({
      //     lock: true,
      //   });
      // }
    }
  }
  /**
   * 处理小题容器的dragdrop事件
   * @param curItem
   * @param bigName
   * @param e
   */
  handleDrop=(curItem, bigName, e) => {
    const { questionData, onChange } = this.props;
    this.stop = true;
    e.preventDefault();
    e.stopPropagation();
    this.setData({ isOver: false });
    let endTarget = bigName;
    let target = this.findSmallList(questionData, bigName);
    if (curItem.id !== this.dragState.dragElement.id) {
      const oldDragIndex = _.findIndex(target, item => item.id === this.dragState.dragElement.id);
      const oldEnterIndex = _.findIndex(target, item => item.id === curItem.id);
      if (oldDragIndex > -1 && oldDragIndex > oldEnterIndex) {
        const newDataArray = target.filter(item => item.id !== this.dragState.dragElement.id);
        const insertIndex = _.findIndex(newDataArray, item => item.id === curItem.id);
        newDataArray.splice(insertIndex, 0, this.dragState.dragElement);
        onChange(this.makeData(newDataArray, bigName));
      } else if (oldDragIndex > -1 && oldDragIndex <= oldEnterIndex) {
        const newDataArray = target.filter(item => item.id !== this.dragState.dragElement.id);
        const insertIndex = _.findIndex(newDataArray, item => item.id === curItem.id) + 1;
        newDataArray.splice(insertIndex, 0, this.dragState.dragElement);
        onChange(this.makeData(newDataArray, bigName));
      }
      let startTarget = this.dragState.startTarget;
      if (startTarget && endTarget !== startTarget) {
        const newDataArray = target.filter(item => item.id !== this.dragState.dragElement.id);
        const insertIndex = _.findIndex(newDataArray, item => item.id === curItem.id) + 1;
        newDataArray.splice(insertIndex, 0, this.dragState.dragElement);
        let startTargetList = this.findSmallList(questionData, startTarget);
        let startDragIndex = _.findIndex(startTargetList, item => item.id === this.dragState.dragElement.id);
        startTargetList.splice(startDragIndex, 1);
        onChange(this.makeDataTwo(startTargetList, startTarget, newDataArray, bigName));
      }
      this.setData({
        isConfigDirty: true,
        startTarget: null
      });
    }
  }
  /**
   * 根据大题名称找目标小题列表
   * @param questionData
   * @param bigName
   * @returns {examPaperContentQuestionOutputDTOList|{epcId, score, serialNumber, questionId, questionOutputDTO, id}}
   */
  findSmallList = (questionData, bigName) => {
    let data = _.cloneDeep(questionData);
    let target = data.find(item => item.name === bigName);
    target ? target = target.examPaperContentQuestionOutputDTOList : target = [];
    return target;
  }
  /**
   * 选择小题
   * @param id
   */
  handleSelectSmall=(id) => {
    const { onSelectSmall } = this.props;
    this.setData({ currentId: id });
    onSelectSmall(id);
  }
  /**
   * 处理大题排序
   * @param bigQuestion 大题数据
   * @param index
   * @param type
   */
  handleOrder=(bigQuestion, index, type) => {
    const { questionData, onChange } = this.props;
    let data = _.cloneDeep(questionData);
    let i = type === 'up' ? index - 1 : index + 1;
    if (i < 0) {
      message.warning('已经是第一个');
      return;
    }
    if (i > data.length - 1) {
      message.warning('已经是最后一个');
      return;
    }
    let temp = data[index];
    data[index] =  data[i];
    data[i] = temp;
    onChange(data);
  }
  /**
   * 处理删除大题
   * @param id
   * @param index
   */
  handleDelete=(id, index) => {
    const { questionData, onChange } = this.props;
    const data = _.cloneDeep(questionData);
    data.splice(index, 1);
    onChange(data);
  }
  /**
   * 编辑大题名称或新增大题确认
   * @param e
   */
  handleSubmit=(e) => {
    const { mode, currentBigIndex } = this.dragState;
    const { onConfirmBig, questionData } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let bigIndex = _.findIndex(questionData, item => item.name === values.name);
        if (bigIndex > -1) {
          message.warning(`已有名为${values.name}的大题`);
          return;
        }
        onConfirmBig(values, mode, currentBigIndex);
        this.setState({ showEditBig: false, bigName: '' });
        this.setData({ currentBigIndex: null });
      }
    });

  }
  /**
   * 编辑大题
   * @param item
   * @param index
   */
  editBig=(item, index) => {
    this.setData({ mode: 'edit', currentBigIndex: index });
    this.setState({ showEditBig: true, bigName: item.name,  });
  }
  handleDragScroll=(step) => {
    let wrapper = document.querySelector('.paper-question-editor-wrapper');
    let scrollY = wrapper.scrollTop;
    wrapper.scrollTop = scrollY + step;
    if (!this.stop) {
      setTimeout(() => { this.handleDragScroll(step) }, 200);
    }
  }
  handleOnDrag=(classname) => {
    let wrapper = document.querySelector('.paper-question-editor-wrapper');
    wrapper.ondragover = (e) => {
      let h = wrapper.clientHeight;
      this.stop = true;
      if (e.clientY > h - 1) {
        if (this.stop === true) {
          this.stop = false;
        }
        this.handleDragScroll(2);
      } else if (e.clientY < 180) {
        if (this.stop === true) {
          this.stop = false;
        }
        this.handleDragScroll(-2);
      }
    };
  }
  setData = (obj) => {
    this.dragState = Object.assign(this.dragState, obj);
  }
  render() {
    const { questionData, info } = this.props;
    const { currentId, mode } = this.dragState;
    const { showEditBig, bigName } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div style={{ marginRight: 10, width: '210px' }}>
        <p style={{ marginBottom: 10 }}>
          分数：<span>{info.score || 0}</span>
          &nbsp;&nbsp; 题数：<span>{info.count || 0}</span>
        </p>
        {questionData
          ? questionData.map((item, index) => {
            return (
              <QuestionCounter
                key={index}
                bigQuestion={item}
                index={index + 1}
                smallListName="examPaperContentQuestionOutputDTOList"
                onDropItem={this.handleDropItem}
                onDragStart={this.handleDragStart}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                currentId={currentId}
                idName={'id'}
                onSelect={this.handleSelectSmall}
                onUp={this.handleOrder}
                onDown={this.handleOrder}
                onDeleteBig={this.handleDelete}
                onEdit={this.editBig}
                isOver={this.dragState.isOver}
                onDrag={this.handleOnDrag}
              />
            );
          })
          : null}
        <Affix
          offsetBottom={-10}
          target={() =>
            document.querySelector('.paper-question-editor-wrapper')
          }
        >
          <Button type="primary" onClick={() => {
            this.setData({ mode: 'add' });
            this.setState({ showEditBig: true });
          }} size="small">
            添加大题
          </Button>
        </Affix>
        {
          showEditBig ?
            <Modal
              title={mode === 'add' ? '添加大题' : '编辑大题'}
              visible={true} closable={false}
              footer={null}
            >
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label="大题名称"
                >
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '输入大题名称', whitespace: true }, {  max: 20, message: `最多20个字` }],
                    initialValue: bigName
                  })(
                    <Input placeholder="输入大题名称，不超过20字" />
                  )}
                </FormItem>
                <div style={{ width: '100%', textAlign: 'right' }}>
                  <Button style={{ marginRight: 20 }} onClick={() => {
                    this.setData({  currentBigIndex: null });
                    this.setState({ showEditBig: false, bigName: '', });
                  }}>取消</Button>
                  <Button type="primary" htmlType="submit">确定</Button>
                </div>
              </Form>
            </Modal> : null
        }
      </div>
    );
  }
}

export default  Form.create()(BigQuestionEditor);
