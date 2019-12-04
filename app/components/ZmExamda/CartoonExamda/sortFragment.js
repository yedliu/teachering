/**
 * 1.showCorrection 批改
 * 2.showRightAnswer 正确展示结果
 * 3.interactive 是否交互
 * 4.handleChange 每次改变答案触发的方法
 * 5.question 题目
 * 6.stuAnswer 学生答案
 */
import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import Draggable, { DraggableCore } from 'react-draggable';
import Immutable, { fromJS } from 'immutable';
import AbstractFragment from './index';

import './sort.css';

const noop = () => { };

let dragging = false;
let dragNodeIndex = null;
let dragNodeStartX = 0;
let dragNodeStartY = 0;
let dragNodeOffsetX = 0;
let dragNodeOffsetY = 0;

function getFontSize(v, sorted) {
  const FONTSIZE = sorted ? [28, 20, 20, 20, 15, 15, 12] : [44, 33, 33, 33, 27, 25.5, 21];
  switch (v) {
    case 1:
        return FONTSIZE[0];
    case 2:
        return FONTSIZE[1];
    case 3:
        return FONTSIZE[2];
    case 4:
        return FONTSIZE[3];
    case 5:
        return FONTSIZE[3];
    case 6:
        return FONTSIZE[3];
    case 7:
        return FONTSIZE[4];
    case 8:
        return FONTSIZE[4];
    case 9:
        return FONTSIZE[4];
    case 10:
        return FONTSIZE[5];
    case 11:
        return FONTSIZE[5];
    case 12:
        return FONTSIZE[5];
    default:
        return FONTSIZE[6];
  }
}
class SortFragment extends AbstractFragment {
  constructor(props) {
    super(props);
    const { question, stuAnswer } = this.props;
    this.state = {
      children: (question.get('children') || fromJS([])).toJS(),
      sortItem: [],
      massList: [],
      dragIndex: null, // 当前拖拽的待分类项id
      dropTarget: null, // 当前悬浮的分类框、放大1.1
      dragSortedTitle: null, // 当从已分类框中拖动选项时，标记选项已有的分类名称，区分处于悬浮状态的分类框
      activeHoverElement: null,
      trueAnswer: {}, // 标准答案
      answerListSelf: {},
    };
    try {
      // 把id转成title
      if (stuAnswer) {
        const children = question.get('children');
        const idMap = {};
        children.map(item => {
          idMap[item.get('id')] = item.get('title');
        })
        const answetList = JSON.parse(stuAnswer);
        const _answer = {};
        answetList.map(l => {
          _answer[idMap[l.id]] = l.items;
        })
        this.state.answerListSelf = _answer;
      }
    } catch (e) {
      console.error('此题学生答案有误,id', question.get('id'));
    }
    this.dragStart = this.dragStart.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.drop = this.drop.bind(this);
    this.getItemTag = this.getItemTag.bind(this);
    this.newSortQuestionInit = this.newSortQuestionInit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(answer) {
    const { question, handleChange } = this.props;
    // 把名称改成id的对应关系
    const children = question.get('children');
    const idMap = {};
    children.map(item => {
      idMap[item.get('title')] = item.get('id');
    })
    const list = [];
    Object.entries(answer).map(item => {
      const _answer = {};
      _answer.id = idMap[item[0]];
      _answer.items = item[1];
      // 放进数组
      list.push(_answer)
    })
    handleChange({
      id: question.get('id'),
      stuAnswer: JSON.stringify(list)
    });
    // 重新渲染
    this.setState({
      answerListSelf: answer,
      forceUpdate: !this.state.forceUpdate
    })
  }

  dragStart(dragIndex, dragSortedTitle, event, detail) {
    dragging = true;
    const { stuAnswer } = this.props;
    if (!this.isInteractive()) return;
    dragNodeIndex = null;
    this.setState({ dragIndex, dragSortedTitle });
    const { clientX, clientY } = event.touches && event.touches[0] || event;
    dragNodeIndex = dragIndex;
    dragNodeStartX = clientX;
    dragNodeStartY = clientY;
  }

  dragOver(event, detail) {
    if (!this.isInteractive()) return;
    const { clientX, clientY } = event.touches && event.touches[0] || event;
    dragNodeOffsetX = (clientX - dragNodeStartX);
    dragNodeOffsetY = (clientY - dragNodeStartY);
    let target = document.elementFromPoint(clientX, clientY);
    if (target) {
      let dataset = target.dataset || {};
      this.setState({
        dropTarget: dataset.title || null
      });
    }
    this.setState({ _time: +new Date() });
  }

  drop(event, detail, id) {
    dragging = false;
    const { massList, answerListSelf } = this.state;
    const { stuAnswer } = this.props;
    if (!this.isInteractive()) return;
    const { clientX, clientY } = event.changedTouches && event.changedTouches[0] || event;
    let target = document.elementFromPoint(clientX, clientY);
    if (target) {
      const _newAnswer = answerListSelf;
      detail._tag = Date.now();
      let answer_key_list = Object.keys(_newAnswer);
      const dataset = target.dataset || {};
      const target_title = dataset.title;
      if (target.className.indexOf('zmexamda-cate-pool') >= 0) {
        answer_key_list.forEach((it, i) => {
          if (_newAnswer[it]) {
            let index = _newAnswer[it].indexOf(id);
            if (index >= 0) {
              _newAnswer[it].splice(index, 1);
            }
          }
        });
      }
      if (target.className.indexOf('zmexamda-cate-target-drop-tar') >= 0) {
        let has_option = [...target.getElementsByClassName('zmexamda-cate-option')];
        if (has_option.length < 4) {
          if (answer_key_list && answer_key_list.length) {
            answer_key_list.forEach((it, i) => {
              if (it == target_title) {
                if (!_newAnswer[it]) {
                  _newAnswer[it] = [id];
                } else if (_newAnswer[it].indexOf(id) < 0) {
                  _newAnswer[it].push(id);
                }
              } else if (_newAnswer[it]) {
                let index = _newAnswer[it].indexOf(id);
                if (index >= 0) {
                  _newAnswer[it].splice(index, 1);
                }
              }
            });
          }
          if (!_newAnswer.hasOwnProperty(target_title)) {
            _newAnswer[target_title] = [id];
          }
        }
      }
      this.onChange(_newAnswer);
    }

    dragNodeOffsetX = dragNodeOffsetY = 0;
    this.setState({ _time: +new Date(), dropTarget: null, dragIndex: null });
  }
  getItemTag(list) {
    if (!list || !list.length) return;
    let sortItem = [];
    list.map(e => {
      if (sortItem.indexOf(e.title) < 0) {
          sortItem.push(e.title);
      }
    });
    this.setState({
        sortItem
    });
  }

  newSortQuestionInit(props) {
    const { children } = this.state;
    if (!children || !children.length) return;
    let _list = [];
    let answer = {};
    this.getItemTag(children);
    children.map(e => {
      let item = e.subQuestionMemberList || [];
      let item_list = [];
      let _item = item.map((ele) => {
        item_list.push(ele.id);
        ele.title = e.title;
        return ele;
      });
      answer[e.title] = item_list;
      _list = _list.concat(_item);
    });
    this.setState({
      massList: _list,
      trueAnswer: answer
    });
  }

  componentDidMount() {
    this.newSortQuestionInit(this.props);
  }

  render() {
    const { showRightAnswer, showCorrection = false, stuAnswer } = this.props;
    const { massList, sortItem, dragIndex, dropTarget,
      answerListSelf, trueAnswer = {}, dragSortedTitle } = this.state;
    const judge = showCorrection && !showRightAnswer;
    const answerList = (() => {
      if (showRightAnswer) {
        return trueAnswer;
      } else {
        return answerListSelf
      }
    })();
    const getOptionContent = (e, sorted) => {
      if (e.type == 'img') {
        return <img draggable={false} src={e.content} alt="" />;
      } else {
        let _tepDom = document.createElement('div');
        _tepDom.innerHTML = e.content;
        let _txt = _tepDom.innerText;
        let _pureTxt = _txt.replace(/[\n\s]/g, '');
        let _cou = _pureTxt.length;
        let _font_size = getFontSize(_cou, sorted);
        return <div className="cate-text" style={{ fontSize: _font_size }} dangerouslySetInnerHTML={{ __html: e.content }}></div>;
      }
    };
    let selected_id_list = [];
    const target_item_list = sortItem && sortItem.map((ele, i) => {
      let item_answer_list = answerList[ele] || [];
      let _true = trueAnswer[ele] || [];
      const option_list = massList && massList.filter(e => item_answer_list.indexOf(e.id) >= 0).sort((m, n) => {
        let _m_i = item_answer_list.indexOf(m.id);
        let _n_i = item_answer_list.indexOf(n.id);
        return _m_i - _n_i;
      });
      const _correct = function () {
        let _count_check = _true.length == item_answer_list.length;
        let _option_check = _true.every((item) => item_answer_list.indexOf(item) >= 0);
        return _count_check && _option_check;
      };
      const hoverActive = dropTarget == ele && dragSortedTitle != ele ? 'zmexamda-scale' : '';
      return (<div className={`zmexamda-cate-target zmexamda-cate-target-drop zmexamda-cate-target-drop-tar ${hoverActive} ${judge && _correct() ? 'zmexamda-right' : ''} ${judge ? 'result' : ''}`} key={i} data-title={ele}>
        <p className="zmexamda-cate-title"><span className="zmexamda-cate-title-text">{ele}</span></p>
        <div className="zmexamda-cate-inner" style={{ pointerEvents: dragging ? 'none' : 'auto' }}>
          {option_list.map((e, i) => {
            selected_id_list.push(e.id);
            const optionProps = {
              key: i,
              onStart: (event, detail) => this.dragStart(e.id, ele, event, detail),
              onDrag: (event, detail) => this.dragOver(event, detail),
              onStop: (event, detail) => this.drop(event, detail, e.id),
            };
            const mockDragStyle = { position: 'relative', left: `${dragNodeOffsetX}px`, top: `${dragNodeOffsetY}px`, pointerEvents: 'none', zIndex: 100 };
            const childOption = {
              style: dragIndex == e.id ? mockDragStyle : {}
            };
            const _content = getOptionContent(e, true);
            const right = _true.indexOf(e.id) >= 0 ? 'zmexamda-right' : 'zmexamda-wrong';
            return (<DraggableCore {...optionProps}>
              <div key={i} className={`zmexamda-cate-option ${judge && right}`} {...childOption}>
                {_content}
                <span className="zmexamda-wrong-tag"></span>
              </div>
            </DraggableCore>);
            })
          }
        </div>
      </div>);
    });
    return (
      <div className='zmexamda-sort-box-wrapper'>
        <div className="zmexamda-cate-target-list">
          {target_item_list}
        </div>
        <div className="zmexamda-cate-pool zmexamda-cate-target-drop">
          {massList && massList.filter(e => selected_id_list.indexOf(e.id) < 0).sort(sortFn).map((e, i) => {
            const optionProps = {
              key: i,
              onStart: (event, detail) => this.dragStart(e.id, null, event, detail),
              onDrag: (event, detail) => this.dragOver(event, detail),
              onStop: (event, detail) => this.drop(event, detail, e.id),
            };
            const mockDragStyle = { position: 'relative', left: `${dragNodeOffsetX}px`, top: `${dragNodeOffsetY}px`, pointerEvents: 'none', zIndex: 100 };
            const childOption = {
              style: dragIndex == e.id ? mockDragStyle : {}
            };
            const _content = getOptionContent(e);

            return (<DraggableCore key={e.id} {...optionProps}>
              <div className="zmexamda-cate-option" {...childOption} data-id={e.id}>
                {_content}
              </div>
            </DraggableCore>);
          })}
        </div>
      </div>
    );
  }
}

function sortFn(a, b) {
  let aa = [...a.content].map(t => t.charCodeAt()).reduce((a, b) => a + b);
  let bb = [...b.content].map(t => t.charCodeAt()).reduce((a, b) => a + b);
  let _a = a.subQuestionId % aa;
  let _b = b.subQuestionId % bb;
  return _a - _b;
}
SortFragment.defaultProps = {
}

SortFragment.propTypes = {
  question: PropTypes.object.isRequired,
  showCorrection: PropTypes.bool,
  showRightAnswer: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  interactive: PropTypes.bool,
  stuAnswer: PropTypes.string,
}

export default SortFragment;
