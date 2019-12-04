import React from 'react';
import { FlexRow } from 'components/FlexBox';
import AudioUpload from './Audio';

import {
  Input,
  message
} from 'antd';
const { TextArea } = Input;

class ViceTitle extends React.Component {
  getItemContent = (data) => {
    const { getContent } = this.props;
    data && getContent(data, 0);
  }
  handleChange = (e) => {
    const { getContent } = this.props;
    const value = e.target.value;
    if ((value || '').length > 5000) {
      message.info('听力文本材料最多只能为5000字！');
      return;
    }
    getContent({
      'stemBusiType': 'listenMaterial',
      'stemElementType': 2,
      'stemElementContent': value,
      'stemElementDesc': '听力文本材料',
      'stemElementOrder': 2
    }, 1);
  }
  render() {
    const { stemElementList } = this.props;
    // console.log('stemElementList', stemElementList)
    const listenFile = stemElementList.getIn([0, 'stemElementContent']);
    const stemElementDesc = stemElementList.getIn([0, 'stemElementDesc']);
    const listenMaterial = stemElementList.getIn([1, 'stemElementContent']);
    // console.log('viceprops', listenFile, listenMaterial)
    return (
      <div>
        <FlexRow>
          听力音频文件：<AudioUpload
            {...this.props}
            getItemContent={this.getItemContent}
            url={listenFile}
            stemElementDesc={stemElementDesc}
          /></FlexRow>
        <div>听力文本材料：</div>
        <TextArea
          rows={4}
          ref={(x) => { this.TextArea = x }}
          value={listenMaterial}
          onChange={this.handleChange}
        />
      </div>

    );
  }
}

export default ViceTitle;
