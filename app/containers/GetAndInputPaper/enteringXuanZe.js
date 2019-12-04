import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { FlexRowCenter, FlexColumn, FlexCenter } from 'components/FlexBox';
import { wangStyle, listStyle, questionStyle } from 'components/CommonFn/style';
import { numberToLetter } from 'components/CommonFn';
import { fromJS } from 'immutable';

import { Checkbox, Button, Radio } from 'antd';

require('katex/dist/katex.min.css');
const Header = styled(FlexRowCenter) `
  margin-left: -10px;
  height:30px;
  justify-content:flex-start;
`;
const EditBox = styled.div`
  min-height: 150px;
  cursor: text;
  ${questionStyle}
  ${listStyle}
  ${wangStyle}
`;
const EditBoxStyle = {
  minHeight: '150px',
  padding: '5px',
  marginTop: '3px',
  border: '1px solid #ddd',
  overflow: 'auto',
};
const AnswerListBox = styled(FlexRowCenter) `
  min-height: 30px;
  flex-wrap: wrap;
`;
const OptionBox = styled(FlexCenter) `
  flex: 1;
  min-width: 50px;
  padding-left: 20px;
`;
export const ChooseOptionsWrapper = styled(FlexColumn) `
  padding: 10px 0;
`;
export const MustInput = styled(FlexCenter) `
  margin: 0;
  width: 10px;
  &>div {
    color: red;
  }
`;
export const ChooseTitleValue = styled.div`
  height: 34px;
`;
export const OptionsBox = styled(FlexRowCenter) `
  min-height: 40px;
  margin: 2px 0;
`;
export const ValueBox = styled.div`
  min-width: 40px;
  text-align: right;
`;
export const ImitationInput = styled.div`
  flex: 1;
  min-height: 30px;
  line-height: 24px;
  border: 1px solid #eee;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: text;
  &:hover {
    border: 1px solid #108ee9;
  }
`;
export const DelBox = styled(ValueBox) `
  text-decoration: underline;
  color: #108ee9;
  text-align: center;
  cursor: pointer;
`;

export class EnteringWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.addOption = this.addOption.bind(this);
    this.removeOptionItem = this.removeOptionItem.bind(this);
  }
  addOption(type) {
    const currentList = (this.props.data.getIn(['questionOutputDTO', type]) || fromJS(['']));
    if (currentList.count() >= 25) {
      alert('不可以增加更多选项了');
      return;
    }
    const newList = currentList.push('');
    console.log(newList.toJS(), 'newList');
    this.props.setQuestionsList('parent', -1, type, newList);
  }
  removeOptionItem(e, index, item, i, type) {
    const currentList = (this.props.data.getIn(['questionOutputDTO', type]) || fromJS(['']));
    if (currentList.count() <= 1) {
      alert('选项（或答案）已经只剩 1 个了， 不能再少了！');
      return;
    }
    const newList = currentList.delete(i);
    this.props.setQuestionsList('parent', -1, type, newList);
  }
  render() {
    const { data, editorClick, setQuestionsList } = this.props;
    const optionList = (data.getIn(['questionOutputDTO', 'optionList']) || fromJS([]));
    const isSingle = (data.getIn(['questionOutputDTO', 'typeId']) == 1) ? true : false;
    return (
      <FlexColumn className='xuzeti'>
        <FlexColumn style={{ padding: 15 }}>
          <Header><MustInput><div>*</div></MustInput>题干：</Header>
          <div>
            <EditBox style={EditBoxStyle} ref='tigan' dangerouslySetInnerHTML={{ __html: data.getIn(['questionOutputDTO', 'title']) || '' }} onClick={(e) => editorClick(e, -1, fromJS({}), -1, 'title', 'questionMsg')}></EditBox>
          </div>
        </FlexColumn>
        <ChooseOptionsWrapper>
          <FlexRowCenter style={{ height: '34px' }}><MustInput><div>*</div></MustInput><ChooseTitleValue style={{ height: 'auto' }}>选项：</ChooseTitleValue></FlexRowCenter>
          {optionList.map((it, i) => {
            return (<OptionsBox key={i}><ValueBox style={{ textAlign: 'center' }}>{numberToLetter(i)}</ValueBox><ImitationInput dangerouslySetInnerHTML={{ __html: it }} onClick={(e) => editorClick(e, -1, fromJS({}), i, 'optionList', 'questionMsg')}></ImitationInput>
              <DelBox onClick={(e) => this.removeOptionItem(e, -1, fromJS({}), i, 'optionList')}>删除</DelBox></OptionsBox>);
          })}
          <FlexRowCenter style={{ paddingLeft: 40 }}><Button type="primary" ghost onClick={() => this.addOption('optionList')}>添加选项</Button></FlexRowCenter>
        </ChooseOptionsWrapper>
        <FlexColumn style={{ padding: 15 }}>
          <Header><MustInput><div>*</div></MustInput>答案：</Header>
          {/* {checkList} */}
          {isSingle ? (
            <Radio.Group
              style={{ width: '100%' }} value={data.getIn(['questionOutputDTO', 'answerList', 0]) || ''} onChange={(answerList) => {
                const val = [answerList.target.value];
                console.log('val', val);
                setQuestionsList('parent', -1, 'answerList', fromJS(val));
              }}
            >
              <AnswerListBox>
                {new Array(optionList.count()).fill('').map((it, i) => {
                  return (<Radio key={i} value={numberToLetter(i)}>{numberToLetter(i)}</Radio>);
                })}
              </AnswerListBox>
            </Radio.Group>
          ) : (
            <Checkbox.Group
              style={{ width: '100%' }} value={(data.getIn(['questionOutputDTO', 'answerList']) || fromJS([])).toJS()} onChange={(answerList) => {
                setQuestionsList('parent', -1, 'answerList', fromJS(answerList.filter((it) => /^[A-Z]$/.exec(it)).sort()));
              }}
            >
              <AnswerListBox>
                {new Array(optionList.count()).fill('').map((it, i) => {
                  return (<OptionBox key={i}><Checkbox style={{ marginLeft: 4 }} value={numberToLetter(i)}>{numberToLetter(i)}</Checkbox></OptionBox>);
                })}
              </AnswerListBox>
            </Checkbox.Group>
          )}
        </FlexColumn>
        <FlexColumn style={{ padding: 15 }}>
          <Header><MustInput><div>*</div></MustInput>解析：</Header>
          <EditBox style={EditBoxStyle} dangerouslySetInnerHTML={{ __html: data.getIn(['questionOutputDTO', 'analysis']) || '' }} onClick={(e) => editorClick(e, -1, fromJS({}), -1, 'analysis', 'questionMsg')} ></EditBox>
        </FlexColumn>
      </FlexColumn>
    );
  }
}
EnteringWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setQuestionsList: PropTypes.func,
  editorClick: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnteringWrapper);
