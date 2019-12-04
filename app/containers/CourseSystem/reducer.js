/*
 *
 * AppBody reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_CLASS_TYPE_ID_ACTION,
  SET_CLASS_TYPE_LIST_ACTION,
  SET_COURSE_CONTENT_ID_ACTION,
  SET_COURSE_CONTENT_LIST_ACTION,
  SET_COURSE_MODULE_ID_ACTION,
  SET_COURSE_MODULE_LIST_ACTION,
  SET_COURSE_TYPE_ID_ACTION,
  SET_COURSE_TYPE_LIST_ACTION,
  SET_CRUD_ID_ACTION,
  SET_EDITION_ID_ACTION,
  SET_EDITION_LIST_ACTION,
  SET_GRADE_ID_ACTION,
  SET_GRADE_LIST_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_SUBJECT_ID_ACTION,
  SET_SUBJECT_LIST_ACTION,
  SET_ADD_EXIST,
  SET_MODAL_ATTR_ACTION,
  SET_KNOWLEDGE_LIST,
} from './constants';

const initialState = fromJS({
  gradeList: [],
  subjectList: [],
  editionList: [],
  gradeId: 0,
  subjectId: 0,
  editionId: 0,
  classTypeList: [],
  classTypeId: 0,
  courseTypeList: [],
  courseTypeId: 0,
  courseModuleList: [],
  courseModuleId: 0,
  courseContentList: [],
  courseContentId: 0,
  crudId: 0,
  addExist: false,
  inputDto: { name: '', level: 1, index: 0, pid: 0, gradeId: 0, subjectId: 0, editionId: 0, sort: 0, courseHour: 0, knowledgeIds: [] },
  modalAttr: { visible: false, action: '' },
  knowledgeList: [],
});

function courseSystemReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_GRADE_LIST_ACTION:
      return state.set('gradeList', action.gradeList);
    case SET_GRADE_ID_ACTION:
      return state.set('gradeId', action.gradeId);
    case SET_SUBJECT_LIST_ACTION:
      return state.set('subjectList', action.subjectList);
    case SET_SUBJECT_ID_ACTION:
      return state.set('subjectId', action.subjectId);
    case SET_EDITION_LIST_ACTION:
      return state.set('editionList', action.editionList);
    case SET_EDITION_ID_ACTION:
      return state.set('editionId', action.editionId);
    case SET_CLASS_TYPE_LIST_ACTION:
      return state.set('classTypeList', action.classTypeList);
    case SET_CLASS_TYPE_ID_ACTION:
      return state.set('classTypeId', action.classTypeId);
    case SET_COURSE_TYPE_LIST_ACTION:
      return state.set('courseTypeList', action.courseTypeList);
    case SET_COURSE_TYPE_ID_ACTION:
      return state.set('courseTypeId', action.courseTypeId);
    case SET_COURSE_MODULE_LIST_ACTION:
      return state.set('courseModuleList', action.courseModuleList);
    case SET_COURSE_MODULE_ID_ACTION:
      return state.set('courseModuleId', action.courseModuleId);
    case SET_COURSE_CONTENT_LIST_ACTION:
      return state.set('courseContentList', action.courseContentList);
    case SET_COURSE_CONTENT_ID_ACTION:
      return state.set('courseContentId', action.courseContentId);
    case SET_INPUT_DTO_ACTION:
      return state.set('inputDto', action.inputDto);
    case SET_CRUD_ID_ACTION:
      return state.set('crudId', action.crudId);
    case SET_ADD_EXIST:
      return state.set('addExist', action.addExist);
    case SET_MODAL_ATTR_ACTION :
      return state.set('modalAttr', action.modalAttr);
    case SET_KNOWLEDGE_LIST:
      return state.set('knowledgeList', action.list);
    default:
      return state;
  }
}

export default courseSystemReducer;
