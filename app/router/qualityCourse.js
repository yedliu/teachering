const headerAndLeftNav = ['appHeader', 'LeftContainer'];

const routes = (option = {}) => {
  const routes = [
    {
      name: 'qualityCourse',
      path: '/tr/qualityCourse',
      component: () => import('containers/HomePage/SubHomePage'),
      prevModules: [...headerAndLeftNav]
    },
    {
      // 优课作业管理
      name: 'largeClassHomeWork',
      path: '/tr/largeClassHomeWork',
      reducer: () => import('containers/LargeClassHomeWork/reducer'),
      sagas: () => import('containers/LargeClassHomeWork/sagas'),
      component: () => import('containers/LargeClassHomeWork'),
      permission: ['lecutre_clazz_standard_homework_management'],
      prevModules: [...headerAndLeftNav]
    }
  ];
  return routes.map(el => ({ ...el, ...option }));
};

export default routes({ type: 'QualityCourse' });
