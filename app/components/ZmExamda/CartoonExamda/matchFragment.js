/**
 * 1.showCorrection 批改
 * 2.showRightAnswer 正确展示结果
 * 3.interactive 是否交互
 * 4.handleChange 每次改变答案触发的方法
 * 5.question 题目
 * 6.stuAnswer 学生答案
 */
import React, { Component, PropTypes } from 'react';
import styled, { keyframes } from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import AbstractFragment from './index';

import './match.css';

const noop = () => { };

class MatchFragment extends AbstractFragment {
  constructor(props) {
    super(props);
    this.state = {
      matchItem: [],  // 两个配对的暂存数组
      matchList: [],  // 配对列表
      layoutStyle: this.props.question.get('layoutStyle') || 1, // 配对方式 1文字 2文图 3图图
      children: (this.props.question.get('children') || fromJS([])).toJS(), // 配对题项目数据
    };

    this.initStuAnswer(true, this.props.stuAnswer);
  }

  initStuAnswer(isConstructor, stuAnswer) {
    // 把配对题分成两队
    const top = [];
    const bottom = [];
    this.state.children.map((item, index) => {
      if (!item.subQuestionMemberList) {
        item.subQuestionMemberList = [{},{}];
      }
      top.push(item.subQuestionMemberList[0]);
      bottom.push(item.subQuestionMemberList[1]);
    });

    // 按展示先后排序
    const compare = (a, b) => a.showOrder > b.showOrder
    top.sort(compare);
    bottom.sort(compare);

    // 初始化答题结果
    let myAnswer = {};
    if (stuAnswer && stuAnswer.length > 0) {
      // 展示之前答过的信息
      try {
        myAnswer = JSON.parse(stuAnswer);
      } catch (err) {
        console.warn('答案格式不正确');
      }
      top.map((item, index) => { Object.assign(item, myAnswer.top[index]); });
      bottom.map((item, index) => { Object.assign(item, myAnswer.bottom[index]); });
    }
    if (isConstructor) {
      this.state.top = top;
      this.state.bottom = bottom;
      this.state.checkRightAnswer = false;
      this.state.showRightAnswer = false;
      this.state.matchList = myAnswer.matchList || [];
    } else {
      this.setState({
        top: top,
        bottom: bottom,
        checkRightAnswer: false,
        showRightAnswer: false,
        matchList: myAnswer.matchList || [],
      })
    }
  }

  checkRightAnswer() {
    const { top, bottom, children, matchList } = this.state;
    const compareMatchList = (obj1, obj2) => obj1[0].showOrder - obj2[0].showOrder
    top.map((item, index) => { Object.assign(item, { isRight: false }); });
    bottom.map((item, index) => { Object.assign(item, { isRight: false }); });
    matchList.sort(compareMatchList);
    matchList.map((item, index) => {
      const isRightAnswer = item[1].id == children[item[0].showOrder].subQuestionMemberList[1].id;
      item.map((innerItem, innerIndex) => {
        Object.assign(innerIndex == 0 ? top[innerItem.showOrder] : bottom[innerItem.showOrder], { isRight: isRightAnswer ? true : false });
        Object.assign(innerItem, { isRight: isRightAnswer ? true : false });
      });
    });
    this.setState({
      checkRightAnswer: true,
      matchList: matchList
    })
  }

  showRightAnswer() {
    const { top, bottom, children, matchList } = this.state;
    const tmpMatchList = [];
    const addActive = (item, bool) => {
      item.active = bool;
      return item;
    }
    children.map((a, index) => {
      const sub = a.subQuestionMemberList;
      sub.map(b => addActive(b))
      tmpMatchList.push(sub);
    });
    top.map(item => addActive(item))
    bottom.map(item => addActive(item))
    this.setState({
      showRightAnswer: true,
      matchList: tmpMatchList
    });
  }

  onChange() {
    const { matchList, top, bottom, } = this.state;
    const { question, handleChange } = this.props;
    const compareMatchList = (a, b) => a[0].showOrder - b[0].showOrder
    const tmpMatchList = matchList.slice();
    tmpMatchList.sort(compareMatchList);
    console.log('最终答案', { top, bottom, matchList: tmpMatchList });
    const stuAnswer = JSON.stringify({ top, bottom, matchList: tmpMatchList })
    handleChange({
      id: question.get('id'),
      stuAnswer: stuAnswer
    });
  }

  componentWillReceiveProps(nextProps) {
    const { showCorrection, stuAnswer = '', showRightAnswer } = this.props;
    // 批改作业了
    if (nextProps.showCorrection) {
      this.checkRightAnswer();
    } else if (!nextProps.showCorrection) {
      this.initStuAnswer(false, nextProps.stuAnswer);
    }
    // 展示正确答案
    if (nextProps.showRightAnswer) {
      this.showRightAnswer();
    } else if (!nextProps.showRightAnswer) {
      this.initStuAnswer(false, nextProps.stuAnswer);
    }
    if (nextProps.stuAnswer != stuAnswer) {
      this.initStuAnswer(false, nextProps.stuAnswer);
    }
  }

  componentDidMount() {
    const { showRightAnswer, showCorrection } = this.props;
    showRightAnswer && this.showRightAnswer();
    showCorrection && this.checkRightAnswer();
  }

  render() {
    const { showCorrection, interactive = false,
      showRightAnswer } = this.props;
    const { layoutStyle, children, top, bottom,
      matchItem, matchList } = this.state;
    let topWidthNum = 0;
    top.map((item, index) => {
      const { type, content } = item;
      type == 'text' && content.length > 20 && (topWidthNum += 2);
      type == 'text' && content.length <= 20 && (topWidthNum += 1);
      type == 'text' || (topWidthNum += 1);
    })
    // 除数+1以留出一个单位的margin空间， 上面用topWidthNum下面不用是因为只有top上面才有文字的适配
    const topWidth = 95 / (topWidthNum + 1) > 16 ? 16 : (95 / (topWidthNum + 1));
    const bottomWidth = 95 / (top.length + 1) > 16 ? 16 : (95 / (top.length + 1));

    // setMatchItem 和 removeLine是关键函数， 一切的状态数据改动以上面定义的top 和bottom数组为准， 对top和bottom数组进行改动后，再将值重新赋值给this.state的两个状态值，切勿直接修改this.state,除非保证修改了与top bottom数组保持一致
    const setMatchItem = (item) => {
      // 当待选项目只有一个的时候，判断是否同一个位置，如果是，就去除原来子项的选定状态
      const { matchItem } = this.state;
      if (matchItem.length == 1 && matchItem[0].pos == item.pos) {
        const originIndex = matchItem[0].showOrder;
        Object.assign(item.pos == 'top' ? top[originIndex] : bottom[originIndex], { active: false });
        this.setState({ matchItem: [] }, function () { matchItem.push(item); });
        return;
      }

      matchItem.push(item);
      if (matchItem.length >= 2) {
        const curLinePos = matchList.length;
        matchItem.map((item, index) => { Object.assign(item, { curLinePos }); });
        // 这一步 将matchItem里top项排前
        if (matchItem[0].pos == 'bottom') {
          const tmpMatchItem = matchItem.splice(1, 1);
          matchItem.splice(0, 0, tmpMatchItem[0]);
        }
        matchList.push(matchItem);
        this.onChange();
        this.setState({ matchItem: [] });
      }
    };
    const removeLine = (item, index) => {
      const { matchItem } = this.state;
      // 当待选项目只有一个的时候，反选项目
      if (matchItem.length == 1 && item.showOrder == matchItem[0].showOrder && item.pos == matchItem[0].pos) {
        const originIndex = matchItem[0].showOrder;
        Object.assign(matchItem[0].pos == 'top' ? top[originIndex] : bottom[originIndex], { active: false });
        this.setState({ matchItem: [] });
        return;
      }

      // 将配对项目的两个子项的active置为false，并且删除配对项
      this.state.matchList[index].map((item, index) => {
        const originIndex = item.showOrder;
        Object.assign(item.pos == 'top' ? top[originIndex] : bottom[originIndex], { active: false });
      });
      let thisMatchList = JSON.parse(JSON.stringify(this.state.matchList));
      thisMatchList.splice(index, 1);

      // 这一步将删除数组其中一项后的后面所有项目的 curLinePos - 1 处理
      thisMatchList.map((item, thisIndex) => {
        if (thisIndex >= index) {
          item.map((innerItem, innerIndex) => {
            const originIndex = innerItem.showOrder;
            Object.assign(innerItem.pos == 'top' ? top[originIndex] : bottom[originIndex], { curLinePos: (innerItem.curLinePos -= 1) });
            Object.assign(innerItem, innerItem.pos == 'top' ? top[originIndex] : bottom[originIndex]);
          });
        }
      });
      this.onChange();
      this.setState({ matchList: thisMatchList });
    };

    const flexLayout = layoutStyle == 1 ? 'horizonLayout' : '';
    const isShowRightAnswer = showRightAnswer;
    const isCheckRightAnswer = showCorrection && this.state.checkRightAnswer;
    // console.log('matchList', matchList);
    return (
      <OuterDiv>
        <BoxWrapper id="boxWrapper" className={`${flexLayout}Wrapper`}>
          {matchList.map((item, index) => <MatchLine coordinates={item} itemWidth={topWidth} key={index} layoutStyle={layoutStyle} showRightAnswer={isShowRightAnswer} isCheckRightAnswer={isCheckRightAnswer} />)}
          <TopRow className={`${flexLayout}`}>
            {top.map((item, index) => {
              const matchItemConfig = {
                pos: 'top',
                width: topWidth,
                key: index,
                setMatchItem,
                item,
                removeLine,
                layoutStyle,
                showRightAnswer: isShowRightAnswer,
                isCheckRightAnswer,
                interactive
              };

              return <MatchItem {...matchItemConfig} />;
            })}
          </TopRow>
          <BottomRow className={`${flexLayout}`}>
            {bottom.map((item, index) => {
              const matchItemConfig = {
                pos: 'bottom',
                width: bottomWidth,
                key: index,
                setMatchItem,
                item,
                removeLine,
                layoutStyle,
                showRightAnswer: isShowRightAnswer,
                isCheckRightAnswer,
                interactive
              };
              return <MatchItem {...matchItemConfig} />;
            })}
          </BottomRow>
        </BoxWrapper>
      </OuterDiv>
    );
  }
}

const MatchLine = (props) => {
  const { coordinates, layoutStyle = 1, showRightAnswer,
    isCheckRightAnswer, itemWidth } = props;

  const offsetData = layoutStyle == 1 ? 490 * 0.05 : 1205 * itemWidth * 5 / 10000;
  let topItem;
  let bottomItem;
  let isRight;
  coordinates.map((item, index) => {
    isRight = item.isRight;
    item.pos == 'top' && (topItem = item);
    item.pos == 'bottom' && (bottomItem = item);
  });
  let tx;
  let ty;
  let bx;
  let by;
  if (layoutStyle == 1) {
    tx = topItem.x - offsetData - 3;
    ty = topItem.y;
    bx = bottomItem.x + offsetData - 1;
    by = bottomItem.y;
  } else {
    tx = topItem.x;
    ty = topItem.y - offsetData - 1;
    bx = bottomItem.x;
    by = bottomItem.y + offsetData + 1;
  }

  const makeLine = () => {
    const a = bx - tx;
    const b = by - ty;
    const height = Math.sqrt(a * a + b * b);
    let radina;
    if (layoutStyle == 1) radina = (Math.asin(b / height)) - Math.PI / 2; else { radina = Math.asin(-a / height); }
    const angle = 180 / (Math.PI / radina);
    return { a, b, height, radina, angle };
  };
  const lineClass = showRightAnswer || (isCheckRightAnswer && isRight) ? ' examda-rightLine' :
    (isCheckRightAnswer && !isRight) ? ' examda-falseLine' : '';
  const lineConfig = {
    left: tx,
    top: ty,
    showRightAnswer,
    isCheckRightAnswer,
    isRight,
    height: makeLine().height,
    className: 'examda-styleMatchLine',
    angle: `${makeLine().angle}deg`,
  };
  return (
    <Line {...lineConfig}><div className={`examda-insideLine ${lineClass}`}></div></Line>
  );
};

export class MatchItem extends AbstractFragment {
  constructor(props) {
    super(props);
    this.toggleActive = this.toggleActive.bind(this);
    this.getDomCoordinate = this.getDomCoordinate.bind(this);
  }

  getDomCoordinate() {
    const { layoutStyle = 1, item, pos } = this.props;
    const { showOrder, id } = item;
    const $dom = document.getElementById(`box${id}`);
    const element = $dom.getBoundingClientRect();
    const parent = $dom.offsetParent;
    if (!parent) return;
    let x;
    let y;
    if (layoutStyle == 1) {
      x = pos == 'top' ? (parent.offsetLeft + $dom.offsetLeft + $dom.offsetWidth) : (parent.offsetLeft + $dom.offsetLeft);
      y = $dom.offsetTop + $dom.offsetHeight / 2 + parent.offsetTop;
    } else {
      x = parent.offsetLeft + $dom.offsetLeft + $dom.offsetWidth / 2;
      y = pos == 'top' ? ($dom.offsetTop + $dom.offsetHeight + parent.offsetTop) : ($dom.offsetTop + parent.offsetTop);
    }
    return Object.assign(item, { pos, showOrder, x, y });
  };

  toggleActive() {
    const { setMatchItem = noop, removeLine, item,
      showRightAnswer, isCheckRightAnswer } = this.props;
    const { active } = item;
    if (!this.isInteractive()) {
      return;
    }
    const thisDom = this.dom;

    const itemInfo = this.getDomCoordinate();
    itemInfo.active = !active
    const index = itemInfo.curLinePos || 0;
    // console.log('item', item);
    active ? removeLine(itemInfo, index) : setMatchItem(itemInfo);
    this.setState({});
  };

  render() {
    const { setMatchItem = noop, removeLine = noop, pos,
      width, layoutStyle = 1, showRightAnswer,
      isCheckRightAnswer, interactive } = this.props;
    let item = this.props.item;
    let isActive = this.props.item.active;
    // console.log('item', item);
    const { showOrder, type, content, id, isRight = false } = item;
    const widthNum = type == 'text' ? (content.length > 20 ? 2 : 1) : 1;
    const isShowLargeText = type == 'text' ? (content.length <= 7 ? true : false) : false;
    const itemId = showOrder;
    let boxClassName = isActive ? 'active' : isActive == false ? 'inactive' : '';
    boxClassName = layoutStyle == 1 ? (`horizonBox examda-match-box-wrapper ${boxClassName}`) : (`examda-match-box-wrapper ${boxClassName}`);
    boxClassName = showRightAnswer || (isCheckRightAnswer && isRight) ? (`examda-rightBox ${boxClassName}`) :
      (isCheckRightAnswer && !isRight) ? (`examda-falseBox ${boxClassName}`) : boxClassName;
    const boxConfig = {
      id: `box${id}`,
      width,
      widthNum,
      showRightAnswer,
      isCheckRightAnswer,
      isRight,
      className: boxClassName,
      innerRef: dom => {
        this.dom = dom;
        this.getDomCoordinate();
      },
      onClick: e => this.toggleActive()
    };

    let thisImg = new Image();
    let thisImgWidth,
      thisImgHeight;
    if (type == 'img') {
      thisImg.src = content;
      if (thisImg.width >= thisImg.height) {
        thisImgWidth = width * 12;
        thisImgHeight = width * 12 * thisImg.height / thisImg.width;
      } else {
        thisImgWidth = (width * 12 - 20) * thisImg.width / thisImg.height;
        thisImgHeight = width * 12 - 20;
      }
    }
    return (
      <Box {...boxConfig}>
        {type == 'text' ?
          <BoxContentWrapper className={'horizonBoxTextWrapper'}><BoxTextContent isShowLargeText={isShowLargeText} className={layoutStyle == 1 ? 'horizonBoxTextContent boxTextContent' : 'boxTextContent'}>{content}</BoxTextContent></BoxContentWrapper> :
          <BoxContentWrapper><BoxImgContent draggable={'false'} width={thisImgWidth} height={thisImgHeight} src={content}></BoxImgContent></BoxContentWrapper>}
        {(!showRightAnswer && isCheckRightAnswer && !isRight) && <FalseMask className={'examda-falseMask'} />}
      </Box>
    );
  }
}

export const BoxContentWrapper = styled.div`
  width: 100%;
  margin: auto;
  overflow: hidden;
  padding:0;
  position: absolute;
  top: 0;
  bottom: 0;
  display:flex;
  justify-content: center;
  align-items:center;
`;
export const Corner1 = styled.img`
  position: absolute;
  left: -10px;
  top: -10px;
`;
export const Corner2 = styled.img`
  position: absolute;
  right: -10px;
  top: -10px;
`;
export const Corner3 = styled.img`
  position: absolute;
  left: -10px;
  bottom: -10px;
`;
export const Corner4 = styled.img`
  position: absolute;
  right: -10px;
  bottom: -10px;
`;
export const Top = styled.img`
  position: absolute;
  top: -40px;
  left: 50%;
  margin-left: -76px;
`;
export const Bottom = styled.img`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: rotate(180deg);
  margin-left: -76px;
`;
export const BoxTextContent = styled.p`
  font-family: PingFangSC-Regular;
  font-size: ${(props) => props.isShowLargeText ? '28px' : '17px'};
  color: #15527E;
  line-height: 30px !important;
`;
export const BoxImgContent = styled.img`
`;
const FlexRow = styled.div`
  position: relative;
  z-index: 10;
  display:flex;
  flex-direction: row;
  justify-content: space-around;
`;
export const TopRow = styled(FlexRow)`
  margin-bottom: 120px;
  width: 100%;
`;
export const BottomRow = styled(FlexRow)`
  width: 100%;
`;
export const FalseMask = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
`;
const bounceIn = keyframes`
  0% {transform: scale(1)}
  75% {transform: scale(0.8)}
  100% {transform: scale(0.9)}
`;
const bounceOut = keyframes`
  0% {transform: scale(0.9)}
  25% {transform: scale(0.8)}
  100% {transform: scale(1)}
`;
let thisLineHeight;
const lineTo = keyframes`
  from {height: 0;}
  to {height: ${thisLineHeight}}
`;
export const BoxWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  padding: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.horizonLayoutWrapper {
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;

    .horizonLayout {
      width: 490px;
      margin: 0 60px;
      flex-direction: column;
      justify-content: space-around;

      .horizonBox {
        width: 100%;
        height: auto;
        margin: 0 0 20px 0;
        padding: 0;

        .horizonBoxTextWrapper {
          position: relative;
          min-height: 48px;

          .horizonBoxTextContent {
              margin: 0;
              line-height: 40px;
              font-size: 22px;
          }
        }
      }
    }
  }
`;
export const Box = styled.div`
  width: ${(props) => `${props.width * props.widthNum}%`};
  padding-bottom: ${(props) => `${props.width}%`};
  height: 0;
  background: white;
  position: relative;
  border-radius: 10px;
  box-sizing: content-box;
  text-align: center;
  display: flex;
  align-items: center;

  &.active {
    animation: ${bounceIn} 0.3s linear 1 both;
  }
  &.inactive {
    animation: ${bounceOut} 0.3s linear 1 both;
  }
`;
export const Line = styled.div`
  height: 0;
  position: absolute;
  transform-origin: 50% top;
  background: transparent!important;
  border-radius: 2px;
  z-index: 0;
  ${(props) => {
  const { left = 0, top = 0, height = 0, angle = 0 } = props;
  thisLineHeight = height;
  return `left: ${left}px; top: ${top}px; height: ${height}px; transform: rotate(${angle});`;
}};
  .examda-insideLine {
    border: solid white 1px;
    width: 100%;
    height: 100%;
    animation: ${lineTo} 0.3s linear 1 both;
  }
`;
export const OuterDiv = styled.div`
  position: relative;
  padding: 0 30px;
`;

MatchFragment.propTypes = {
  question: PropTypes.object.isRequired,
  showCorrection: PropTypes.bool,
  interactive: PropTypes.bool,
  showRightAnswer: PropTypes.bool,
  handleChange: PropTypes.func,
  stuAnswer: PropTypes.string,
}

export default MatchFragment;
