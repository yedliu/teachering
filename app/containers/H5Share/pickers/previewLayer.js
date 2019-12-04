import React, { Component } from 'react';
import { RootWrapper, Wrapper } from '../elementStyle/shareStyle';
import appInfo, { makeLog, mapList } from '../appInfo';
import Config from 'utils/config';
import { courseStyles } from '../config';
import { ActionBar, PreviewBox, IframeBox } from './elementStyle/previewLayerStyle';

const noop = () => { };
const log = makeLog('PreviewLayer');

let postToInner = noop,
  haddleIframeMessage = noop,
  stopScroll = noop;

export default class PreviewLayer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      role: props.role || 'teacher',
      usage: props.usage || '',
    };
  }

  componentDidMount() {
    window.addEventListener('message', haddleIframeMessage = (event) => {
      const { action } = event.data;
      this.haddleInnerRequest(action, event.data);

      postToInner = (info) => window.frames.previewBox.contentWindow.postMessage(info, '*');

      action == 'showPageIndex' && postToInner({ action: 'showPage', data: event.data.data });
    });
    document.body.addEventListener('touchmove', stopScroll = event => event.preventDefault());
  }

  componentWillUnmount() {
    window.removeEventListener('message', haddleIframeMessage);
    document.body.removeEventListener('touchmove', stopScroll);
  }

  haddleInnerRequest(action, data) {
    postToInner = (info) => window.frames.previewBox.contentWindow.postMessage(info, '*');

    action == 'ready' && postToInner({
      action: 'setUserInfo',
      data: { name: '', id: '', avatar: '' }
    });

    action == 'ready' && postToInner({
      action: 'setPages',
      data: JSON.stringify(this.props.data)
    });

    action == 'dataReady' && postToInner({
      action: 'showPage',
      data: this.props.index || 0
    });
  }

  changeStyle(styleType) {
    const res = JSON.parse(JSON.stringify(this.props.data));
    const data = res.data || res;
    const resetStyle = { color: '', backgroundColor: '', backgroundImage: '' };
    Object.assign(resetStyle, courseStyles[styleType] || {});
    mapList(data, item => {
      item.styleType = styleType;
      item.type == 'page' && (item.containerStyle = resetStyle);
    });
    postToInner({
      action: 'setPages',
      data: JSON.stringify(data)
    });
  }

  toggleRole() {
    const { role } = this.state;
    this.setState({ role: role == 'teacher' ? 'student' : 'teacher', usage: '' });
  }
  togglePrint() {
    this.setState({ usage: 'print' });
  }

  render() {
    const { role, usage } = this.state;
    const { toggleRole = !false, showSetStyle } = this.props;

    return (
      <RootWrapper>
        <Wrapper>
          <ActionBar className={!toggleRole && 'hidden' || ''}>
            <span onClick={event => this.toggleRole()}>{role == 'teacher' ? '老师视图' : '学生视图'}</span>
            <span onClick={event => this.togglePrint()}>打印视图</span>
            {showSetStyle && <span onClick={event => this.changeStyle('beach')}>海滩风格</span>}
            {showSetStyle && <span onClick={event => this.changeStyle('tech')}>科技风格</span>}
            {showSetStyle && <span onClick={event => this.changeStyle('ocean')}>海洋风格</span>}
            {showSetStyle && <span onClick={event => this.changeStyle('pyramid')}>金字塔风格</span>}
            {showSetStyle && <span onClick={event => this.changeStyle('rainforest')}>雨林风格</span>}
          </ActionBar>
          <PreviewBox>
            <IframeBox innerRef={dom => this.playBox = dom}>
              {usage != 'print' && role == 'teacher' && <iframe id="previewBox" allowFullScreen allowTransparency src={`${Config.zmlPath}?role=teacher&device=pc&usage=preview`} /> || null}
              {usage != 'print' && role != 'teacher' && <iframe id="previewBox" allowFullScreen allowTransparency src={`${Config.zmlPath}?role=student&device=pc&usage=preview`} /> || null}
              {usage == 'print' && <iframe id="previewBox" allowFullScreen allowTransparency src={`${Config.zmlPath}?role=student&device=pc&usage=print`} /> || null}
            </IframeBox>
          </PreviewBox>
        </Wrapper>
      </RootWrapper>
    );
  }
}