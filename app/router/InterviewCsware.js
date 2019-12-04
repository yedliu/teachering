const headerAndLeftNav = ['appHeader', 'LeftContainer'];
const routes = (option = {}) => {
  const routes =  [
    {
      path: '/courseWare/InterviewCsware',
      name: 'InterviewCsware',
      moduleBu: 'InterviewCsware',
      component: () => import('containers/HomePage/SubHomePage'),
      prevModules: [...headerAndLeftNav]
    },
    {
      // 课程体系管理
      name: 'TCCourseManagement',
      path: '/tr/TCCourseManagement',
      component: () => import('containers/TeacherCertification/TCCourseManagement'),
      permission: ['teacher-certification-course-page'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 试卷管理
      name: 'TCPaperManagement',
      path: '/tr/TCPaperManagement',
      component: () => import('containers/TeacherCertification/TCPaperManagement'),
      permission: ['teacher-certification-paper-page'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 题目管理
      name: 'TCQuestionManagement',
      path: '/tr/TCQuestionManagement',
      component: () => import('containers/TeacherCertification/TCQuestionManagement'),
      permission: ['teacher-certification-question-page'],
      prevModules: [...headerAndLeftNav]
    },
  ];
  return routes.map(el => ({ ...el, ...option }));
};
export default routes({ type: 'InterviewCsware' });
