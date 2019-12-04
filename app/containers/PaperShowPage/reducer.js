/*
 *
 * PaperShowPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  CHANGE_INDEX_ACTION,
  INIT_INDEX_ACTION,
} from './constants';

const initialState = fromJS({
  index: {
    questionIndex: 0,
    childrenIndex: 0,
  },
});

function paperShowPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_INDEX_ACTION:
      return state.set('index', action.item);
    case INIT_INDEX_ACTION:
      return state.set('index', fromJS({
        questionIndex: 0,
        childrenIndex: 0,
      }));
    default:
      return state;
  }
}

export default paperShowPageReducer;
