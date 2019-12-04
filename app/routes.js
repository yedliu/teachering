// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { browserHistory } from 'react-router';
import { getAsyncInjectors } from './utils/asyncInjectors';
import AppLocalStorage from './utils/localStorage';
import { message } from 'antd';
// import { LeftNav } from "./containers/LeftNav/index";

const errorLoading = err => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = cb => componentModule => {
  cb(null, componentModule.default);
};
const checkAuthority = (e, all, replaceState) => {
  if (!AppLocalStorage.getIsLogin()) {
    replaceState({ pathname: '' });
  }
  const permissions = AppLocalStorage.getPermissions();
  let bool;
  if (all) {
    bool = e.every(it => permissions.indexOf(it) > -1);
  } else {
    bool = e.some(it => permissions.indexOf(it) > -1);
  }
  if (!bool) {
    // 没有权限跳到首页
    message.info('您没有权限访问该页面');
    replaceState({ pathname: 'home' });
  }
};
export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
  const appHeader = () => {
    const importOrderModules = Promise.all([
      import('containers/Header/reducer'),
      import('containers/Header/sagas'),
    ]);
    importOrderModules.then(([reducer, sagas]) => {
      injectReducer('header', reducer.default);
      injectSagas(sagas.default);
    });
    importOrderModules.catch(errorLoading);
    return importOrderModules;
  };
  const LeftContainer = () => {
    const importOrderModules = Promise.all([
      import('containers/LeftNavC/reducer'),
      import('containers/LeftNavC/sagas'),
    ]);
    importOrderModules.then(([reducer, sagas]) => {
      injectReducer('leftNavC', reducer.default);
      injectSagas(sagas.default);
    });
    importOrderModules.catch(errorLoading);
    return importOrderModules;
  };
  const paperShowPage = () => {
    const importOrderModules = Promise.all([
      import('containers/PaperShowPage/reducer'),
      import('containers/PaperShowPage/sagas'),
    ]);
    importOrderModules.then(([reducer, sagas]) => {
      injectReducer('paperShowPage', reducer.default);
      injectSagas(sagas.default);
    });
    importOrderModules.catch(errorLoading);
    return importOrderModules;
  };
  const paperAnalysis = () => {
    const importOrderModules = Promise.all([
      import('containers/PaperAnalysis/reducer'),
      import('containers/PaperAnalysis/sagas'),
    ]);
    importOrderModules.then(([reducer, sagas]) => {
      injectReducer('paperAnalysis', reducer.default);
      injectSagas(sagas.default);
    });
    importOrderModules.catch(errorLoading);
    return importOrderModules;
  };

  return [
    {
      path: '/home',
      name: 'home',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([import('containers/HomePage')]);
            const renderRoute = loadModule(cb);
            importModules.then(([component]) => {
              renderRoute(component);
            });
            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/',
      name: 'login',
      onEnter: () => {
        if (AppLocalStorage.getIsLogin()) {
          browserHistory.push('/home');
        }
      },
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Login/reducer'),
          import('containers/Login/sagas'),
          import('containers/Login'),
        ]);
        const renderRoute = loadModule(cb);
        importModules.then(([reducer, sagas, component]) => {
          injectReducer('login', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });
        importModules.catch(errorLoading);
      },
    },
    {
      path: '/course-system',
      name: 'courseSystem',
      onEnter(nextState, replaceState) {
        checkAuthority(['course_system_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/CourseSystem/reducer'),
              import('containers/CourseSystem/sagas'),
              import('containers/CourseSystem'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('courseSystem', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/test-lesson-knowledge',
      name: 'testLessonKnowledge',
      onEnter(nextState, replaceState) {
        checkAuthority(
          ['test_lesson_knowledge_management'],
          true,
          replaceState,
        );
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/TestLessonKnowledge/reducer'),
              import('containers/TestLessonKnowledge/sagas'),
              import('containers/TestLessonKnowledge'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('testLessonKnowledge', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      onEnter(nextState, replaceState) {
        checkAuthority(['knowledge_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/Knowledge/reducer'),
              import('containers/Knowledge/sagas'),
              import('containers/Knowledge'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('knowledge', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/examination-point',
      name: 'examinationPoint',
      onEnter(nextState, replaceState) {
        checkAuthority(['exam_point_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/examinationPoint/reducer'),
              import('containers/examinationPoint/sagas'),
              import('containers/examinationPoint'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('examinationPoint', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/addPaper',
      name: 'addPaper',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_upload'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/addPaper/reducer'),
              import('containers/addPaper/sagas'),
              import('containers/addPaper'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('addPaper', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/addvideo',
      name: 'addVideoWrapper',
      onEnter(nextState, replaceState) {
        checkAuthority(['add_vedio'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/AddVideoWrapper/reducer'),
              import('containers/AddVideoWrapper/sagas'),
              import('containers/AddVideoWrapper'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('addVideoWrapper', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/videomanage',
      name: 'videoManageWrapper',
      onEnter(nextState, replaceState) {
        checkAuthority(['vedio_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/VideoManageWrapper/reducer'),
              import('containers/VideoManageWrapper/sagas'),
              import('containers/VideoManageWrapper'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('videoManageWrapper', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/getandcutpaper',
      name: 'getAndCutPaper',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_cut'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/GetAndCutPaper/reducer'),
              import('containers/GetAndCutPaper/sagas'),
              import('containers/GetAndCutPaper'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('getAndCutPaper', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/papercutverify',
      name: 'paperCutVerify',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_cut_audit'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/PaperCutVerify/reducer'),
              import('containers/PaperCutVerify/sagas'),
              import('containers/PaperCutVerify'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('paperCutVerify', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/getandinputpaper',
      name: 'getAndInputPaper',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_entry'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/GetAndInputPaper/reducer'),
              import('containers/GetAndInputPaper/sagas'),
              import('containers/GetAndInputPaper'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('getAndInputPaper', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/settags',
      name: 'setTags',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_tag'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/SetTags/reducer'),
              import('containers/SetTags/sagas'),
              import('containers/SetTags'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('setTags', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });
            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/edition',
      name: 'edition',
      onEnter(nextState, replaceState) {
        checkAuthority(['edition_data_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/Edition/reducer'),
              import('containers/Edition/sagas'),
              import('containers/Edition'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('edition', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/paperinputverify',
      name: 'paperInputVerify',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_entry_audit'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/PaperInputVerify/reducer'),
              import('containers/PaperInputVerify/sagas'),
              import('containers/PaperInputVerify'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('paperInputVerify', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/standhomework',
      name: 'standHomeWork',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/StandHomeWork/reducer'),
              import('containers/StandHomeWork/sagas'),
              import('containers/StandHomeWork'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('standHomeWork', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/schoolhomework',
      name: 'schoolHomeWork',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/SchoolHomeWork/reducer'),
              import('containers/SchoolHomeWork/sagas'),
              import('containers/SchoolHomeWork'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('schoolHomeWork', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/testhomework',
      name: 'testHomeWork',
      onEnter(nextState, replaceState) {
        checkAuthority(['test_lesson_homework_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/TestHomeWork/reducer'),
              import('containers/TestHomeWork/sagas'),
              import('containers/TestHomeWork'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('testHomeWork', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/tagsverify',
      name: 'tagsVerify',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_tag_audit'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/TagsVerify/reducer'),
              import('containers/TagsVerify/sagas'),
              import('containers/TagsVerify'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('tagsVerify', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/officialpersonnel',
      name: 'officialPersonnel',
      onEnter(nextState, replaceState) {
        checkAuthority(['official_staff_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/OfficialPersonnel/reducer'),
              import('containers/OfficialPersonnel/sagas'),
              import('containers/OfficialPersonnel'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('officialPersonnel', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/temporarypersonnel',
      name: 'temporaryPersonnel',
      onEnter(nextState, replaceState) {
        checkAuthority(['temporary_staff_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/TemporaryPersonnel/reducer'),
              import('containers/TemporaryPersonnel/sagas'),
              import('containers/TemporaryPersonnel'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('temporaryPersonnel', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/rolesmanage',
      name: 'rolesManage',
      onEnter(nextState, replaceState) {
        checkAuthority(['role_permission_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/RolesManage/reducer'),
              import('containers/RolesManage/sagas'),
              import('containers/RolesManage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('rolesManage', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });
            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/personmsgmanager',
      name: 'personMsgManager',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/PersonMsgManager/reducer'),
              import('containers/PersonMsgManager/sagas'),
              import('containers/PersonMsgManager'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('personMsgManager', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/personpassword',
      name: 'personPassWord',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/PersonPassWord/reducer'),
              import('containers/PersonPassWord/sagas'),
              import('containers/PersonPassWord'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('personPassWord', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/paperfinalverify',
      name: 'paperFinalVerify',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/PaperFinalVerify/reducer'),
              import('containers/PaperFinalVerify/sagas'),
              import('containers/PaperFinalVerify'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('paperFinalVerify', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/data/homeworkSummary',
      name: 'homeworkSummary',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/HomeWorkSummary/reducer'),
              import('containers/HomeWorkSummary/sagas'),
              import('containers/HomeWorkSummary'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('homeWorkSummary', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/data/testPaper',
      name: 'testPaper',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/TestPaper/reducer'),
              import('containers/TestPaper/sagas'),
              import('containers/TestPaper'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('testPaper', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    // {
    //   path: '/data/standardHomeworkData',
    //   name: 'standardHomeworkData',
    //   onEnter: (nextState, replaceState) => {
    //     checkAuthority([], true, replaceState);
    //   },
    //   getComponent(nextState, cb) {
    //     appHeader().then(() => LeftContainer()).then(() => {
    //       const importModules = Promise.all([
    //         import('containers/StandardHomeworkData/reducer'),
    //         import('containers/StandardHomeworkData/sagas'),
    //         import('containers/StandardHomeworkData')
    //       ]);

    //       const renderRoute = loadModule(cb);

    //       importModules.then(([reducer, sagas, component]) => {
    //         injectReducer('standardHomeworkData', reducer.default);
    //         injectSagas(sagas.default);
    //         renderRoute(component);
    //       });

    //       importModules.catch(errorLoading);
    //     });
    //   }
    // },
    {
      path: '/data/questionLibraryData',
      name: 'questionLibraryData',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/QuestionLibraryData/reducer'),
              import('containers/QuestionLibraryData/sagas'),
              import('containers/QuestionLibraryData'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('questionLibraryData', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/standardwages-management', // 标准工资配置
      name: 'standardWagesManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority(['role_permission_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/StandardWagesManagement/reducer'),
              import('containers/StandardWagesManagement/sagas'),
              import('containers/StandardWagesManagement'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('standardWagesManagement', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/standardwages-data', // 临时人员工资数据
      name: 'standardWagesDataWrapper',
      onEnter: (nextState, replaceState) => {
        checkAuthority(['role_permission_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/StandardWagesDataWrapper/reducer'),
              import('containers/StandardWagesDataWrapper/sagas'),
              import('containers/StandardWagesDataWrapper'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('standardWagesDataWrapper', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/homeworkmark', // 招师培训作业批改
      name: 'homeworkmark',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/HomeWorkMark/reducer'),
              import('containers/HomeWorkMark/sagas'),
              import('containers/HomeWorkMark'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('HomeWorkMark', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/errorcorrectmanagement',
      name: 'errorCorrectManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/ErrorCorrectManagement/reducer'),
              import('containers/ErrorCorrectManagement/sagas'),
              import('containers/ErrorCorrectManagement'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('errorCorrectManagement', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/homeworkinfo', // 招师培训作业查看
      name: 'homeworkinfo',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/HomeWorkInfo/reducer'),
              import('containers/HomeWorkInfo/sagas'),
              import('containers/HomeWorkInfo'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('HomeWorkInfo', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/questionmanagement',
      name: 'questionManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority(
          ['question_data_management', 'exam_paper_data_management'],
          false,
          replaceState,
        );
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => paperAnalysis())
          .then(() => {
            const importModules = Promise.all([
              import('containers/QuestionManagement/reducer'),
              import('containers/QuestionManagement/sagas'),
              import('containers/QuestionManagement'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('questionManagement', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/papermanagement',
      name: 'paperManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority(['exam_paper_data_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => paperAnalysis())
          .then(() => {
            const importModules = Promise.all([
              import('containers/PaperManagement/reducer'),
              import('containers/PaperManagement/sagas'),
              import('containers/PaperManagement'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('paperManagement', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: 'tr/pianoteachingdetail',
      name: 'pianoTeachingDetail',
      onEnter(nextState, replaceState) {
        if (!AppLocalStorage.getIsLogin()) {
          replaceState({ pathname: 'login' });
        }
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/PianoTeachingDetail/reducer'),
              import('containers/PianoTeachingDetail/sagas'),
              import('containers/PianoTeachingDetail'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('pianoTeachingDetail', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/data/homework',
      name: 'homeWorkDataView',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/HomeWorkDataView/reducer'),
              import('containers/HomeWorkDataView/sagas'),
              import('containers/HomeWorkDataView'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('homeWorkDataView', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/child-edition',
      name: 'childVersionManage',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/ChildVersionManage/reducer'),
              import('containers/ChildVersionManage/sagas'),
              import('containers/ChildVersionManage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('childVersionManage', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/textbook-edition',
      name: 'textbookEdition',
      onEnter(nextState, replaceState) {
        checkAuthority(['textbook_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/TextbookEdition/reducer'),
              import('containers/TextbookEdition/sagas'),
              import('containers/TextbookEdition'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('textbookEdition', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/child-course-manage',
      name: 'childCourseManage',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/ChildCourseManage/reducer'),
              import('containers/ChildCourseManage/sagas'),
              import('containers/ChildCourseManage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('childCourseManage', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/child-knowledge-manage',
      name: 'ChildKnowledgeManage',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/ChildKnowledgeManage/reducer'),
              import('containers/ChildKnowledgeManage/sagas'),
              import('containers/ChildKnowledgeManage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('childKnowledgeManange', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/largeClassHomeWork',
      name: 'largeClassHomeWork',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/LargeClassHomeWork/reducer'),
              import('containers/LargeClassHomeWork/sagas'),
              import('containers/LargeClassHomeWork'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('largeClassHomeWork', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: 'tr/questionPrint',
      name: 'questionPrint',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/QuestionPrint'),
            ]);
            const renderRoute = loadModule(cb);
            importModules.then(([component]) => {
              renderRoute(component);
            });
            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: 'study-system-management',
      name: 'studySystemManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/StudySystemManagement/reducer'),
              import('containers/StudySystemManagement/sagas'),
              import('containers/StudySystemManagement'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('studySystemManagement', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    // {
    //   path: 'childBU/courseware-ZML',
    //   name: 'zmlCourseware',
    //   onEnter: (nextState, replaceState) => {
    //     checkAuthority([], true, replaceState);
    //   },
    //   getComponent(nextState, cb) {
    //     appHeader().then(() => LeftContainer()).then(() => paperShowPage()).then(() => {
    //       const importModules = Promise.all([
    //         import('containers/ChildBU/Courseware/ZML'),
    //       ]);
    //       const renderRoute = loadModule(cb);
    //       importModules.then(([component]) => {
    //         renderRoute(component);
    //       });
    //       importModules.catch(errorLoading);
    //     });
    //   },
    // },
    // {
    //   path: 'childBU/courseware-assess',
    //   name: 'assessCourseware',
    //   onEnter: (nextState, replaceState) => {
    //     checkAuthority([], true, replaceState);
    //   },
    //   getComponent(nextState, cb) {
    //     appHeader().then(() => LeftContainer()).then(() => paperShowPage()).then(() => {
    //       const importModules = Promise.all([
    //         import('containers/ChildBU/Courseware/Assess'),
    //       ]);
    //       const renderRoute = loadModule(cb);
    //       importModules.then(([component]) => {
    //         renderRoute(component);
    //       });
    //       importModules.catch(errorLoading);
    //     });
    //   },
    // },
    {
      path: 'childBU/homework-standard',
      name: 'standardHomework',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/StandHomeWork/reducer'),
              import('containers/StandHomeWork/sagas'),
              import('containers/StandHomeWork'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('standHomeWork', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {},
    {
      path: 'tr',
      name: 'tr',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/HomePage/SubHomePage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: 'childBU',
      name: 'childBU',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/HomePage/SubHomePage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: 'childBU/evaluationCourseManagement',
      name: 'evaluationCourseManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/ChildBU/FormalCourse/EvaluationCourseManagement'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/childBU/formalCourseManagement',
      name: 'formalCourseManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/ChildBU/FormalCourse/FormalCourseManagement'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: 'childBU/formalCourseSystemManagement',
      name: 'formalCourseSystemManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/ChildBU/FormalCourse/FormalCourseSystemManagement'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/childBU/questionPrint',
      name: 'childBUQuestionPrint',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/QuestionPrint'),
            ]);
            const renderRoute = loadModule(cb);
            importModules.then(([component]) => {
              renderRoute(component);
            });
            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/iframe/searchQuestions',
      name: 'searchQuestions',
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const importModules = Promise.all([
              import('containers/QusSearchForLearningMaterialSystem'),
            ]);
            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/iframe/question-picker',
      name: 'QuestionPicker',
      onEnter: (nextState, replaceState) => {
        // checkAuthority(['courseware_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        const renderRoute = loadModule(cb);
        const importModules = Promise.all([
          import('containers/H5Share/pickers/questionPicker.js'),
        ]);
        importModules
          .then(([component]) => {
            renderRoute(component);
          })
          .catch(errorLoading);
      },
    },
    {
      path: '/tr/transferPage',
      name: 'TransferPage',
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => paperShowPage())
          .then(() => {
            const importModules = Promise.all([
              import('containers/TransferPage'),
            ]);
            const renderRoute = loadModule(cb);
            importModules.then(([component]) => {
              renderRoute(component);
            });
            importModules.catch(errorLoading);
          });
      },
    },
    {
      path: '/tr/errorCorrectionBoard',
      name: 'errorCorrectionData',
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => {
          const renderRoute = loadModule(cb);
          Promise.all([
            import('containers/DataBoard/ErrorCorrectBoard'),
          ]).then(([component]) => {
            renderRoute(component);
          }).catch(errorLoading);
        });
      },
    },
    {
      path: '/tr/abilityLabel',
      name: 'abilityLabel',
      onEnter: (nextState, replaceState) => {
        checkAuthority(['question_data_management'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => {
          const renderRoute = loadModule(cb);
          Promise.all([
            import('containers/AbilityLabel/index'),
          ]).then(([component]) => {
            renderRoute(component);
          }).catch(errorLoading);
        });
      },
    },
    {
      path: '/tr/oneToOneTestReportService',
      name: 'oneToOneTestReportService',
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => {
          const renderRoute = loadModule(cb);
          Promise.all([
            import('containers/OneToOneTestReportService'),
          ]).then(([component]) => {
            renderRoute(component);
          }).catch(errorLoading);
        });
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            import('containers/NotFoundPage')
              .then(loadModule(cb))
              .catch(errorLoading);
          });
      },
    },
  ];
}
