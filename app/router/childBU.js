const headerAndLeftNav = ['appHeader', 'LeftContainer'];

const routes = (option = {}) => {
  const routes = [
    {
      name: 'childBU',
      path: '/tr/childBU',
      component: () => import('containers/HomePage/SubHomePage'),
      prevModules: [...headerAndLeftNav]
    },
    {
      // 正式课体系管理
      name: 'formalCourseSystemManagement',
      path: '/tr/childBU/formalCourseSystemManagement',
      component: () => import('containers/ChildBU/FormalCourse/FormalCourseSystemManagement'),
      permission: ['zm_child_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 正式课课程管理
      name: 'formalCourseManagement',
      path: '/tr/childBU/formalCourseManagement',
      component: () => import('containers/ChildBU/FormalCourse/FormalCourseManagement'),
      permission: ['zm_child_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 测评课课程管理
      name: 'evaluationCourseManagement',
      path: '/tr/childBU/evaluationCourseManagement',
      component: () => import('containers/ChildBU/FormalCourse/EvaluationCourseManagement'),
      permission: ['zm_child_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 少儿题目打印
      name: 'childBUQuestionPrint',
      path: '/tr/childBU/questionPrint',
      component: () => import('containers/QuestionPrint'),
      permission: ['zm_child_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 标准作业管理
      name: 'standardHomework',
      path: '/tr/childBU/homework-standard',
      reducer: () => import('containers/StandHomeWork/reducer'),
      sagas: () => import('containers/StandHomeWork/sagas'),
      component: () => import('containers/StandHomeWork'),
      reducerName: 'standHomeWork',
      permission: ['zm_child_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 测评课作业管理
      name: 'testHomework',
      path: '/tr/childBU/test-homework',
      reducer: () => import('containers/StandHomeWork/reducer'),
      sagas: () => import('containers/StandHomeWork/sagas'),
      component: () => import('containers/ChildBU/TestHomework'),
      reducerName: 'standHomeWork',
      permission: ['zm_child_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 测评课作业题目打印
      name: 'childBUQuestionPrint',
      path: '/tr/childBU/testQuestionPrint',
      component: () => import('containers/QuestionPrint'),
      permission: ['zm_child_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 少儿试卷管理
      name: 'childPaperManagement',
      path: '/tr/childBU/child-paper',
      reducer: () => import('containers/ChildBU/ChildPaperManagement/redux/reducer'),
      sagas: () => import('containers/ChildBU/ChildPaperManagement/redux/sagas'),
      component: () => import('containers/ChildBU/ChildPaperManagement'),
      permission: ['zm_child_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 录播课程视频管理
      name: 'videoCourseManagement',
      path: '/tr/childBU/videoSourceManagement',
      component: () => import('containers/ChildBU/VideoResourceManagement/VideoCourseManagement'),
      prevModules: [...headerAndLeftNav],
      permission: ['zm_child_course_system_audio'],
    }
  ];
  return routes.map(el => ({ ...el, ...option }));
};

export default routes({ type: 'childBU' });
