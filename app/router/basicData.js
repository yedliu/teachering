const headerAndLeftNav = ['appHeader', 'LeftContainer'];

const routes = (option = {}) => {
  const routes = [
    {
      name: 'basicData',
      path: '/tr/basicData',
      component: () => import('containers/HomePage/SubHomePage'),
      prevModules: [...headerAndLeftNav]
    },
    {
      // 知识点管理
      name: 'knowledge',
      path: '/tr/knowledge',
      reducer: () => import('containers/Knowledge/reducer'),
      sagas: () => import('containers/Knowledge/sagas'),
      component: () => import('containers/Knowledge'),
      permission: ['knowledge_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 考点管理
      name: 'examinationPoint',
      path: '/tr/examination-point',
      reducer: () => import('containers/examinationPoint/reducer'),
      sagas: () => import('containers/examinationPoint/sagas'),
      component: () => import('containers/examinationPoint'),
      permission: ['exam_point_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 已入库题目管理
      name: 'questionManagement',
      path: '/tr/questionmanagement',
      reducer: () => import('containers/QuestionManagement/reducer'),
      sagas: () => import('containers/QuestionManagement/sagas'),
      component: () => import('containers/QuestionManagement'),
      permission: ['question_data_management'],
      prevModules: [...headerAndLeftNav, 'paperAnalysis']
    },
    {
      // 题目纠错管理
      name: 'errorCorrectManagement',
      path: '/tr/errorcorrectmanagement',
      reducer: () => import('containers/ErrorCorrectManagement/reducer'),
      sagas: () => import('containers/ErrorCorrectManagement/sagas'),
      component: () => import('containers/ErrorCorrectManagement'),
      permission: ['question_corretion'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 能力管理
      name: 'abilityLabel',
      path: '/tr/abilityLabel',
      component: () => import('containers/AbilityLabel'),
      permission: ['question_data_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 思维体系管理
      name: 'thinkTagManagement',
      path: '/tr/thinkTagManagement',
      component: () => import('containers/ChildBU/ThinkTagManagement'),
      permission: ['think_tag_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      name: 'microCourseVideo',
      path: '/tr/microCourseVideo',
      component: () => import('containers/MicroCourseVideo'),
      permission: [],
      prevModules: [...headerAndLeftNav]
    }
  ];
  return routes.map(el => ({ ...el, ...option }));
};

export default routes({ type: 'BasicData' });
