// 只留当前子项目必要的几个路由，其他的跳转回原项目

import { browserHistory } from 'react-router';
import { getAsyncInjectors } from 'utils/asyncInjectors';
import AppLocalStorage from 'utils/localStorage';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};
const checkAuthority = (e, all, replaceState) => {
  if (!AppLocalStorage.getIsLogin()) {
    location.href = '/parttime/';
  }
  const permissions = AppLocalStorage.getPermissions();
  let bool;
  if (all) {
    bool = e.every((it) => permissions.includes(it));
  } else {
    bool = e.some((it) => permissions.includes(it));
  }
  if (!bool) {
    location.href = '/parttime/';
  }
};
export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
  const appHeader = () => {
    const importOrderModules = Promise.all([
      import('./Header/reducer'),
      import('./Header/sagas'),
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
      import('./LeftNavC/reducer'),
      import('./LeftNavC/sagas'),
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
      path: '/parttime/',
      name: 'login',
      onEnter: () => {
        if (AppLocalStorage.getIsLogin()) {
          browserHistory.push('/parttime/home');
        }
      },
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('./Login/reducer'),
          import('./Login/sagas'),
          import('./Login')
        ]);
        const renderRoute = loadModule(cb);
        importModules.then(([reducer, sagas, component]) => {
          injectReducer('login', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });
        importModules.catch(errorLoading);
      }
    }, {
      path: '/parttime/home',
      name: 'home',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader()
          .then(() => LeftContainer())
          .then(() => {
            const renderRoute = loadModule(cb);
            Promise.all([import('./HomePage')])
              .then(([component]) => {
                renderRoute(component);
              })
              .catch(errorLoading);
          });
      },
    }, {
      path: '/parttime/cutPaper',
      // name: 'parttimeCutPaper',
      name: 'getAndCutPaper',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_cut'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => paperShowPage()).then(() => {
          const renderRoute = loadModule(cb);
          Promise.all([
            import('containers/GetAndCutPaper/reducer'),
            import('containers/GetAndCutPaper/sagas'),
            import('containers/GetAndCutPaper')
          ]).then(([reducer, sagas, component]) => {
            injectReducer('getAndCutPaper', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          }).catch(errorLoading);
        });
      }
    }, {
      path: '/parttime/cutPaperVerify',
      // name: 'parttimeCutpaperVerify',
      name: 'paperCutVerify',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_cut_audit'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => paperShowPage()).then(() => {
          const renderRoute = loadModule(cb);
          Promise.all([
            import('containers/PaperCutVerify/reducer'),
            import('containers/PaperCutVerify/sagas'),
            import('containers/PaperCutVerify')
          ]).then(([reducer, sagas, component]) => {
            injectReducer('paperCutVerify', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          }).catch(errorLoading);
        });
      }
    }, {
      path: '/parttime/entryPaper',
      // name: 'parttimeEntryPaper',
      name: 'getAndInputPaper',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_entry'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => paperShowPage()).then(() => {
          const renderRoute = loadModule(cb);
          Promise.all([
            import('containers/GetAndInputPaper/reducer'),
            import('containers/GetAndInputPaper/sagas'),
            import('containers/GetAndInputPaper')
          ]).then(([reducer, sagas, component]) => {
            injectReducer('getAndInputPaper', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          }).catch(errorLoading);
        });
      }
    }, {
      path: '/parttime/entryPaperVerify',
      // name: 'parttimeEntryPaperVerify',
      name: 'paperInputVerify',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_entry_audit'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => paperShowPage()).then(() => {
          const renderRoute = loadModule(cb);
          Promise.all([
            import('containers/PaperInputVerify/reducer'),
            import('containers/PaperInputVerify/sagas'),
            import('containers/PaperInputVerify')
          ]).then(([reducer, sagas, component]) => {
            injectReducer('paperInputVerify', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          }).catch(errorLoading);
        });
      }
    }, {
      path: '/parttime/setPaperTags',
      // name: 'parttimeSetPaperTags',
      name: 'setTags',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_tag'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => paperShowPage()).then(() => {
          const renderRoute = loadModule(cb);
          Promise.all([
            import('containers/SetTags/reducer'),
            import('containers/SetTags/sagas'),
            import('containers/SetTags')
          ]).then(([reducer, sagas, component]) => {
            injectReducer('setTags', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          }).catch(errorLoading);
        });
      }
    }, {
      path: '/parttime/setPaperTagsVerify',
      // name: 'parttimeSetPaperTagsVerify',
      name: 'tagsVerify',
      onEnter(nextState, replaceState) {
        checkAuthority(['qb_tag_audit'], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => {
          const renderRoute = loadModule(cb);
          Promise.all([
            import('containers/TagsVerify/reducer'),
            import('containers/TagsVerify/sagas'),
            import('containers/TagsVerify')
          ]).then(([reducer, sagas, component]) => {
            injectReducer('tagsVerify', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          }).catch(errorLoading);
        });
      }
    // },
    // {
    //   path: '/parttime/temporarypersonnel',
    //   name: 'temporaryPersonnel',
    //   onEnter(nextState, replaceState) {
    //     checkAuthority(['temporary_staff_management'], true, replaceState);
    //   },
    //   getComponent(nextState, cb) {
    //     appHeader().then(() => LeftContainer()).then(() => {
    //       const renderRoute = loadModule(cb);
    //       Promise.all([
    //         import('containers/TemporaryPersonnel/reducer'),
    //         import('containers/TemporaryPersonnel/sagas'),
    //         import('containers/TemporaryPersonnel')
    //       ]).then(([reducer, sagas, component]) => {
    //         injectReducer('temporaryPersonnel', reducer.default);
    //         injectSagas(sagas.default);
    //         renderRoute(component);
    //       }).catch(errorLoading);
    //     });
    //   }
    // }, {
    //   path: '/parttime/rolesmanage',
    //   name: 'rolesManage',
    //   onEnter(nextState, replaceState) {
    //     checkAuthority(['role_permission_management'], true, replaceState);
    //   },
    //   getComponent(nextState, cb) {
    //     appHeader().then(() => LeftContainer()).then(() => {
    //       const renderRoute = loadModule(cb);
    //       Promise.all([
    //         import('containers/RolesManage/reducer'),
    //         import('containers/RolesManage/sagas'),
    //         import('containers/RolesManage')
    //       ]).then(([reducer, sagas, component]) => {
    //         injectReducer('rolesManage', reducer.default);
    //         injectSagas(sagas.default);
    //         renderRoute(component);
    //       }).catch(errorLoading);
    //     });
    //   }
    // }, {
    //   path: '/parttime/standardwages-management', // 标准工资配置
    //   name: 'standardWagesManagement',
    //   onEnter: (nextState, replaceState) => {
    //     checkAuthority(['role_permission_management'], true, replaceState);
    //   },
    //   getComponent(nextState, cb) {
    //     appHeader().then(() => LeftContainer()).then(() => {
    //       const renderRoute = loadModule(cb);
    //       Promise.all([
    //         import('containers/StandardWagesManagement/reducer'),
    //         import('containers/StandardWagesManagement/sagas'),
    //         import('containers/StandardWagesManagement')
    //       ]).then(([reducer, sagas, component]) => {
    //         injectReducer('standardWagesManagement', reducer.default);
    //         injectSagas(sagas.default);
    //         renderRoute(component);
    //       }).catch(errorLoading);
    //     });
    //   }
    // }, {
    //   path: '/parttime/standardwages-data', // 临时人员工资数据
    //   name: 'standardWagesDataWrapper',
    //   onEnter: (nextState, replaceState) => {
    //     checkAuthority(['role_permission_management'], true, replaceState);
    //   },
    //   getComponent(nextState, cb) {
    //     appHeader().then(() => LeftContainer()).then(() => {
    //       const renderRoute = loadModule(cb);
    //       Promise.all([
    //         import('containers/StandardWagesDataWrapper/reducer'),
    //         import('containers/StandardWagesDataWrapper/sagas'),
    //         import('containers/StandardWagesDataWrapper')
    //       ]).then(([reducer, sagas, component]) => {
    //         injectReducer('standardWagesDataWrapper', reducer.default);
    //         injectSagas(sagas.default);
    //         renderRoute(component);
    //       }).catch(errorLoading);
    //     });
    //   }
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
            const renderRoute = loadModule(cb);
            Promise.all([
              import('containers/HomeWorkMark/reducer'),
              import('containers/HomeWorkMark/sagas'),
              import('containers/HomeWorkMark'),
            ])
              .then(([reducer, sagas, component]) => {
                injectReducer('HomeWorkMark', reducer.default);
                injectSagas(sagas.default);
                renderRoute(component);
              })
              .catch(errorLoading);
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
            const renderRoute = loadModule(cb);
            Promise.all([
              import('containers/HomeWorkInfo/reducer'),
              import('containers/HomeWorkInfo/sagas'),
              import('containers/HomeWorkInfo'),
            ])
              .then(([reducer, sagas, component]) => {
                injectReducer('HomeWorkInfo', reducer.default);
                injectSagas(sagas.default);
                renderRoute(component);
              })
              .catch(errorLoading);
          });
      },
    },
    {
      path: '/parttime/papermanagement',
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
      path: '/parttime/questionmanagement',
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
      path: '/parttime/transferPage',
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
      path: '/parttime/personmsgmanager',
      name: 'personMsgManager',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => {
          const importModules = Promise.all([
            import('containers/PersonMsgManager/reducer'),
            import('containers/PersonMsgManager/sagas'),
            import('containers/PersonMsgManager')
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([reducer, sagas, component]) => {
            injectReducer('personMsgManager', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        });
      }
    },
    {
      path: '/parttime/personpassword',
      name: 'personPassWord',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => {
          const importModules = Promise.all([
            import('containers/PersonPassWord/reducer'),
            import('containers/PersonPassWord/sagas'),
            import('containers/PersonPassWord')
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([reducer, sagas, component]) => {
            injectReducer('personPassWord', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        });
      }
    },
    {
      path: '/parttime/TCCourseManagement',
      name: 'TCCourseManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => {
          const importModules = Promise.all([
            import('containers/TeacherCertification/TCCourseManagement')
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([component]) => {
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        });
      }
    },
    {
      path: '/parttime/TCPaperManagement',
      name: 'TCPaperManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => {
          const importModules = Promise.all([
            import('containers/TeacherCertification/TCPaperManagement')
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([component]) => {
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        });
      }
    },
    {
      path: '/parttime/TCQuestionManagement',
      name: 'TCQuestionManagement',
      onEnter: (nextState, replaceState) => {
        checkAuthority([], true, replaceState);
      },
      getComponent(nextState, cb) {
        appHeader().then(() => LeftContainer()).then(() => {
          const importModules = Promise.all([
            import('containers/TeacherCertification/TCQuestionManagement')
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([component]) => {
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        });
      }
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        location.href = '/parttime/';
      },
    }
  ];
}
