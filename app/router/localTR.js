const headerAndLeftNav = ['appHeader', 'LeftContainer'];

const routes = (option = {}) => {
  const routes = [
    {
      name: 'localTR',
      path: '/tr/localTR',
      component: () => import('containers/HomePage/SubHomePage'),
      prevModules: [...headerAndLeftNav]
    },
    {
      // 试卷上传和分发
      name: 'addPaper',
      path: '/tr/addPaper',
      reducer: () => import('containers/addPaper/reducer'),
      sagas: () => import('containers/addPaper/sagas'),
      component: () => import('containers/addPaper'),
      permission: ['qb_upload'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 试卷切割
      name: 'getAndCutPaper',
      path: '/tr/getandcutpaper',
      reducer: () => import('containers/GetAndCutPaper/reducer'),
      sagas: () => import('containers/GetAndCutPaper/sagas'),
      component: () => import('containers/GetAndCutPaper'),
      permission: ['qb_cut'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 试卷切割审核
      name: 'paperCutVerify',
      path: '/tr/papercutverify',
      reducer: () => import('containers/PaperCutVerify/reducer'),
      sagas: () => import('containers/PaperCutVerify/sagas'),
      component: () => import('containers/PaperCutVerify'),
      permission: ['qb_cut_audit'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 试卷录入
      name: 'getAndInputPaper',
      path: '/tr/getandinputpaper',
      reducer: () => import('containers/GetAndInputPaper/reducer'),
      sagas: () => import('containers/GetAndInputPaper/sagas'),
      component: () => import('containers/GetAndInputPaper'),
      permission: ['qb_entry'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 试卷录入审核
      name: 'paperInputVerify',
      path: '/tr/paperinputverify',
      reducer: () => import('containers/PaperInputVerify/reducer'),
      sagas: () => import('containers/PaperInputVerify/sagas'),
      component: () => import('containers/PaperInputVerify'),
      permission: ['qb_entry_audit'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 试卷贴标签
      name: 'setTags',
      path: '/tr/settags',
      reducer: () => import('containers/SetTags/reducer'),
      sagas: () => import('containers/SetTags/sagas'),
      component: () => import('containers/SetTags'),
      permission: ['qb_tag'],
      prevModules: [...headerAndLeftNav, 'paperShowPage']
    },
    {
      // 试卷贴标签审核
      name: 'tagsVerify',
      path: '/tr/tagsverify',
      reducer: () => import('containers/TagsVerify/reducer'),
      sagas: () => import('containers/TagsVerify/sagas'),
      component: () => import('containers/TagsVerify'),
      permission: ['qb_tag_audit'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 试卷终审
      name: 'paperFinalVerify',
      path: '/tr/paperfinalverify',
      reducer: () => import('containers/PaperFinalVerify/reducer'),
      sagas: () => import('containers/PaperFinalVerify/sagas'),
      component: () => import('containers/PaperFinalVerify'),
      permission: ['final_audit'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 兼职用户管理
      name: 'temporaryPersonnel',
      path: '/tr/temporarypersonnel',
      reducer: () => import('containers/TemporaryPersonnel/reducer'),
      sagas: () => import('containers/TemporaryPersonnel/sagas'),
      component: () => import('containers/TemporaryPersonnel'),
      permission: ['temporary_staff_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 兼职角色-权限管理
      name: 'rolesManage',
      path: '/tr/temporaryRolesmanage',
      reducer: () => import('containers/RolesManage/reducer'),
      sagas: () => import('containers/RolesManage/sagas'),
      component: () => import('containers/RolesManage'),
      permission: ['role_permission_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 试题录入加个设置
      name: 'standardWagesManagement',
      path: '/tr/standardwages-management',
      reducer: () => import('containers/StandardWagesManagement/reducer'),
      sagas: () => import('containers/StandardWagesManagement/sagas'),
      component: () => import('containers/StandardWagesManagement'),
      permission: ['role_permission_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 兼职人员薪资明细
      name: 'standardWagesDataWrapper',
      path: '/tr/standardwages-data',
      reducer: () => import('containers/StandardWagesDataWrapper/reducer'),
      sagas: () => import('containers/StandardWagesDataWrapper/sagas'),
      component: () => import('containers/StandardWagesDataWrapper'),
      permission: ['role_permission_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 已入库题目管理
      name: 'questionManagement',
      path: '/tr/questionforlocal',
      reducer: () => import('containers/QuestionManagement/reducer'),
      sagas: () => import('containers/QuestionManagement/sagas'),
      component: () => import('containers/QuestionManagement'),
      permission: ['question_data_management'],
      prevModules: [...headerAndLeftNav, 'paperAnalysis']
    },
  ];
  return routes.map(el => ({ ...el, ...option }));
};

export default routes({ type: 'LocalTR' });
