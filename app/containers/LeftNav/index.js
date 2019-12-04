import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FlexRow } from 'components/FlexBox';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import { Menu } from 'antd';
import makeSelectLeftNav from './selectors';

const BodyWrapper = styled(FlexRow)`
  weight: 230px;
  height: 100%;
  background-color: white;
  font-size: 14px;
`;

export class LeftNav extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  handleOnclick = (v) => {
    console.log('跳转啦:', v.key);
    browserHistory.push(v.key);
  };
  render() {
    const subItemStyle = { width: 230, color: '#fff', height: 60, display: 'flex', alignItems: 'center', paddingLeft: 88 };
    return (
      <BodyWrapper>
        <Menu style={{ width: 230, height: '100%' }} mode="inline" theme="dark" onClick={this.handleOnclick}>
          <Menu.Item key="/tr">首页</Menu.Item>
          <Menu.SubMenu key="sub1" title={'基础数据管理'} style={subItemStyle}>
            <Menu.Item key="/course-system">课程体系管理</Menu.Item>
            <Menu.Item key="/test-lesson-knowledge">测评课知识点管理</Menu.Item>
            <Menu.Item key="/knowledge">知识点管理</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="sub2" title="优秀视频管理" modal="inlin" theme="dark">
            <Menu.Item key="/addvideo">添加视频</Menu.Item>
            <Menu.Item key="/videomanage">管理视频</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </BodyWrapper>
    );
  }
}

LeftNav.propTypes = {
  children: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  LeftNav: makeSelectLeftNav(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
