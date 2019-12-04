// 主要做预览题目
import React, { Component } from 'react';

import { sliderScale, previewOriginWidth, courseStyles } from './config';
import { PreviewWarper, PreviewBox } from './elementStyle/previewSlideStyle';
import { EditPageContent, EditPlayground, EditPageContainer } from './elementStyle/pageEditorStyle';
import PreviewLayer from './pickers/previewLayer';

import { makeLog, makeDirToPages, mapList } from './appInfo';

const noop = () => { };
const log = makeLog('previewSlide');

let resizeListener;
const previewStatus = {};

export default class PreviewSlide extends React.Component {
  componentWillMount() {
    window.addEventListener('resize', resizeListener = () => {
      const editBox = this.editBox;
      if (!editBox || !this.editBody) return;
      const _w = editBox.offsetWidth;
      const _h = editBox.offsetHeight;
      const _s = sliderScale;
      const editBoxWidth = (_w / _h > _s ? _h * _s : _w) * 1;
      const editBoxHeight = (_w / _h > _s ? _h : _w / _s) * 1;
      this.editBody.style.width = `${editBoxWidth}px`;
      this.editBody.style.height = `${editBoxHeight}px`;
      this.setState({ scale: editBoxWidth / previewOriginWidth });
    });
    setTimeout(resizeListener, 30);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', resizeListener);
  }

  render() {
    const { slideData, question } = this.props;
    const defaultStyle = question && (question.templateType < 5);
    const mockPages = [{
      id: 1,
      type: 'dir',
      children: [{
        id: 12,
        type: 'page',
        elements: [{
          type: 'question',
          style: {},
          question: { ...question, id: 123 }
        }]
      }]
    }];
    const styleType = defaultStyle ? 'default' : 'beach';
    const resetStyle = { color: '', backgroundColor: '', backgroundImage: '' };
    Object.assign(resetStyle, courseStyles[styleType] || {});
    mapList(mockPages, item => {
      item.styleType = styleType;
      item.type == 'page' && (item.containerStyle = resetStyle);
    });
    const previewData = slideData && slideData.data || mockPages;

    return (
      <PreviewWarper>
        <PreviewBox>
          <EditPageContainer innerRef={($dom) => this.editBox = $dom}>
            <EditPageContent innerRef={($dom) => this.editBody = $dom}>
              <PreviewLayer data={previewData} setDefaultStyle={defaultStyle} showSetStyle={!slideData && question} />
            </EditPageContent>
          </EditPageContainer>
        </PreviewBox>
      </PreviewWarper>
    );
  }
}
