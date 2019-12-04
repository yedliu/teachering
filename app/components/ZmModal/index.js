/**
 * Created by Administrator on 2018/1/23.
 */
import React, { Component, PropTypes } from 'react';
import styled, { injectGlobal } from 'styled-components';
// import Modal from 'react-modal';
injectGlobal`
  .split-line{
    position: relative;
    display: block;
  }
 .split-line:before{
    display: block;
    height: 40px;
    width: 0px;
    content: '';
    position: absolute;
    top: 0;
    border-left: 1px solid #ddd;
}
`;
const Modal = styled.div `
  position: fixed;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(55, 55, 55, 0.6);
  z-index: 1001;
  -webkit-overflow-scrolling: touch;
  outline: 0;
`;

const ModalContainer = styled.div `
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  transform: translate(-50%, -50%);
  border: 1px solid #ddd;
  background-color: white;
  z-index: 10;
`;

const Mtitle = styled.div `
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: rgb(52, 153, 255);
  padding-left: 20px;
  border-bottom: 1px solid #ddd;
  position: relative;
`;

const Mcontent = styled.div `
  font-size: 14px;
  color: #333;
  padding: 20px;
  border-bottom: 1px solid #ddd;
`;

const Mfooter = styled.div `
  display: flex;
  height: 40px;
  font-size: 16px;
  button{
    flex: 1;
    &:hover, &:active{
      background: #ddd;
      border: none;
      outline: none;
    }
  }
`;

const CloseBtn = styled.div`
  width: 20px;
  height: 20px;
  line-height: 20px;
  position: absolute;
  right: 5px;
  top: 10px;
  color: #777777;
  user-select: none;
  ${props => props.hidden ? 'display: none' : ''};
`;

const noop = () => {};

class ZmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      open: false,
      content: '',
      sure: null,
      cancel: null,
      timeout: 2000,
    };
  }

  _okFunc() {
    this.state.sure();
    this._clearFunc();
  }

  _cancelFunc() {
    this.state.cancel();
    this._clearFunc();
  }

  _otherFunc() {
    this.state.other();
    this._clearFunc();
  }

  _clearFunc() {
    this.setState({
      type: '',
      open: false,
      content: '',
      sureText: '',
      cancelText: '',
      otherText: '',
      sure: noop,
      cancel: noop,
      timeout: 2000,
    });
  }

  _openFunc(config, type) {
    const content = config.content;
    if (!content) {
      return;
    }
    const emptyFunc = function () {};
    config.type = type;
    config.open = true;
    config.sure = config.sure || noop;
    config.cancel = config.cancel || noop;
    config.sureText = config.sureText || '确定';
    config.cancelText = config.cancelText || '取消';
    this.setState(config);
  }

  componentDidUpdate() {
    if (this.state.content && this.state.type === 'toast') {
      setTimeout(() => {
        this._okFunc();
      }, this.state.timeout);
    }
  }

  componentDidMount() {
    window.zmAlert = (config = {}) => {
      config = typeof config === 'string' ? { content: config } : config;
      this._openFunc(config, 'alert');
    };
    window.zmConfirm = (config = {}) => {
      this._openFunc(config, 'confirm');
    };
    window.zmToast = (config = {}) => {
      config = typeof config === 'string' ? { content: config } : config;
      this._openFunc(config, 'toast');
    };
  }

  render() {
    const { close } = this.state;
    return (
      <div>
        {
          this.state.open &&
          <Modal>
            {
            this.state.type === 'alert' && <ModalContainer>
              <Mtitle>提示</Mtitle>
              <Mcontent>{this.state.content}</Mcontent>
              <Mfooter><button onClick={() => this._okFunc()}>{this.state.sureText || '确定'}</button></Mfooter>
            </ModalContainer>
           }
            {
            this.state.type === 'toast' && <ModalContainer>
              <Mcontent>{this.state.content}</Mcontent>
            </ModalContainer>
           }
            {
            this.state.type === 'confirm' && <ModalContainer>
              <Mtitle>
              提示
              <CloseBtn hidden={!close} onClick={() => this.setState({ open: false })}> × </CloseBtn>
              </Mtitle>
              <Mcontent>{this.state.content}</Mcontent>
              <Mfooter><button onClick={() => this._okFunc()}>{this.state.sureText || '确定'}</button>{this.state.otherText && <button onClick={() => this._otherFunc()} className="split-line">{this.state.otherText}</button>}<button onClick={() => this._cancelFunc()} className="split-line">{this.state.cancelText || '取消'}</button></Mfooter>
            </ModalContainer>
           }
          </Modal>
        }
      </div>
    );
  }
}

export default ZmModal;
