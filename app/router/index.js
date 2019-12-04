import { importModulesFactory, renderRouteFactory, checkModuleBu } from './utils';
import commonRoutes from './commonRoutes';
import trRoutes from './1v1BU';
import childBURoutes from './childBU';
import basicDataRoutes from './basicData';
import dashboardRoutes from './dashboard';
import qualityCourseRoutes from './qualityCourse';
import practicePartnerRoutes from './practicePartner';
import userPermissionRoutes from './userPermission';
import localTR from './localTR';
import InterviewCsware from './InterviewCsware';
export default function createRoutes(store) {
  const importModules = importModulesFactory(store);
  const appHeader = importModules({
    reducerPath: () => import('containers/Header/reducer'),
    sagasPath: () => import('containers/Header/sagas'),
    reducerName: 'header'
  });

  const LeftContainer = importModules({
    reducerPath: () => import('containers/LeftNavC/reducer'),
    sagasPath: () => import('containers/LeftNavC/sagas'),
    reducerName: 'leftNavC'
  });

  const paperShowPage = importModules({
    reducerPath: () => import('containers/PaperShowPage/reducer'),
    sagasPath: () => import('containers/PaperShowPage/sagas'),
    reducerName: 'paperShowPage'
  });

  const paperAnalysis = importModules({
    reducerPath: () => import('containers/PaperAnalysis/reducer'),
    sagasPath: () => import('containers/PaperAnalysis/sagas'),
    reducerName: 'paperAnalysis'
  });

  // 每个路由模块需要加载的模块要和这个对象中的名字对应
  const modules = {
    appHeader,
    LeftContainer,
    paperShowPage,
    paperAnalysis
  };

  const renderRoute = renderRouteFactory(store, modules);
  // 通用的路由不需要检测权限和 bu
  const common = commonRoutes.map(el => renderRoute({ ...el }));
  const routes = [
    ...trRoutes,
    ...childBURoutes,
    ...basicDataRoutes,
    ...dashboardRoutes,
    ...qualityCourseRoutes,
    ...practicePartnerRoutes,
    ...userPermissionRoutes,
    ...localTR,
    ...InterviewCsware
  ].map(el =>
    renderRoute({
      ...el,
      onEnter() {
        if (typeof el.onEnter === 'function') onEnter();
        checkModuleBu(el.type); // 给当前的页面设置 BU
      }
    })
  );

  return [
    ...common,
    ...routes,
    renderRoute({
      path: '*',
      name: 'notfound',
      component: () => import('containers/NotFoundPage'),
      prevModules: ['appHeader', 'LeftContainer']
    })
  ];
}
