const headerAndLeftNav = ['appHeader', 'LeftContainer'];

const routes = (option = {}) => {
  const routes = [
    {
      name: 'tr',
      path: '/tr/1v1',
      component: () => import('containers/HomePage/SubHomePage'),
      prevModules: [...headerAndLeftNav]
    },
    {
      // 课程版本管理
      name: 'edition',
      path: '/tr/edition',
      reducer: () => import('containers/Edition/reducer'),
      sagas: () => import('containers/Edition/sagas'),
      component: () => import('containers/Edition'),
      permission: ['edition_data_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 教材版本管理
      name: 'textbookEdition',
      path: '/tr/textbook-edition',
      reducer: () => import('containers/TextbookEdition/reducer'),
      sagas: () => import('containers/TextbookEdition/sagas'),
      component: () => import('containers/TextbookEdition'),
      permission: ['textbook_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 正式课体系管理
      name: 'courseSystem',
      path: '/tr/course-system',
      reducer: () => import('containers/CourseSystem/reducer'),
      sagas: () => import('containers/CourseSystem/sagas'),
      component: () => import('containers/CourseSystem'),
      permission: ['course_system_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 测评课体系管理
      name: 'testLessonKnowledge',
      path: '/tr/test-lesson-knowledge',
      reducer: () => import('containers/TestLessonKnowledge/reducer'),
      sagas: () => import('containers/TestLessonKnowledge/sagas'),
      component: () => import('containers/TestLessonKnowledge'),
      permission: ['test_lesson_knowledge_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 测评课推荐内容配置
      name: 'oneToOneTestReportService',
      path: '/tr/oneToOneTestReportService',
      component: () => import('containers/OneToOneTestReportService'),
      permission: ['test_lesson_recommend_content'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 自组试卷管理
      name: 'paperManagement',
      path: '/tr/papermanagement',
      reducer: () => import('containers/PaperManagement/reducer'),
      sagas: () => import('containers/PaperManagement/sagas'),
      component: () => import('containers/PaperManagement'),
      permission: ['exam_paper_data_management'],
      prevModules: [...headerAndLeftNav, 'paperAnalysis']
    },
    {
      // 考情分析
      name: 'examSituationAnalysis',
      path: '/tr/examSituationAnalysis',
      component: () => import('containers/ExamSituationAnalysis'),
      permission: ['exam_situation_analysis'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 正式课作业管理
      name: 'standHomeWork',
      path: '/tr/standhomework',
      reducer: () => import('containers/StandHomeWork/reducer'),
      sagas: () => import('containers/StandHomeWork/sagas'),
      component: () => import('containers/StandHomeWork'),
      permission: ['test_lesson_homework_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 测评课作业管理
      name: 'testHomeWork',
      path: '/tr/testhomework',
      reducer: () => import('containers/TestHomeWork/reducer'),
      sagas: () => import('containers/TestHomeWork/sagas'),
      component: () => import('containers/TestHomeWork'),
      permission: ['test_lesson_homework_management'],
      prevModules: [...headerAndLeftNav]
    },
    // {
    //   // 掌门学堂作业管理 要废弃
    //   name: 'schoolHomeWork',
    //   path: '/tr/schoolhomework',
    //   reducer: () => import('containers/SchoolHomeWork/reducer'),
    //   sagas: () => import('containers/SchoolHomeWork/sagas'),
    //   component: () => import('containers/SchoolHomeWork'),
    //   permission: ['xue_tang_homework'],
    //   prevModules: [...headerAndLeftNav]
    // },
    {
      // 添加视频
      name: 'addVideoWrapper',
      path: '/tr/addvideo',
      reducer: () => import('containers/AddVideoWrapper/reducer'),
      sagas: () => import('containers/AddVideoWrapper/sagas'),
      component: () => import('containers/AddVideoWrapper'),
      permission: ['add_vedio'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 管理视频
      name: 'videoManageWrapper',
      path: '/tr/videomanage',
      reducer: () => import('containers/VideoManageWrapper/reducer'),
      sagas: () => import('containers/VideoManageWrapper/sagas'),
      component: () => import('containers/VideoManageWrapper'),
      permission: ['vedio_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 题目打印
      name: 'questionPrint',
      path: '/tr/questionPrint',
      component: () => import('containers/QuestionPrint'),
      permission: ['question_print'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 学习资料体系管理
      name: 'studySystemManagement',
      path: '/tr/study-system-management',
      reducer: () => import('containers/StudySystemManagement/reducer'),
      sagas: () => import('containers/StudySystemManagement/sagas'),
      component: () => import('containers/StudySystemManagement'),
      permission: ['training_material_managerment'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 已入库题目管理
      name: 'questionManagement',
      path: '/tr/questionfor1v1',
      reducer: () => import('containers/QuestionManagement/reducer'),
      sagas: () => import('containers/QuestionManagement/sagas'),
      component: () => import('containers/QuestionManagement'),
      permission: ['question_data_management'],
      prevModules: [...headerAndLeftNav, 'paperAnalysis']
    },
    {
      // 试卷纠错管理
      name: 'errorCorrectManagement',
      path: '/tr/1v1/errorcorrectmanagement',
      reducer: () => import('containers/ErrorCorrectManagement/reducer'),
      sagas: () => import('containers/ErrorCorrectManagement/sagas'),
      component: () => import('containers/ErrorCorrectManagement'),
      permission: ['question_corretion'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 微课管理
      name: 'micro-lessons',
      path: '/tr/micro-lessons',
      component: () => import('containers/MicroLessons'),
      permission: [],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 微课管理/内容
      name: 'micro-lessons',
      path: '/tr/micro-lessons/content',
      component: () => import('containers/MicroLessons/Content'),
      permission: [],
      prevModules: [...headerAndLeftNav]
    },
  ];
  return routes.map(el => ({ ...el, ...option }));
};

export default routes({ type: 'tr' });
