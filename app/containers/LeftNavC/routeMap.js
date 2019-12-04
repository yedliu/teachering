/**
 * 增加路由请都在这里添加，会影响左边菜单，面包屑显示
 * 如果不需要在左边菜单显示 请设置notShowOnNav为true（为了面包屑正常显示，请添加）
 * notShowOnNav 是否在左边菜单显示
 */
// 从git submodule中取routes数据
import routes from '../../lib/menu/menu.json';
import { trModules } from 'lib/menu/contants';
const routesObj = JSON.parse(JSON.stringify(routes));

// 递归找路由
const findRoute = (routes, path) => {
  const parent = {};
  const isFind = find(routes, path, parent);
  return isFind ? parent : {};

  function find(routes, path, parent) {
    if (!routes) return false; // 终止递归 或者 进行下一个循环
    return routes.some(route => {
      parent.name = route.name;
      parent.key = route.key;
      parent.sub = {};
      if (route.key.indexOf(path) > -1) return true; // 终止递归和循环
      return find(route.sub, path, parent.sub);
    });
  }
};

// 根据path找相应路由配置
export const getRouteByPath = routes => {
  return (path, search = '') => {
    if (path === '/home') {
      return {};
    }
    // 二级首页
    const route = trModules.find(el => el.to === path);
    if (route) return { name: route.title, key: route.key };
    return findRoute(routes, path);
  };
};
Object.keys(routesObj).forEach(key => {
  let route = routesObj[key];
  routesObj[key].getRouteByPath = getRouteByPath(route);
});

export default routesObj;
