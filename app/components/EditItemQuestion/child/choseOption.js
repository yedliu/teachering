import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import {
  ImgUpload,
  AudioUpload,
  TextEditor,
  JudgAnswer,
} from 'components/Upload';
import {
  numberToLetter,
} from 'components/CommonFn';
import { FlexRow } from 'components/FlexBox';

const ItemWrapper = styled.div`
  .delBtn {
    margin-left: 2px;
  }
  .isImg {
    display: none;
    position: absolute;
    right: 10px;
    top: 1px;
  }
  &:hover {
    .isImg {
      display: inline;
    }
  }
`;

class ChoseOption extends React.Component {
  constructor(props) {
    super();
    this.state = {
      status: 'start'
    };
  }
  getItemContent = (data) => {
    const { getContent, type, index } = this.props;
    // debugger
    console.log('choseoption', data);
    const _CONTENT = `${type}Content`;
    const _DESC = `${type}Desc`;
    const _TYPE = `${type}Type`;
    const _ORDER = `${type}Order`;
    const {
      optionElementContent,
      optionElementDesc,
      optionElementType,
    } = data;
    const item = {};
    item[_CONTENT] = optionElementContent;
    item[_DESC] = optionElementDesc;
    item[_TYPE] = optionElementType;
    item[_ORDER] = index;

    getContent(item);
  }
  getStatus = (status) => {
    this.setState({ status });
  }
  render() {
    const {
      serialMark,
      judge,
      index: i = 0,
      contentType = 'text',
      getIndex,
      getJudgeAns,
      getContent, // eslint-disable-line
      optionElementItem,
      answerList,
      type,
      ...rest
    } = this.props;
    // console.log('ChoseOption_contentType', contentType, optionElementItem.toJS(), queType);
    const _CONTENT = `${type}Content`;
    const _DESC = `${type}Desc`;
    const _TYPE = `${type}Type`;
    const _ORDER = `${type}Order`;
    const {
      [_CONTENT]: optionElementContent,
      [_DESC]: optionElementDesc,
      [_TYPE]: optionElementType,
      [_ORDER]: optionElementOrder,
    } = optionElementItem.toJS();
    const item = {
      optionElementContent,
      optionElementDesc,
      optionElementType,
      optionElementOrder
    };
    const comProps = {
      index: i,
      getItemContent: this.getItemContent,
      optionElementItem: item,
      getIndex,
      ...rest
    };
    const renderChoseTab = () => ({
      text: <TextEditor  {...comProps} />,
      img: <ImgUpload {...comProps} />,
      audio: <AudioUpload  {...comProps} getStatus={this.getStatus} />,
    });
    const isImg = contentType === 'img';
    const isText = contentType === 'text';

    const imgItemStyle = {
      display: 'flex',
      position: 'relative'
    };
    return (
      <FlexRow>
        <serial-mark
          style={{ maxWidth: 30, width: 30, display: 'inline' }}
        >{(serialMark && serialMark === 'A') ? `${numberToLetter(i)}、` : ` ${i + 1}、`}
        </serial-mark>
        <ItemWrapper style={isImg ? imgItemStyle : { display: 'flex', flex: 1 }}>
          <span style={isText || (isImg && judge) ? { display: 'flex', flex: 1, flexDirection: 'column' } : {}}>
            {renderChoseTab()[contentType]}
            {judge ? <JudgAnswer getAnswer={getJudgeAns} index={i} answerList={answerList} /> : ''}
          </span>
          <Button
            className={isImg ? 'isImg' : 'delBtn'}
            type={isImg ? 'dashed' : 'primary'}
            onClick={() => {
              getIndex(i);
            }}
          >删除</Button>
        </ItemWrapper>
      </FlexRow >
    );
  }
}
ChoseOption.propTypes = {
  serialMark: PropTypes.string,
  index: PropTypes.number,
  getIndex: PropTypes.func,
  getJudgeAns: PropTypes.func,
  getContent: PropTypes.func,
  optionElementItem: PropTypes.object,
  tyoe: PropTypes.string,
};
export default ChoseOption;
