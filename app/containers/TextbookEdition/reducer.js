/*
 *
 * TextbookEdition reducer
 *
 */

import { fromJS } from 'immutable';
import {
	DEFAULT_ACTION,
	SET_PHASE_LIST_ACTION,
	SET_PHASE_ACTION,
	SET_SUBJECT_LIST_ACTION,
	SET_SUBJECT_ACTION,
	SET_GRADE_ID_ACTION,
	SET_GRADE_LIST_ACTION,
	SET_SUBJECT_ID_ACTION,
	SET_SUBJECT_EDITION_LIST,
	SET_ADD_NEW,
	SET_INPUT_CHANGE_ACTION,
	SET_TEXTBOOK_LIST_ACTION,
	SET_TEXTBOOK_ACTION,
	SET_CRUD_ID_ACTION,
	SET_EDITION_LIST_ACTION,
	SET_EDITION_ID_ACTION,
	SET_KNOWLEDGE_LIST_ACTION,
	SET_SELECTED_KNOWLEDGE_LIST_ACTION,
	SET_KNOWLEDGE_ACTION,
	SET_KNOWLEDGE_CRUD_ID_ACTION,
	SET_INPUT_DTO_ACTION,
	SET_FIRST_NODE_LSIT_ACTION,
	SET_FIRST_NODE_ID_ACTION,
	SET_ADD_EXIST,
	SET_SECOND_NODE_LSIT_ACTION,
	SET_SECOND_NODE_ID_ACTION,
	SET_THREE_NODE_LIST_ACTION,
	SET_THREE_NODE_ID_ACTION,
	SET_FOUR_NODE_LIST_ACTION,
	SET_FOUR_NODE_ID_ACTION,
	SET_MODAL_ATTR_ACTION,
	SET_ADD_LEVEL_ACTION,
	GET_SUBJECT_ACTION,
	GET_GRADE_ACTION,
	GET_FIRST_NODE_LSIT_ACTION,
	GET_SUBJECT_LIST_ACTION
} from './constants';

const initialState = fromJS({
	phaseList: [],
	phase: { id: 0, name: '' },
	subjectList: [],
	subject: { id: 0, name: '' },
	gradeId: 0,
	gradeList: [],
	subjectId: 0,
	subjectEditionList: [],
	models: { visible: false },
	inputList: { name: '', phaseId: 0, subjectId: 0, sort: 0 },
	textbookList: [],
	textbook: { id: 0, name: '' },
	crudId: 0,
	editionList: [],
	editionId: 0,
	knowledgeList: [],
	selectedKnowledgeList: [],
	knowledge: { id: 0, name: '' },
	knowledgeCrudId: 0,
	inputDto: {
		name: '',
		level: 1,
		index: 0,
		pId: 0,
		gradeId: 0,
		subjectId: 0,
		editionId: 0,
		sort: 0,
		knowledgeIds: []
	},
	firstNodeList: [],
	firstNodeId: 0,
	addExist: false,
	secondNodeList: [],
	secondNodeId: 0,
	threeNodeList: [],
	threeNodeId: 0,
	fourNodeList: [],
	fourNodeId: 0,
	modalAttr: { visible: false, action: '' },
	addLevel: { showThree: false, showFour: false }
});

function textbookEditionReducer(state = initialState, action) {
	switch (action.type) {
		case DEFAULT_ACTION:
			return state;
		case SET_PHASE_LIST_ACTION:
			return state.set('phaseList', action.phaseList);
		case SET_PHASE_ACTION:
			return state.set('phase', action.phase);
		case SET_TEXTBOOK_ACTION:
			return state.set('textbook', action.textbook);
		case SET_TEXTBOOK_LIST_ACTION:
			return state.set('textbookList', action.textbookList);
		case SET_INPUT_CHANGE_ACTION:
			return state.set('inputList', action.inputList);
		case SET_ADD_NEW:
			return state.set('models', action.models);
		case SET_EDITION_LIST_ACTION:
			return state.set('editionList', action.editionList);
		case SET_EDITION_ID_ACTION:
			return state.set('editionId', action.editionId);
		case SET_SUBJECT_LIST_ACTION:
			return state.set('subjectList', action.subjectList);
		case SET_SUBJECT_ACTION:
			return state.set('subject', action.subject);
		case SET_GRADE_ID_ACTION:
			return state.set('gradeId', action.gradeId);
		case SET_GRADE_LIST_ACTION:
			return state.set('gradeList', action.gradeList);
		case SET_SUBJECT_ID_ACTION:
			return state.set('subjectId', action.subjectId);
		case SET_SUBJECT_EDITION_LIST:
			return state.set('subjectEditionList', action.subjectEditionList);
		case SET_CRUD_ID_ACTION:
			return state.set('crudId', action.crudId);
		case SET_KNOWLEDGE_LIST_ACTION:
			return state.set('knowledgeList', action.knowledgeList);
		case SET_SELECTED_KNOWLEDGE_LIST_ACTION:
			return state.set('selectedKnowledgeList', action.selectedKnowledgeList);
		case SET_KNOWLEDGE_ACTION:
			return state.set('knowledge', action.knowledge);
		case SET_KNOWLEDGE_CRUD_ID_ACTION:
			return state.set('knowledgeCrudId', action.knowledgeCrudId);
		case SET_INPUT_DTO_ACTION:
			return state.set('inputDto', action.inputDto);
		case SET_FIRST_NODE_LSIT_ACTION:
			return state.set('firstNodeList', action.firstNodeList);
		case SET_FIRST_NODE_ID_ACTION:
			return state.set('firstNodeId', action.firstNodeId);
		case SET_ADD_EXIST:
			return state.set('addExist', action.addExist);
		case SET_SECOND_NODE_LSIT_ACTION:
			return state.set('secondNodeList', action.secondNodeList);
		case SET_SECOND_NODE_ID_ACTION:
			return state.set('secondNodeId', action.secondNodeId);
		case SET_THREE_NODE_LIST_ACTION:
			return state.set('threeNodeList', action.threeNodeList);
		case SET_THREE_NODE_ID_ACTION:
			return state.set('threeNodeId', action.threeNodeId);
		case SET_FOUR_NODE_ID_ACTION:
			return state.set('fourNodeId', action.fourNodeId);
		case SET_FOUR_NODE_LIST_ACTION:
			return state.set('fourNodeList', action.fourNodeList);
		case SET_MODAL_ATTR_ACTION:
			return state.set('modalAttr', action.modalAttr);
		case SET_ADD_LEVEL_ACTION:
			return state.set('addLevel', action.addLevel);
		case GET_SUBJECT_ACTION:
			console.log('GET_SUBJECT_ACTION - reducer');
			return state
				.set('editionList', fromJS([]))
				.set('editionId', 0)
				.set('firstNodeList', fromJS([]))
				.set('secondNodeList', fromJS([]))
				.set('threeNodeList', fromJS([]))
				.set('fourNodeList', fromJS([]))
				.set('firstNodeId', 0);
		case GET_GRADE_ACTION:
			return state.set('subjectEditionList', fromJS([]));
		case GET_FIRST_NODE_LSIT_ACTION:
			return state.set('firstNodeList', fromJS([]));
		case GET_SUBJECT_LIST_ACTION:
			return state.set('subjectList', fromJS([])).set('subject', fromJS({ id: '', name: '' }));
		default:
			return state;
	}
}

export default textbookEditionReducer;
