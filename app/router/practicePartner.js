const headerAndLeftNav = ['appHeader', 'LeftContainer'];

const routes = (option = {}) => {
  const routes = [
    {
      name: 'practicePartner',
      path: '/tr/practicePartner',
      component: () => import('containers/HomePage/SubHomePage'),
      prevModules: [...headerAndLeftNav]
    },
  ];
  return routes.map(el => ({ ...el, ...option }));
};

export default routes({ type: 'PracticePartner' });
