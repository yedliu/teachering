import { browserHistory } from 'react-router';
import AppLocalStorage from 'utils/localStorage';

const headerAndLeftNav = ['appHeader', 'LeftContainer'];

const routes = (option = {}) => {
  const routes = [
    {
      path: '/home',
      name: 'home',
      component: () => import('containers/HomePage'),
      reducerName: 'home',
      prevModules: [...headerAndLeftNav]
    },
    {
      path: '/',
      name: 'login',
      reducer: () => import('containers/Login/reducer'),
      sagas: () => import('containers/Login/sagas'),
      component: () => import('containers/Login'),
      onEnter() {
        if (AppLocalStorage.getIsLogin()) {
          browserHistory.push('/home');
        }
      }
    },
    {
      path: '/iframe/question-picker',
      name: 'QuestionPicker',
      component: () => import('containers/H5Share/pickers/questionPicker.js')
    },
    {
      path: '/iframe/searchQuestions',
      name: 'searchQuestions',
      component: () => import('containers/QusSearchForLearningMaterialSystem')
    },
    {
      path: '/tr/transferPage',
      name: 'searchQuestions',
      component: () => import('containers/TransferPage')
    },
  ];
  return routes.map(el => ({ ...el, ...option }));
};
export default routes();
