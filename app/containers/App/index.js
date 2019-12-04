/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import styled from 'styled-components';
import 'antd/dist/antd.css';
import { browserHistory, Link } from 'react-router';
import { Layout, Breadcrumb, Icon } from 'antd';

import { FlexColumn, FlexRow } from 'components/FlexBox';
import Header from 'containers/Header/index';
import AppLocalStorage from 'utils/localStorage';
import ZmModal from 'components/ZmModal';
import LeftNavC from 'containers/LeftNavC';
import routes from 'containers/LeftNavC/routeMap';
import withProgressBar from 'components/ProgressBar';
import { changeTypeTemplateMapper } from 'utils/templateMapper';


const AppWrapper = styled(FlexColumn)`
  width: 100%;
  height: 100%;
`;

const AppBody = styled(FlexRow)`
  flex: 1;
  padding: 0 20px 15px 20px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;
const RightContent = styled(FlexColumn)`
  min-height: 100%;
  max-height: 100%;
  // border: 1px solid #dddddd;
  flex-grow: 1;
  //overflow:hidden;
  width: 100%;
  position: relative;
  z-index: 2;
  border-radius: 8px;
  & > div {
    flex: 1;
  }
`;
// let stateChangeCount = 0;

class App extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: React.PropTypes.node
  };
  componentWillMount() {
    // console.log(AppLocalStorage.getIsLogin(), 'userIsLogin');
    try {
      localStorage.setItem('tr-version', 'v1.8.1-20190815');
    } catch (e) {
      console.log(e);
    }
  }
  componentDidMount() {
    changeTypeTemplateMapper();
    // console.log('不要在App中添加任何动态改变的状态\n' + `App渲染了：${++stateChangeCount} 次。`, '\n--- from containers/App/index');
  }
  isLoadHeaderAndLeft() {
    const pathname = browserHistory.getCurrentLocation().pathname;
    const paths = [
      '/tr/homeworkinfo',
      '/tr/homeworkmark',
      '/iframe/question-picker',
      '/iframe/searchQuestions',
      '/home'
    ];
    return Array.indexOf(paths, pathname) === -1;
  }
  toHome = () => {
    sessionStorage.setItem('menuKeys', JSON.stringify(['/home']));
  };
  subRnder = (e, sub) => {
    if (e.name) {
      if (e.sub) {
        sub.push(
          <Breadcrumb.Item key={e.key}>
            <Link to={e.key}>{e.name}</Link>
          </Breadcrumb.Item>
        );
        this.subRnder(e.sub, sub);
      } else {
        sub.push(<Breadcrumb.Item key={e.key}>{e.name}</Breadcrumb.Item>);
      }
    }
  };
  render() {
    let sub = [];
    let route = {};
    const pathname = browserHistory.getCurrentLocation().pathname;
    const search = browserHistory.getCurrentLocation().search;
    if (pathname !== '/home') {
      // 主页不在映射范围内
      const type = window.currentBU;
      if (type && routes[type]) {
        route = routes[type].getRouteByPath(pathname, search);
      }
      if (route.sub) {
        this.subRnder(route.sub, sub);
      }
    }
    return (
      <AppWrapper>
        <ZmModal />
        {AppLocalStorage.getIsLogin() ? (
          <Layout style={{ flexDirection: 'row', overflow: 'auto' }}>
            {this.isLoadHeaderAndLeft() ? <LeftNavC /> : ''}
            <Layout style={{ flexDirection: 'column', overflow: 'hidden' }}>
              {this.isLoadHeaderAndLeft() ? (
                <FlexRow>
                  <Header />
                </FlexRow>
              ) : (
                ''
              )}
              {this.isLoadHeaderAndLeft() ? (
                <Breadcrumb style={{ margin: '10px 20px' }}>
                  <Breadcrumb.Item href="/home" onClick={this.toHome}>
                    <Icon type="home" />
                  </Breadcrumb.Item>
                  {route.name ? (
                    <Breadcrumb.Item key={route.key}>
                      {route.name}
                    </Breadcrumb.Item>
                  ) : null}
                  {sub.map(e => e)}
                </Breadcrumb>
              ) : null}
              <AppBody
                style={
                  (location.pathname.indexOf('iframe') > -1 || location.pathname.indexOf('/home') > -1) ? { padding: 0 } : {}
                }
                className="app-body"
              >
                <RightContent className="App">
                  {React.Children.toArray(this.props.children)}
                </RightContent>
              </AppBody>
            </Layout>
          </Layout>
        ) : (
          React.Children.toArray(this.props.children)
        )}
      </AppWrapper>
    );
  }
}

export default withProgressBar(App);
