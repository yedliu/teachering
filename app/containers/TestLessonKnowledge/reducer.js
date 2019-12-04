/*
 *
 * TestLessonKnowledge reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_CRUD_ID_ACTION,
  SET_GRADE_ACTION,
  SET_GRADE_LIST_ACTION,
  SET_INPUT_DTO_ACTION,
  SET_MODAL_ATTR_ACTION,
  SET_PHASE_ACTION,
  SET_PHASE_LIST_ACTION,
  SET_SUBJECT_ACTION,
  SET_SUBJECT_LIST_ACTION,
  SET_TEST_LESSON_KNOWLEDGE_ACTION,
  SET_TEST_LESSON_KNOWLEDGE_LIST_ACTION,
  SET_BU_ACTION,
  SET_CLASSTYPE_LIST_ACTION,
  SET_TEXTBOOK_EDITION_LIST_ACTION,
  SET_TEXTBOOK_EDITION_ACTION,
  UPDATE_LOADING
} from './constants';

const initialState = fromJS({
  phaseList: [],
  classTypeList: [],
  phase: { id: 0, name: '' },
  gradeList: [],
  grade: { id: 0, name: '' },
  subjectList: [],
  subject: { id: 0, name: '' },
  buObject: { code: '', value: '' },
  testLessonKnowledgeList: [],
  testLessonKnowledge: { id: 0, name: '' },
  crudId: 0,
  inputDto: { name: '', phaseId: 0, gradeIdList: [], subjectId: 0, sort: 0, difficulty: 0, remarks: '', lessonType: '', textbookEditionIdList: [] },
  modalAttr: { visible: false, action: '' },
  textbookEditionList: [],
  textbookEdition: { id: 0, name: '不限' },
  loading: false,
});

function testLessonKnowledgeReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_PHASE_LIST_ACTION:
      return state.set('phaseList', action.phaseList);
    case SET_CLASSTYPE_LIST_ACTION:
      return state.set('classTypeList', action.classTypeList);
    case SET_PHASE_ACTION:
      return state.set('phase', action.phase);
    case SET_BU_ACTION:
      return state.set('buObject', action.bu);
    case SET_GRADE_LIST_ACTION:
      return state.set('gradeList', action.gradeList);
    case SET_GRADE_ACTION:
      return state.set('grade', action.grade);
    case SET_SUBJECT_LIST_ACTION :
      return state.set('subjectList', action.subjectList);
    case SET_SUBJECT_ACTION :
      return state.set('subject', action.subject);
    case SET_TEST_LESSON_KNOWLEDGE_LIST_ACTION :
      return state.set('testLessonKnowledgeList', action.testLessonKnowledgeList);
    case SET_TEST_LESSON_KNOWLEDGE_ACTION :
      return state.set('testLessonKnowledge', action.testLessonKnowledge);
    case SET_INPUT_DTO_ACTION :
      return state.set('inputDto', action.inputDto);
    case SET_CRUD_ID_ACTION :
      return state.set('crudId', action.crudId);
    case SET_MODAL_ATTR_ACTION :
      return state.set('modalAttr', action.modalAttr);
    case SET_TEXTBOOK_EDITION_LIST_ACTION:
      return state.set('textbookEditionList', action.textbookEditionList);
    case SET_TEXTBOOK_EDITION_ACTION:
      return state.set('textbookEdition', action.textbookEdition);
    case UPDATE_LOADING:
      return state.set('loading', action.loading);
    default:
      return state;
  }
}

export default testLessonKnowledgeReducer;
