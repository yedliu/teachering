/*
 *
 * PaperManagement reducer
 *
 */

import { fromJS } from 'immutable';

import {
  SET_DEFAULT_STATE,
  SET_QUESTION_LIST
} from './constants';

const initialState = fromJS({
  questionList: []
});

function paperAnalysisReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEFAULT_STATE:
      return initialState;
    case SET_QUESTION_LIST:
      return state.set('questionList', action.data);
    default:
      return state;
  }
}

export default paperAnalysisReducer;
