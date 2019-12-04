import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import immutable, { fromJS } from 'immutable';
import { FlexRow, FlexRowCenter, FlexColumn, FlexCenter, FadeIn, FadeOut, DivShadow } from 'components/FlexBox';
import { wangStyle, listStyle, questionStyle } from 'components/CommonFn/style';
import { MustInput } from './enteringXuanZe';
require('katex/dist/katex.min.css');

const Header = styled(FlexRowCenter) `
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
  minHeight: '150px',
  padding: '5px',
  marginTop: '3px',
  border: '1px solid #ddd',
  overflow: 'auto',
};

export class EnteringWenDa extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }
  render() {
    const { data, editorClick } = this.props;
    return (
      <FlexColumn className='xuzeti'>
        <FlexColumn style={{ padding: 15 }}>
          <Header><MustInput><div>*</div></MustInput>题干：</Header>
          <div>
            <FlexColumn style={{ justifyContent: 'flex-end' }}>
            </FlexColumn>
            <EditBox style={EditBoxStyle} dangerouslySetInnerHTML={{ __html: data.getIn(['questionOutputDTO', 'title']) || '' }} onClick={(e) => editorClick(e, -1, fromJS({}), -1, 'title', 'questionMsg')}></EditBox>
          </div>
        </FlexColumn>
        <FlexColumn style={{ padding: 15 }}>
          <Header><MustInput><div>*</div></MustInput>答案：</Header>
          <EditBox style={EditBoxStyle} dangerouslySetInnerHTML={{ __html: data.getIn(['questionOutputDTO', 'answerList', 0]) || '' }} onClick={(e) => editorClick(e, -1, fromJS({}), 0, 'answerList', 'questionMsg')}></EditBox>
        </FlexColumn>
        <FlexColumn style={{ padding: 15 }}>
          <Header><MustInput><div>*</div></MustInput>解析：</Header>
          <EditBox style={EditBoxStyle} dangerouslySetInnerHTML={{ __html: data.getIn(['questionOutputDTO', 'analysis']) || '' }} onClick={(e) => editorClick(e, -1, fromJS({}), -1, 'analysis', 'questionMsg')}></EditBox>
        </FlexColumn>
      </FlexColumn>
    );
  }
}
EnteringWenDa.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  editorClick: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnteringWenDa);
