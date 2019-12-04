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
import { FlexCenter } from 'components/FlexBox';
import Alert from 'components/Alert';
import LoadingIndicator from 'components/LoadingIndicator';
// 相对引用
import routes, { getRouteByPath } from './routeMap';
import { checkMenuJson } from '../../router/utils';
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
const logo = window._baseUrl.imgCdn + '4bbc3608-4b35-4b13-a641-0f9856bbdf55.png';
// 变量
// const permissions = AppLocalStorage.getPermissions();
const { Sider } = Layout;

// 缓存侧边栏数据
let cacheRouter = {};

// 覆盖 antd 二级菜单的颜色
const Root = styled.div`
  .ant-menu-dark .ant-menu-inline.ant-menu-sub {
    background: #3e4753 !important;
  }
  .ant-menu-dark, .ant-menu-dark .ant-menu-sub {
    background: #3e4753 !important;
  }
  .ant-menu .ant-menu-item{
    a{
      display: inline-block;
      color: rgba(255, 255, 255, 0.67);
    }
  }
`;

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
      type: '',
      openKeys: [],
      selectedKeys: [],
    };
    this.permissions = AppLocalStorage.getPermissions();
    this.menuKeys = this.getMenuConfigKeys(routes);
    try {
      checkMenuJson(routes); // 检查本地配置的 menu.json
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getMenuConfig();
    this.props.dispatch(getSubjectAction());
    this.props.dispatch(getGradeAction());
    this.props.dispatch(getLessonTypeAction());
    this.setActiveMenu();
  }

  componentWillUnmount() {
    this.unSubscription && this.unSubscription();
  }

  setActiveMenu() {
    const width = document.body.clientWidth;
    this.rootSubmenuKeys = [];
    Object.keys(this.state.routesOnline).forEach(key => {
      this.rootSubmenuKeys.concat(this.state.routesOnline[key].map(e => e.key));
    });
    if (width < 1200) {
      this.toggle();
    }
    // 监听路由变化
    // 第一次渲染也要执行一次
    this.setPathAndOpenKey();
    this.unSubscription = browserHistory.listen(e => {
      this.setPathAndOpenKey();
    });
  }
  // 获取在线实时的menu数据
  getMenuConfig() {
    window.MenuConfig = null;
    this.setState({ routesOnline: routes });
    fetch(`${location.origin}/zm-front-config/menu.json?${Number(new Date())}`)
      .then(res => {
        let contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        }
        throw new Error('本地环境无法获取到在线menu.json');
      })
      .then(res => {
        window.MenuConfig = res;
        cacheRouter = {}; // 清空缓存数据
        try {
          checkMenuJson(res); // 检查线上环境 menu.json 配置
        } catch (error) {
          console.log(error);
        }
        this.menuKeys = this.getMenuConfigKeys(res);
        Object.keys(res).forEach(key => {
          res[key].getRouteByPath = getRouteByPath(res[key]);
        });
        this.setState(
          {
            routesOnline: res
          },
          () => {
            this.setActiveMenu();
          }
        );
      });
  }
  // 设置展开的一级和二级菜单
  setPathAndOpenKey = () => {
    const { pathname, search } = window.location;
    console.log(this.getRouter(), pathname);
    const route = this.getRouter().getRouteByPath(pathname);
    const routeInMenuConfig = this.menuKeys.includes(route.key);
    // 如果当前的 route.key 不在 menuConfig 中，直接 ruturn
    // 主要是解决侧边栏收起来之后二级菜单不显示的问题
    if (!routeInMenuConfig) return;
    if (route.hasOwnProperty('sub')) {
      // 二级导航菜单设置
      this.setState({
        openKeys: (route.key && route.sub.key && routeInMenuConfig) ? [route.key, route.sub.key] : [],
        selectedKeys: pathname ? [`${pathname}${search ? search : ''}`] : [],
      });
    } else {
      this.setState({
        openKeys: (route.key && routeInMenuConfig) ? [route.key] : [],
        selectedKeys: pathname ? [`${pathname}${search ? search : ''}`] : [],
      });
    }
  }

  getRouter = () => {
    const type = window.currentBU;
    const { routesOnline } = this.state;
    const pathname = window.location.pathname;
    if (cacheRouter[pathname]) {
      return cacheRouter[pathname];
    }

    const keys = Object.keys(routesOnline);

    // 优先以 menu.json 中的 bu 为准
    for (let key of keys) {
      const buModule = routesOnline[key];
      const isFind = find(buModule, pathname);
      if (isFind) {
        cacheRouter[pathname] = buModule;
        return buModule;
      }
    }

    return routesOnline[type] || [];
    // 查找路由
    function find(routes, path) {
      if (!routes) return false; // 终止递归 或者 进行下一个循环
      return routes.some(route => {
        if (route.key === path) return true; // 终止递归和循环
        return find(route.sub, path);
      });
    }
  };

  handleOnclick = v => {
    if (/^\/courseWare/.test(v.key)) {
      return;
    }
    sessionStorage.setItem('menuKeys', JSON.stringify(v.keyPath)); // 勿删 课件会用到
    browserHistory.push(v.key);
  };

  renderMenuSub = (sub) => {
    if (!(this.judegePermission(sub.permission) && !sub.notShowOnNav)) {
      return null;
    }
    if (sub.hasOwnProperty('sub') && sub.showSubMenu) {
      // 2层嵌套导航
      return (
        <Menu.SubMenu
          key={sub.key}
          style={{ color: 'red' }}
          title={(
            <span>
              <Icon type={sub.icon} />
              <span>{sub.name}</span>
            </span>
          )}
        >
          {sub.sub.map(this.renderMenuSub)}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item
          key={sub.key}
          style={{ background: '#3e4753' }}
        >
          {sub.icon && <Icon type={sub.icon} />}
          {
            sub.type === 'tr'
              ? <span>{sub.name}</span>
              : <span><a href={`${location.origin}${sub.key}`} rel="noopener noreferrer" title={`${location.origin}${sub.key}`}>{sub.name}</a></span>
          }
        </Menu.Item>
      );
    }
  }

  judegePermission = e => {
    // 变量
    const permissions = this.permissions || [];
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
      return this.renderMenuSub(route);
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
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed
    });
  };

  /**
   * @description 获取 menuConfig 中的所有的 key
   * @param {object} menuConfig 配置菜单的 menuConfig
   * @return {array} 包含所有 key 的数组
   */
  getMenuConfigKeys = (menuConfig) => {
    const keys = [];

    /**
     * @description 递归寻找当前数组中所有的 key 字段
     * @param {array} routes menuConfig 中的一个模块
     * @return {void}
     */
    const findKey = (routes) => {
      if (!routes) return;
      routes.forEach(route => {
        if (route.key) {
          keys.push(route.key);
        }
        findKey(route.sub);
      });
    };
    Object.keys(menuConfig).forEach(key => {
      findKey(menuConfig[key]);
    });
    return keys;
  }

  render() {
    const renderRoutes = this.getRouter();
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
      inlineCollapsed: collapsed
    };
    if (!collapsed) {
      menuConfig.openKeys = openKeys; // 缩小状态不用打开父级菜单
    }
    return (
      <Root>
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
            <Menu.Item key="/home">
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
      </Root>
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
