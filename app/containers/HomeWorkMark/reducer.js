/*
 *
 * H5CourseFeatureContents reducer
 *
 */

import {
  DEFAULT_ACTION,
  UPDATE_MARK_QUESTION_ITEM_ACTION,
  SET_HOME_WORK_MARK_DATA_ACTION,
  SET_TEA_TOTAL_COMMENT,
  SET_SELECT_STUDENT,
  SET_ALERT_MSG,
  INITIAL_STATE,
  } from './constants';

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_MARK_QUESTION_ITEM_ACTION:
      return state.set('homeworkmarkdata', state
        .get('homeworkmarkdata')
        .setIn(['homeworkLessonQuestionDTOList', action.index], action.item));
    case SET_HOME_WORK_MARK_DATA_ACTION:
      return state.set('homeworkmarkdata', action.item);
    case SET_TEA_TOTAL_COMMENT:
      return state.set('teaTotalComment', action.item);
    case SET_SELECT_STUDENT:
      return state.set('selectstudent', action.val);
    case SET_ALERT_MSG:
      return state.set('alertmsg', action.val);
    default:
      return state;
  }
}
