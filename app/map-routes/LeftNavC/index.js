// 外部引用
import React, { PropTypes } from 'react';
import { Menu, Icon, Layout } from 'antd';
import AppLocalStorage from 'utils/localStorage';
import styled, { keyframes } from 'styled-components';
import immutable, { fromJS } from 'immutable';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
// 内部绝对引用
import { browserHistory } from 'react-router';
// import { setPageState } from 'containers/QuestionManagement/actions';
import { FlexCenter } from 'components/FlexBox';
import Alert from 'components/Alert';
import LoadingIndicator from 'components/LoadingIndicator';
// 相对引用
import routes from './routeMap';
import {
  getLessonTypeAction,
  getGradeAction,
  getSubjectAction,
  changeAlertShowOrHideAction,
  setAlertStatesAction,
  changeBackPromptAlertShowAction,
} from './actions';
import makeSelectLeftNavC, {
  makeAlertShowOrHide,
  makeAlertStates,
  makeBackPromptAlertShow,
  makebackAlertStates,
} from './selectors';
import logo from './images/logo.png';
// 变量
const { Sider } = Layout;

const ChildWrapper = styled.div`
  font-size: 14px;
  & > p {
    line-height: 2em !important;
  }
`;
const LeftLogo = styled(FlexCenter)`
  height: 54px;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  background: white;
  flex-direction: row-reverse;
`;
const show = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
const AlignMiddleText = styled.span`
  display: inline-block;
  font-size: 16px;
  vertical-align: middle;
  color: #333;
  animation: ${show} 1s;
`;
const IconDiv = styled.div`
  font-size: 15px;
  cursor: pointer;
  transition: color 0.3s;
  background: white;
`;
export class LeftNavC extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleOnclick = this.handleOnclick.bind(this);
    this.setActiveMenu = this.setActiveMenu.bind(this);
    this.state = {
      collapsedSelectedKeys: [],
      routesOnline: routes,
    };
  }

  componentDidMount() {
    // this.getMenuConfig();
    this.props.dispatch(getSubjectAction());
    this.props.dispatch(getGradeAction());
    this.props.dispatch(getLessonTypeAction());
    this.setActiveMenu();
  }
  setActiveMenu() {
    const width = document.body.clientWidth;
    this.rootSubmenuKeys = [];
    Object.keys(routes).forEach(key => {
      this.rootSubmenuKeys.concat(routes[key].map(e => e.key));
    });
    if (width < 1200) {
      this.toggle();
    }
    // 监听路由变化
    // 第一次渲染也要执行一次
    this.setPathAndOpenKey();
    browserHistory.listen(e => {
      this.setPathAndOpenKey();
    });
  }
  // 设置展开的一级和二级菜单
  setPathAndOpenKey = () => {
    const { pathname, search } = window.location;
    const route = this.getRouter().getRouteByPath(pathname);
    this.setState({
      openKeys: route.key ? [route.key] : [],
      selectedKeys: pathname ? [`${pathname}${search ? search : ''}`] : [],
    });
  };
  getRouter = () => {
    return routes['menuList'];
  };
  handleOnclick = v => {
    if (/^\/courseWare|^\/tr/.test(v.key)) {
      return;
    }
    // sessionStorage.setItem('menuKeys', JSON.stringify(v.keyPath)); // 勿删 课件会用到
    // 匹配zml编辑器相关路由跳转 路径以 /h5/ 开始作为判断标示，新路由跳至 /zmlEditor/
    // if (window.openMapRoutesH5) {
    //   const H5Route = v.key.indexOf('/h5/') === 0;
    //   const H5Path = location.pathname.indexOf('/zmlEditor/') === 0;
    //   // 新项目，匹配路由切换到新路由
    //   if (H5Path && H5Route) {
    //     browserHistory.push(v.key.replace('/h5/', '/zmlEditor/'));
    //     return;
    //   }
    //   // 老项目，匹配路由跳转新项目
    //   if (!H5Path && H5Route) {
    //     location.href = v.key.replace('/h5/', '/zmlEditor/');
    //     return;
    //   }
    //   // 新项目，不匹配路由跳回老项目
    //   if (H5Path && !H5Route) {
    //     location.href = v.key;
    //     return;
    //   }
    // }
    // // 匹配zml编辑器相关路由跳转结束
    // if (v.key === '/parttime/questionmanagement') {
    //   this.props.dispatch(setPageState('isGroup', false));
    // }
    browserHistory.push(v.key);
  };

  renderMenuSub = sub => {
    if (this.judegePermission(sub.permission) && !sub.notShowOnNav) {
      return (
        <Menu.Item key={sub.key} style={{ background: '#3e4753' }}>
          {sub.name}
        </Menu.Item>
      );
    } else {
      return null;
    }
  };

  judegePermission = e => {
    const permissions = AppLocalStorage.getPermissions();

    if (!e) {
      return true;
    } else if (typeof e === 'string') {
      return permissions.indexOf(e) > -1;
    } else {
      return e.some(it => permissions.indexOf(it) > -1);
    }
  };

  renderCatalog = route => {
    if (!route.sub) {
      return null;
    }
    const allSubPermissions = route.sub.map(s => s.permission);
    const hasOne = allSubPermissions.some(it => this.judegePermission(it));
    return hasOne ? (
      <Menu.SubMenu
        key={route.key}
        title={
          <span>
            <Icon type={route.icon} />
            <span>{route.name}</span>
          </span>
        }
      >
        {route.sub.map(this.renderMenuSub)}
      </Menu.SubMenu>
    ) : null;
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1,
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  render() {
    // const { routesOnline } = this.state;
    // const path = location.pathname;
    let renderRoutes = routes['menuList'];
    // if (path.indexOf('childBU') > -1) {
    //   renderRoutes = routesOnline['childBU'];
    // } else {
    //   renderRoutes = routesOnline['tr'];
    // }
    // console.log(renderRoutes, 'renderRoutes');
    const { openKeys, selectedKeys, collapsed } = this.state;
    const menuConfig = {
      style: {
        flex: 1,
        background: '#3e4753',
      },
      mode: 'inline',
      theme: 'dark',
      onOpenChange: this.onOpenChange,
      selectedKeys,
      onClick: this.handleOnclick,
      inlineCollapsed: collapsed,
    };
    if (!collapsed) {
      menuConfig.openKeys = openKeys; // 缩小状态不用打开父级菜单
    }
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={
          collapsed
            ? {
              background: 'rgb(62, 71, 83)',
              height: '100vh',
            }
            : {
              background: 'rgb(62, 71, 83)',
              overflowY: 'auto',
              height: '100vh',
            }
        }
      >
        <LeftLogo
          style={
            collapsed
              ? { background: 'inherit' }
              : { position: 'fixed', top: 0, zIndex: 2, width: 200 }
          }
        >
          <IconDiv onClick={this.toggle} style={{ background: 'inherit' }}>
            <Icon
              style={
                collapsed ? { background: 'inherit', color: 'white' } : null
              }
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
            />
          </IconDiv>
          {collapsed ? '' : <AlignMiddleText>资源管理后台</AlignMiddleText>}
          {collapsed ? '' : <img src={logo} alt="掌门1对1" />}
        </LeftLogo>
        <div style={collapsed ? { display: 'none' } : { height: 54 }} />
        <Menu {...menuConfig}>
          <Menu.Item key="/parttime/home">
            <Icon type="home" />
            <span>首页</span>
          </Menu.Item>
          {renderRoutes.map(this.renderCatalog)}
        </Menu>
        <Alert
          properties={Object.assign(
            {},
            {
              // buttonsType: '1',
              // imgType: 'success',
              title: '数据获取中...',
              isOpen: this.props.alertShowOrHide,
              titleStyle: {
                textAlign: 'center',
                fontSize: '16px',
                color: '#333',
                fontWeight: 600,
              },
              child: ['知道了'],
              oneClick: () => {
                this.props.dispatch(changeAlertShowOrHideAction(false));
                this.props.dispatch(setAlertStatesAction(fromJS({})));
              },
            },
            this.props.alertStates.toJS(),
          )}
        >
          {this.props.alertStates.get('warningMsg') ? (
            <FlexCenter>
              <div>{this.props.alertStates.get('warningMsg')}</div>
            </FlexCenter>
          ) : (
            LoadingIndicator()
          )}
        </Alert>
        <Alert
          properties={Object.assign(
            {},
            {
              buttonsType: '2-21',
              isOpen: this.props.backPromptAlertShow,
              title: '系统提示',
              titleStyle: { fontSize: '20px', fontWeight: 600, color: '#333' },
              leftClick: () => {
                this.props.dispatch(changeBackPromptAlertShowAction(false));
              },
              rightClick: () => {
                this.props.dispatch(changeBackPromptAlertShowAction(false));
              },
              oneClick: () => {
                this.props.dispatch(changeBackPromptAlertShowAction(false));
              },
              child: ['取消', '确认'],
              buttonsIndent: 30,
            },
            this.props.backAlertStates.toJS(),
          )}
        >
          {this.props.backAlertStates.get('setChildren') ? (
            this.props.backAlertStates.get('setChildren')()
          ) : (
            <ChildWrapper>
              <p>是否确定退出？</p>
              <p>退出后将无法保存当前审核记录！</p>
            </ChildWrapper>
          )}
        </Alert>
      </Sider>
    );
  }
}

LeftNavC.propTypes = {
  dispatch: PropTypes.func.isRequired,
  alertShowOrHide: PropTypes.bool.isRequired, // 弹框显示或隐藏
  alertStates: PropTypes.instanceOf(immutable.Map).isRequired, // 弹框信息
  backPromptAlertShow: PropTypes.bool.isRequired, // 返回时提示弹框状态
  backAlertStates: PropTypes.instanceOf(immutable.Map).isRequired, // 返回时弹框信息
};

const mapStateToProps = createStructuredSelector({
  LeftNavC: makeSelectLeftNavC(),
  alertShowOrHide: makeAlertShowOrHide(),
  alertStates: makeAlertStates(),
  backPromptAlertShow: makeBackPromptAlertShow(),
  backAlertStates: makebackAlertStates(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeftNavC);
