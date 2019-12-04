import AppLocalStorage from 'utils/localStorage';
import { browserHistory } from 'react-router';
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { message } from 'antd';
import { trModules } from '../lib/menu/contants';

import trRoutes from './1v1BU';
import childBURoutes from './childBU';
import basicDataRoutes from './basicData';
import dashboardRoutes from './dashboard';
import qualityCourseRoutes from './qualityCourse';
import practicePartnerRoutes from './practicePartner';
import userPermissionRoutes from './userPermission';
import localTR from './localTR';
import interviewCsware from './InterviewCsware';

/**
 * @description 检查 BU 是否正确
 */
export const checkModuleBu = (routeType) => {
  const type = window.currentBU;
  // bu 类型发生变化，重新设置到 localStorage 中
  if (routeType !== type) window.currentBU = routeType;
  // 检查 当前的 type 是否在 拆分的 bu 中，检测失败跳转到首页
  if (!trModules.find(el => el.key === routeType)) {
    location.href = '/home'; // 使用 react-router 跳转顶部的进度条有问题
  }
};

export const checkMenuJson = (menus = {}) => {
  if (process.env.ENV_TYPE === 'prod') return;
  console.time('检查 menu.json');
  const tr = trRoutes.map(route => route.path);
  const childBU = childBURoutes.map(route => route.path);
  const BasicData = basicDataRoutes.map(route => route.path);
  const Dashboard = dashboardRoutes.map(route => route.path);
  const QualityCourse = qualityCourseRoutes.map(route => route.path);
  const PracticePartner = practicePartnerRoutes.map(route => route.path);
  const UserPermission = userPermissionRoutes.map(route => route.path);
  const LocalTR = localTR.map(route => route.path);
  const InterviewCsware = interviewCsware.map(route => route.path);

  const routers = { tr, childBU, BasicData, Dashboard, QualityCourse, PracticePartner, UserPermission, LocalTR, InterviewCsware };

  const menuKeys = Object.keys(menus);
  try {
    for (let key of menuKeys) {
      const keys = getAllMenuTrKeys(menus[key]);
      checkMenuItem(routers[key], keys);
    }
  } catch (error) {
    console.error(error);
  }
  console.timeEnd('检查 menu.json');
};

const getAllMenuTrKeys = (menus) => {
  const keys = [];
  getTrKeys(menus);
  return keys;

  function getTrKeys(menus) {
    if (!Array.isArray(menus)) return;
    menus.forEach(menu => {
      if (menu.type === 'tr') {
        keys.push(menu.key);
      }
      getTrKeys(menu.sub);
    });
  }
};

const checkMenuItem = (router, menus) => {
  menus.forEach(menu => {
    if (!router.includes(menu)) {
      console.error(`请检查路径 ${menu} 在 menu.json 中所处的 BU 是否与路由中的一致`);
    }
  });
};

export const errorLoading = err => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

export const loadModule = cb => componentModule => {
  cb(null, componentModule.default);
};

// 不需要检查是否登录的路径写在这里
const noCheckLoginPathList = ['/'];

/**
 * @description 检查用户是否登录 如果没有登录直接返回登录页
 * @param {string} path 当前路径
 * @return {void}
 */
export const checkUserLogin = (path) => {
  if (noCheckLoginPathList.indexOf(path) > -1) return;
  if (!AppLocalStorage.getIsLogin()) {
    browserHistory.replace('/');
  }
};
/**
 * @description 检查权限
 * @param {array} e 用户权限
 * @param {bool} all 检查权限的范围
 * @return {void}
 */
export const checkAuthority = (e, all) => {
  const permissions = AppLocalStorage.getPermissions();
  let bool;
  if (all) {
    bool = e.every(it => permissions.indexOf(it) > -1);
  } else {
    bool = e.some(it => permissions.indexOf(it) > -1);
  }
  if (!bool) {
    // 没有权限跳到首页
    message.error('您没有权限访问该页面', 4);
    browserHistory.replace('/home');
  }
};

/**
 * @description 动态加载 reducer 和 sagas
 * @param {*} store reudx 的 store
 * @return {function} 加载 reducer sagas
 */
export const importModulesFactory = store => {
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  return ({ reducerPath = () => {}, sagasPath = () => {}, componentPath = () => {}, reducerName, cb }) => () => {
    const importModules = Promise.all([reducerPath(), sagasPath(), componentPath()]);
    const renderRoute = cb ? loadModule(cb) : null;
    importModules.then(([reducer, sagas, component]) => {
      reducer && injectReducer(reducerName, reducer.default);
      sagas && injectSagas(sagas.default);
      component && renderRoute && renderRoute(component);
    });
    importModules.catch(errorLoading);

    return importModules;
  };
};

/**
 * @description 链式执行 Promise
 * @param  {...Promise} rest
 */
export const promiseSequence = (...rest) =>
  rest.reduce((promise, task) => promise.then(task), Promise.resolve());

/**
 * @description 渲染路由
 * @param {*} store redux store
 * @param {*} modules 加载路由之前需要执行的模块
 * @return {*} 路由配置项
 */
export const renderRouteFactory = (store, modules) => {
  const importModules = importModulesFactory(store);
  return ({
    path,
    name,
    reducer,
    sagas,
    component,
    reducerName,
    permission = [],
    prevModules = [],
    onEnter
  }) => {
    const _prevModules = prevModules.map(key => (modules[key] || Promise.resolve()));
    return {
      path,
      name,
      onEnter(nextState, replaceState) {
        checkUserLogin(path);
        if (Array.isArray(permission) && permission.length > 0) {
          checkAuthority([...permission], true, replaceState);
        }
        if (typeof onEnter === 'function') onEnter();
      },
      getComponent(nextState, cb) {
        const currentPromise = importModules({
          reducerPath: reducer,
          sagasPath: sagas,
          componentPath: component,
          reducerName: reducerName || name,
          cb,
          path
        });
        promiseSequence(..._prevModules, currentPromise);
      }
    };
  };
};
