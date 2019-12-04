/*
 *
 * HomeWorkMark constants
 *
 */
import { fromJS } from 'immutable';

export const DEFAULT_ACTION = 'app/HomeWorkMark/DEFAULT_ACTION';
export const UPDATE_MARK_QUESTION_ITEM_ACTION = 'app/HomeWorkMark/UPDATE_MARK_QUESTION_ITEM_ACTION';
export const SEND_MARK_MORE_WORK_DATA_ACTION = 'app/HomeWorkMark/SEND_MARK_MORE_WORK_DATA_ACTION';
export const SET_HOME_WORK_MARK_DATA_ACTION = 'app/HomeWorkMark/SET_HOME_WORK_MARK_DATA_ACTION';
export const SET_TEA_TOTAL_COMMENT = 'app/HomeWorkMark/SET_TEA_TOTAL_COMMENT';
export const GET_HOMEWORK_MARK_LIST_ACTION = 'app/HomeWorkMark/GET_HOMEWORK_MARK_LIST_ACTION';
export const SET_SELECT_STUDENT = 'app/HomeWorkMark/SET_SELECT_STUDENT';
export const SET_ALERT_MSG = 'app/HomeWorkMark/SET_ALERT_MSG';

export const INITIAL_STATE = fromJS({
  homeworkmarkdata: { homeworkLessonQuestionDTOList: [], graspKnowledgeDTOList: [] },
  teaTotalComment: '',
  selectstudent: {studentName: '', hwId: ''},
  alertmsg: {alertmessage: '', open: false},
});
