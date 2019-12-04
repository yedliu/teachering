/**
 * 增加路由请都在这里添加，会影响左边菜单，面包屑显示
 * 如果不需要在左边菜单显示 请设置notShowOnNav为true（为了面包屑正常显示，请添加）
 * notShowOnNav 是否在左边菜单显示
 */
// 从git submodule中取routes数据
import routes from '../menu/menu.json';
const routesObj = JSON.parse(JSON.stringify(routes));

// 迭代找路由
const find = (parent, route, path, go) => {
  route.sub &&
    route.sub.some(e => {
      if (e.key.indexOf(path) > -1) {
        parent.sub = Object.assign({}, e);
        parent.sub.sub = null;
        go.find = true;
      }
      if (!go.find) {
        parent.sub = {};
        find(parent.sub, e, path, go);
      }
      return go.find;
    });
  if (go.find) {
    parent.name = route.name;
    parent.key = route.key;
  }
  return go.find;
};

// 根据path找相应路由配置
const getRouteByPath = routes => {
  return (path, search = '') => {
    const parent = {};
    const go = {
      find: false,
    };
    routes.some(e => find(parent, e, path, go));
    return parent;
  };
};
// console.log('routesObj: ', routesObj);
Object.keys(routesObj).forEach(key => {
  let route = routesObj[key];
  routesObj[key].getRouteByPath = getRouteByPath(route);
});
// console.log(routesObj, '33');
export default routesObj;
