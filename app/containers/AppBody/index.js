import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { FlexRow, FlexRowCenter, FlexCenter, FlexColumn } from 'components/FlexBox';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import Menu, { SubMenu, SubMenuItem } from '../../components/Navigation/Menu/index';
import makeSelectAppBody from './selectors';
import { defaultAction } from './actions';

const BodyWrapper = styled(FlexColumn)`
  min-height: 100%;
  max-height: 100%;
  background-color: white;
`;

// eslint-disable-next-line react/prefer-stateless-function
export class AppBody extends React.PureComponent {
  handleOnclick = (e) => {
    console.log(213);
    browserHistory.push('/react/course-system');
  };
  render() {
    const subItemStyle = { width: 230, color: '#fff', height: 60, display: 'flex', alignItems: 'center', paddingLeft: 88 };
    return (
      <BodyWrapper>
        <Menu style={{ width: 230, height: '100%' }}>
          <SubMenu key="sub1" title={'首页'} style={subItemStyle} />
          <SubMenu key="sub2" title={'基础数据管理'} style={subItemStyle}>
            <SubMenuItem key="subItem1" title={'课程体系管理'} style={subItemStyle} onClick={this.handleOnclick} />
            <SubMenuItem key="subItem2" title={'知识点管理'} style={subItemStyle} onClick={this.handleOnclick} />
          </SubMenu>
        </Menu>
        {React.Children.toArray(this.props.children)}
      </BodyWrapper>
    );
  }
}

AppBody.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  AppBody: makeSelectAppBody(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleOnclick: () => dispatch(defaultAction()),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppBody);
