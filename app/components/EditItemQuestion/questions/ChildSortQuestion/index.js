import React from 'react';
import { Radio, Button } from 'antd';
import { fromJS } from 'immutable';
import Option from './Option';

const RadioGroup = Radio.Group;
export default class SortQuestion extends React.Component {
  state = {
    type: 'text',
    loading: false,
  };

  componentDidMount() {
    const { optionElementList } = this.props;
    const type = this.getType();
    this.setState({ type });

    // 如果是新增题目，则默认添加三个选项
    if (optionElementList.count() === 0) {
      const optionElementList = [0, 1, 2].map(index => ({
        optionElementContent: '',
        optionElementDesc: '',
        optionElementOrder: index,
        optionElementType: type === 'image' ? 3 : 2,
      }));
      this.setOptionData(fromJS(optionElementList));
    } else {
      const newOptionElementList = optionElementList
        .sort((prev, next) => (prev.get('optionElementOrder') - next.get('optionElementOrder')))
        .map((el, index) => {
          const newEl = el.set('optionElementOrder', index);
          return newEl;
        });
      this.setOptionData(fromJS(newOptionElementList));
    }
  }

  // 设置选项的数据
  setOptionData = data => {
    const { setNewQuestionMsg } = this.props;
    setNewQuestionMsg('parent', -1, 'optionElementList', data);
  };

  // 改变选项的类型
  handleChangeOptionType = e => {
    const { optionElementList } = this.props;
    const type = e.target.value;
    this.setState({
      type,
    });
    const optionType = type === 'image' ? 3 : 2;
    // 改变选项类型的时候 清空选项数据
    const newOptionElementList = optionElementList.map(option => {
      return option
        .set('optionElementContent', '')
        .set('optionElementType', optionType);
    });
    this.setOptionData(newOptionElementList);
  };

  // 移动选项
  handleMoveOption = (index, type) => {
    const { optionElementList } = this.props;
    if (type !== 'up' && type !== 'down') return;
    const swapIndex = type === 'up' ? index - 1 : index + 1; // 交换位置的元素
    const newOptionElementList = optionElementList
      .setIn([swapIndex, 'optionElementOrder'], index)
      .setIn([index, 'optionElementOrder'], swapIndex)
      .sort(
        (prev, next) =>
          prev.get('optionElementOrder') - next.get('optionElementOrder'),
      ); // 重新排序

    this.setOptionData(newOptionElementList);
  };

  // 删除选项
  handleDeleteOption = index => {
    const { optionElementList } = this.props;
    const newOptionElementList = optionElementList
      .splice(index, 1)
      .map((el, index) => {
        return el.set('optionElementOrder', index);
      });
    this.setOptionData(newOptionElementList);
  };

  // 添加选项
  handleAddOption = () => {
    const { type } = this.state;
    const { optionElementList } = this.props;
    const index = optionElementList.count();
    const newOptionElementList = optionElementList.push(
      fromJS({
        optionElementContent: '',
        optionElementDesc: '',
        optionElementOrder: index,
        optionElementType: type === 'image' ? 3 : 2,
      }),
    );
    this.setOptionData(newOptionElementList);
  };

  // 选项的内容发生变化
  handleChangeContent = (index, content) => {
    const { optionElementList } = this.props;
    const newOptionElementList = optionElementList.setIn(
      [index, 'optionElementContent'],
      content,
    );
    this.setOptionData(newOptionElementList);
  };

  // 获取当前选项的类型，排序题选项只支持文本和图片
  getType = () => {
    const { optionElementList } = this.props;
    const isImage =
      optionElementList.count() > 0 &&
      optionElementList.every(el => Number(el.get('optionElementType')) === 3);
    return isImage ? 'image' : 'text';
  };

  // 渲染 option
  renderOptions = () => {
    const { optionElementList } = this.props;
    const { type } = this.state;
    // 获取选项
    const list = optionElementList
      .sort(
        (prev, next) =>
          prev.get('optionElementOrder') - next.get('optionElementOrder'),
      )
      .map(el => el.get('optionElementContent'));
    const listLength = list.count();
    return list.map((el, index) => {
      return (
        <Option
          index={index + 1}
          key={index}
          type={type}
          option={el}
          disableUp={index === 0}
          disableDown={index === listLength - 1}
          disableDelete={listLength === 2}
          onChange={value => this.handleChangeContent(index, value)}
          onClickUp={() => {
            this.handleMoveOption(index, 'up');
          }}
          onClickDown={() => {
            this.handleMoveOption(index, 'down');
          }}
          clickOption={() => {
            this.handleClickOption(index);
          }}
          onDelete={() => {
            this.handleDeleteOption(index);
          }}
        />
      );
    });
  };

  render() {
    const { type } = this.state;
    const { optionElementList } = this.props;
    return (
      <div>
        <div>
          <span>选项：</span>
          <RadioGroup value={type} onChange={this.handleChangeOptionType}>
            <Radio value="text">文本</Radio>
            <Radio value="image">图片</Radio>
          </RadioGroup>
          <span>（注意：请按照正确的顺序添加选项！）</span>
        </div>
        <ul>{this.renderOptions()}</ul>
        <Button
          disabled={optionElementList.count() === 5}
          onClick={this.handleAddOption}
        >
          新增选项
        </Button>
      </div>
    );
  }
}
