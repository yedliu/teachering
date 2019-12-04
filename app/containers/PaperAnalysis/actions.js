/*
 *
 * PaperManagement actions
 *
 */

import {
  SET_DEFAULT_STATE,
  GET_QUESTION_LIST,
  SET_QUESTION_LIST
} from './constants';

export function setDefaultState() {
  return {
    type: SET_DEFAULT_STATE
  };
}

export function getQuestionList(id) {
  return {
    type: GET_QUESTION_LIST,
    id
  };
}

export function setQuestionList(data) {
  return {
    type: SET_QUESTION_LIST,
    data
  };
}
