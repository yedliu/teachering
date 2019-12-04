import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import { FlexRowCenter, FlexColumn } from 'components/FlexBox';
import { wangStyle, listStyle, questionStyle } from 'components/CommonFn/style';

import { Button } from 'antd';
import {
  ChooseOptionsWrapper,
  MustInput,
  ChooseTitleValue,
  OptionsBox,
  ValueBox,
  ImitationInput,
  DelBox,
} from './enteringXuanZe';
require('katex/dist/katex.min.css');

const Header = styled(FlexRowCenter)`
  margin-left: -10px;
  height:30px;
  justify-content:flex-start
`;
const EditBox = styled.div`
  min-height: 150px;
  cursor: text;
  ${questionStyle}
  ${listStyle}
  ${wangStyle}
`;
const EditBoxStyle = {
  padding: '5px',
  marginTop: '3px',
  border: '1px solid #ddd',
  overflow: 'auto',
};

export class EnteringTianKong extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.removeOptionItem = this.removeOptionItem.bind(this);
    this.addOption = this.addOption.bind(this);
    this.state = {
      answerList: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
        { label: 'D', value: 'D' },
      ],
      tigan: '',
      jiexi: '',
    };
  }
  componentWillMount() {
  }
  componentDidMount() {

  }
  addOption(type) {
    const currentList = (this.props.data.getIn(['questionOutputDTO', type]) || fromJS(['']));
    if (currentList.count() >= 25) {
      alert('不可以增加更多选项了');
      return;
    }
    const newList = currentList.push('');
    this.props.setQuestionsList('parent', -1, 'answerList', newList);
  }
  removeOptionItem(e, index, item, i, type) {
    const currentList = (this.props.data.getIn(['questionOutputDTO', type]) || fromJS(['']));
    if (currentList.count() <= 1) {
      alert('答案已经只剩 1 个了， 不能再少了！');
      return;
    }
    const newList = currentList.delete(i);
    this.props.setQuestionsList('parent', -1, type, newList);
  }
  render() {
    // const { change, data, removeOption, optionsLen } = this.props;
    const { data, editorClick } = this.props;
    const answerList = (data.getIn(['questionOutputDTO', 'answerList']) || fromJS(['']));
    return (
      <FlexColumn className="tiankong">
        <FlexColumn style={{ padding: 15 }}>
          <Header><MustInput><div>*</div></MustInput>题干：</Header>
          <div>
            <EditBox style={EditBoxStyle} dangerouslySetInnerHTML={{ __html: data.getIn(['questionOutputDTO', 'title']) || '' }} onClick={(e) => editorClick(e, -1, fromJS({}), -1, 'title', 'questionMsg')}></EditBox>
          </div>
        </FlexColumn>
        <ChooseOptionsWrapper>
          <FlexRowCenter style={{ height: '34px' }}><MustInput><div>*</div></MustInput><ChooseTitleValue style={{ height: 'auto' }}>答案：</ChooseTitleValue></FlexRowCenter>
          {answerList.map((it, i) => {
            return (<OptionsBox key={i}><ValueBox style={{ textAlign: 'center' }}>{i + 1}</ValueBox><ImitationInput dangerouslySetInnerHTML={{ __html: it || '' }} onClick={(e) => editorClick(e, -1, fromJS({}), i, 'answerList', 'questionMsg')}></ImitationInput>
              <DelBox onClick={(e) => this.removeOptionItem(e, -1, fromJS({}), i, 'answerList')}>删除</DelBox></OptionsBox>);
          })}
          <FlexRowCenter style={{ paddingLeft: 40 }}><Button type="primary" ghost onClick={() => this.addOption('answerList')}>添加选项</Button></FlexRowCenter>
        </ChooseOptionsWrapper>
        <FlexColumn style={{ padding: 15 }}>
          <Header><MustInput><div>*</div></MustInput>解析：</Header>
          <EditBox style={EditBoxStyle} dangerouslySetInnerHTML={{ __html: data.getIn(['questionOutputDTO', 'analysis']) || '' }} onClick={(e) => editorClick(e, -1, fromJS({}), -1, 'analysis', 'questionMsg')}></EditBox>
        </FlexColumn>
      </FlexColumn>

    );
  }
}
EnteringTianKong.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  // change: PropTypes.func.isRequired,
  editorClick: PropTypes.func,
  setQuestionsList: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // formChange: (props, value) => {
    //   console.log('change', value);
    //   // console.log('只来了',value.getFieldsValue())
    // },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnteringTianKong);
