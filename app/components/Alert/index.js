/**
*
* Alert
* properties 对象包含所有属性与参数
{
  isOpen:bool 控制弹框打开的属性;
  bgColor:string 用来替换弹框北京遮罩杨塞，默认 rgba(0, 0, 0, 0.3);
  buttonsType:string 1-1(一个按钮，类型1) | 2-12(两个按钮，类型分别为 1 和 2 ) // 不传则默认为没有按钮, 也可以只传入一个 button 数量, 只传数量时可以是 number || string;
  titleStyle:css 使用 styled-components 生命的 css, 用来替换 title 默认样式作用;
  title:any 任何你在 react 中可以渲染的内容, 作为弹框 title 的内容;
  className:string 用来传递到 Button 组件中的类名，用于作为 Button 组件中 a 标签的 className;
  leftClick:func 左边按钮点击事件（buttonsType 为 2 时可用）;
  rightClick:func 右边按钮点击事件 （buttonsType 为 2 时可用）;
  oneClick:func 按钮点击事件（buttonsType 为 1 时可用）;
}
*/

import React, { PropTypes } from 'react';
import styled, { css } from 'styled-components';
import Modal from 'react-modal';
import Button from 'components/Button';
import { FlexRow, FlexColumn, FlexCenter, FadeIn } from 'components/FlexBox';
import { outValue, outChild } from 'components/CommonFn';
const error = window._baseUrl.imgCdn + 'd32ba377-f527-4979-b40d-0e2d6591d111.png';
const success = window._baseUrl.imgCdn + '7c9ddd40-9680-4cbd-ab4b-122ae9257a8e.png';
const warning = window._baseUrl.imgCdn + '555529b3-d58d-446a-b67b-d801f21a07ed.png';
const loading = window._baseUrl.imgCdn + '0ac05111-ab12-46ff-ba1e-7aa21875f810.gif';
const closeIcon = window._baseUrl.imgCdn + '8a491dc2-f189-4171-a0c1-95e375a953c1.png';

const TitleStype = css`
  font-weight: 600;
  margin: 5px 0;
`;
const AlertBox = styled(FlexColumn)`
  // width: 360px;
  // border-radius: 6px;
  // padding: 1px 0 20px;
  flex: 1;
  background-color: white;
  user-select: none;
  & > p {
    font-family: Microsoft YaHei;
  }
`;
const AlertTitle = styled.div`
  position: relative;
  padding: 0 20px;
  ${(props) => (props.iStyle ? props.iStyle : `${TitleStype}`)}  // 这里需要后续添加默认样式
`;
const TitleLine = styled.div`
  height: 1px;
  background-color: ${(props) => (props.lineColor ? props.lineColor : '#ccc')};
`;
const AlertContent = styled.div`
  flex: 1;
  padding: 20px 0;
`;
const ButtonWrapper = styled(FlexRow)`
  box-sizing: border-box;
  justify-content: space-between;
  min-width: ${(props) => (props.buttonCount === 1 ? '180px' : '280px')};
  padding: ${(props) => (props.pad ? '0 ' + props.pad + 'px' : '')};
`;
export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    minHeight: '240px',
    minWidth: '485px',
    animation: `${FadeIn} .5s linear`,
    transform: 'translate(-50%, -50%)',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, .2)',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
};
const AlertContentBox = styled(FlexColumn)`
  flex: 1;
  padding: 0 20px;
`;
const ImgWrapper = styled(FlexCenter)`
  flex: 1;
  min-height: 150px;
`;
const ContentWrapper = styled(FlexColumn)`
  flex: 1;
  min-height: 150px;
`;
const CloseIcon = styled.div`
  position: absolute;
  top: -10px;
  right: 0;
  width: 30px;
  height: 30px;
  // padding: 2.5px;
  border-radius: 50%;
  border: 1px solid #ddd;
  cursor: pointer;
  background: url(${closeIcon}) no-repeat center center;
  &:hover {
    border-color: #bbb;
  }
  &:active {
    border-color: #999;
  }
`;

class Alert extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.button = this.buttons.bind(this);
    this.emptyClick = this.emptyClick.bind(this);
  }
  emptyClick(e) {
    // console.dir(e);
  }
  buttons() {
    const buttonsType = String(this.props.properties.buttonsType) || '';
    let uButton = '';
    switch (buttonsType.substr(0, 1)) {
      case '1':
        uButton = (
          <Button
            showtype={Number(buttonsType.substr(0, 1))}
            className={outValue(this.props.properties.btnClassName, 0)}
            onClick={this.props.properties.oneClick || this.emptyClick}
          >
            {outChild(this.props.properties.child, 0) || '确定'}
          </Button>
        );
        break;
      case '2':
        //
        uButton = (
          <ButtonWrapper
            buttonCount={Number(buttonsType.substr(0, 1)) || 1}
            pad={this.props.properties.buttonsIndent || 0}
          >
            <Button
              showtype={Number(buttonsType.substr(2, 1)) || 1}
              className={outValue(this.props.properties.btnClassName, 0)}
              href={outValue(this.props.properties.href, 0)}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (this.props.properties.leftClick) {
                  this.props.properties.leftClick(e);
                } else {
                  this.emptyClick(e);
                }
              }}
            >
              {outChild(this.props.properties.child, 0) || '确认'}
            </Button>
            <Button
              showtype={Number(buttonsType.substr(3, 1)) || 2}
              className={outValue(this.props.properties.btnClassName, 1)}
              href={outValue(this.props.properties.href, 1)}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (this.props.properties.rightClick) {
                  this.props.properties.rightClick(e);
                } else {
                  this.emptyClick(e);
                }
              }}
            >
              {outChild(this.props.properties.child, 1) || '取消'}
            </Button>
          </ButtonWrapper>
        );
        break;
      default:
        break;
    }
    return uButton;
  }
  childrenShow() {
    let res = '';
    if (this.props.properties.imgType) {
      switch (this.props.properties.imgType) {
        case 'success':
          res = (
            <ImgWrapper>
              <img role="presentation" src={success} />
            </ImgWrapper>
          );
          break;
        case 'error':
          res = (
            <ImgWrapper>
              <img role="presentation" src={error} />
            </ImgWrapper>
          );
          break;
        case 'loading':
          res = (
            <ImgWrapper>
              <img role="presentation" src={loading} />
            </ImgWrapper>
          );
          break;
        case 'warning':
          res = (
            <ImgWrapper>
              <img role="presentation" src={warning} />
            </ImgWrapper>
          );
          break;
        default:
          break;
      }
    } else {
      res = <AlertContent>{this.props.children || ''}</AlertContent>;
    }
    if (this.props.properties.showDouble) {
      res = (
        <ContentWrapper>
          {res}
          <AlertContent
            style={{
              fontSize: 14,
              paddingTop: 0,
              color: 'grey',
              fontFamily: 'Microsoft YaHei',
            }}
          >
            {this.props.children || ''}
          </AlertContent>
        </ContentWrapper>
      );
    }
    return res;
  }
  render() {
    if (!this.props.properties) return '';
    return (
      <Modal
        isOpen={this.props.properties.isOpen || false}
        style={customStyles}
        contentLabel="Alert Modal"
      >
        <AlertBox>
          <AlertTitle style={this.props.properties.titleStyle || {}}>
            {this.props.properties.title || '警告!'}
            {this.props.properties.rightClose ? (
              <CloseIcon onClick={this.props.properties.closeClick} />
            ) : (
              ''
            )}
          </AlertTitle>
          <TitleLine lineColor={this.props.properties.lineColor || ''} />
          <AlertContentBox>
            {this.childrenShow()}
            {this.buttons()}
          </AlertContentBox>
        </AlertBox>
      </Modal>
    );
  }
}

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  properties: PropTypes.object.isRequired,
};

export default Alert;
