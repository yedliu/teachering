/*
 *
 * StudySystemManagement reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_GRADE_LIST_ACTION,
  SET_GRADE_ACTION,
  SET_GRADE_SUBJECT_LIST_ACTION,
  SET_GRADE_SUBJECT_ACTION,
  SET_CLASS_TYPE_LIST_ACTION,
  SET_CLASS_TYPE_ACTION,
  SET_SELECT_PID_ACTION,
  SET_LEVE_FIRST_LIST_ACTION,
  SET_LEVE_FIRST_ID_ACTION,
  SET_LEVE_SECOND_LIST_ACTION,
  SET_LEVE_SECOND_ID_ACTION,
  SET_LEVE_THREE_LIST_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_ADD_EXIST,
  SET_CRUD_ID_ACTION,
  SET_LEVE_THREE_ID_ACTION,
  SET_EDITION_LIST_ACTION,
  SET_EDITION_ACTION,
} from './constants';

const initialState = fromJS({
  gradeList: [],
  grade: { id: 0, name: '' }, // 年级
  gradeSubjectList: [],
  gradeSubject: { id: 0, name: '' }, // 年级科目
  classTypeList: [],
  classType: { code: 0, value: '' }, // 年级科目
  editionList: [],
  edition: { id: 0, value: '' }, // 年级科目
  pid: 0,
  crudId: 0,
  firstLevel: [],
  firstLevelId: 0,
  secondlevel: [],
  secondLevelId: 0,
  threelevel: [],
  threeLevelId: 0,
  addExist: false,
  inputDto: {
    classType: '',
    gradeId: '',
    name: '',
    level: 1,
    pid: 0,
    sort: 0,
    subjectId: 0,
    editionId: 0
  }
});

function studySystemManagementReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_GRADE_LIST_ACTION:
      return state.set('gradeList', action.gradeList);
    case SET_GRADE_ACTION:
      return state.set('grade', action.grade);
    case SET_GRADE_SUBJECT_LIST_ACTION:
      return state.set('gradeSubjectList', action.gradeSubjectList);
    case SET_GRADE_SUBJECT_ACTION:
      return state.set('gradeSubject', action.gradeSubject);
    case SET_CLASS_TYPE_LIST_ACTION:
      return state.set('classTypeList', action.classTypeList);
    case SET_CLASS_TYPE_ACTION:
      return state.set('classType', action.classType);
    case SET_SELECT_PID_ACTION:
      return state.set('pid', action.pid);
    case SET_LEVE_FIRST_LIST_ACTION:
      return state.set('firstLevel', action.item);
    case SET_LEVE_FIRST_ID_ACTION:
      return state.set('firstLevelId', action.id);
    case SET_LEVE_SECOND_LIST_ACTION:
      return state.set('secondlevel', action.item);
    case SET_LEVE_SECOND_ID_ACTION:
      return state.set('secondLevelId', action.id);
    case SET_LEVE_THREE_ID_ACTION:
      return state.set('threeLevelId', action.id);
    case SET_LEVE_THREE_LIST_ACTION:
      return state.set('threelevel', action.item);
    case SET_INPUT_DTO_ACTION:
      return state.set('inputDto', action.inputDto);
    case SET_ADD_EXIST:
      return state.set('addExist', action.addExist);
    case SET_CRUD_ID_ACTION:
      return state.set('crudId', action.crudId);
    case SET_EDITION_LIST_ACTION:
      return state.set('editionList', action.editionList);
    case SET_EDITION_ACTION:
      return state.set('edition', action.edition);
    default:
      return state;
  }
}

export default studySystemManagementReducer;
