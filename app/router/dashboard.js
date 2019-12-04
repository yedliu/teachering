const headerAndLeftNav = ['appHeader', 'LeftContainer'];

const routes = (option = {}) => {
  const routes = [
    {
      name: 'dashboard',
      path: '/tr/dashboard',
      component: () => import('containers/HomePage/SubHomePage'),
      prevModules: [...headerAndLeftNav]
    },
    {
      // 作业汇总情况
      name: 'homeworkSummary',
      path: '/tr/data/homeworkSummary',
      reducer: () => import('containers/HomeWorkSummary/reducer'),
      sagas: () => import('containers/HomeWorkSummary/sagas'),
      component: () => import('containers/HomeWorkSummary'),
      reducerName: 'homeWorkSummary',
      permission: ['data_board'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 测评时间使用情况
      name: 'testPaper',
      path: '/tr/data/testPaper',
      reducer: () => import('containers/TestPaper/reducer'),
      sagas: () => import('containers/TestPaper/sagas'),
      component: () => import('containers/TestPaper'),
      permission: ['data_board'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 题库数据
      name: 'questionLibraryData',
      path: '/tr/data/questionLibraryData',
      reducer: () => import('containers/QuestionLibraryData/reducer'),
      sagas: () => import('containers/QuestionLibraryData/sagas'),
      component: () => import('containers/QuestionLibraryData'),
      permission: ['data_board'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 纠错管理
      name: 'errorCorrectionData',
      path: '/tr/errorCorrectionBoard',
      component: () => import('containers/DataBoard/ErrorCorrectBoard'),
      permission: ['data_board'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // AI测评反馈
      name: 'evaluationFeedback',
      path: '/tr/evaluationFeedback',
      component: () => import('containers/DataBoard/EvaluationFeedback'),
      permission: ['data_board'],
      prevModules: [...headerAndLeftNav]
    }
  ];
  return routes.map(el => ({ ...el, ...option }));
};

export default routes({ type: 'Dashboard' });
