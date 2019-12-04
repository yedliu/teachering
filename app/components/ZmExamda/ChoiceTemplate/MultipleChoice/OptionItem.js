/**
 * 单个选项
 */
import React from 'react';
import { renderToKatex } from 'zm-tk-ace/utils';

const classInit = (classStart, interactive, type) => `${classStart}${interactive ? ' interactive' : ''}${type ? ` ${type}` : ''}`;

class OptionItem extends React.PureComponent {
  componentDidMount() {
    const { getRect } = this.props; // eslint-disable-line
    const optionItemWidth = this.optionItem ? this.optionItem.offsetWidth : 0;
    const optionItemIndexWidth = this.optionItemIndex ? this.optionItemIndex.offsetWidth : 0;
    const optionItemContentWidth = this.optionItemContent ? this.optionItemContent.offsetWidth : 0;
    getRect(optionItemIndexWidth + optionItemContentWidth, optionItemWidth);
  }
  render() {
    const { index, content, interactive, changeSelected, answerType } = this.props; // eslint-disable-line
    return (<div // eslint-disable-line
      className={classInit('optionList-item-wrapper', interactive, answerType)}
      ref={x => this.optionItem = x} // eslint-disable-line
      onClick={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        changeSelected(index);
      }}
    >
      {index ? <div
        className={classInit('optionList-item-index', interactive, answerType)}
        ref={x => this.optionItemIndex = x}  // eslint-disable-line
      >{index}{!interactive ? '.' : ''}</div> : ''}
      <div
        className={classInit('optionList-item-content', interactive, answerType)}
        ref={x => this.optionItemContent = x}  // eslint-disable-line
        dangerouslySetInnerHTML={{ __html: renderToKatex(content) }}
      ></div>
    </div>);
  }
}

export default OptionItem;
