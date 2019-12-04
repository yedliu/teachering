/*
 *
 * TextbookEdition actions
 *
 */

import {
	DEFAULT_ACTION,
	SET_PHASE_LIST_ACTION,
	GET_PHASE_LIST_ACTION,
	SET_PHASE_ACTION,
	SET_SUBJECT_LIST_ACTION,
	SET_SUBJECT_ACTION,
	GET_SUBJECT_LIST_ACTION,
	SET_GRADE_LIST_ACTION,
	SET_GRADE_ID_ACTION,
	GET_GRADE_LIST_ACTION,
	GET_GRADE_ACTION,
	SET_SUBJECT_ID_ACTION,
	GET_SUBJECT_ACTION,
	SET_SUBJECT_EDITION_LIST,
	SET_ADD_NEW,
	SET_INPUT_CHANGE_ACTION,
	SET_TEXTBOOK_LIST_ACTION,
	GET_TEXTBOOK_LIST_ACTION,
	SET_TEXTBOOK_ACTION,
	SAVE_TEXTBOOK_ACTION,
	SET_CRUD_ID_ACTION,
	DELETE_ACTION,
	SET_EDITION_LIST_ACTION,
	GET_EDITION_LIST_ACTION,
	SET_EDITION_ID_ACTION,
	SET_KNOWLEDGE_LIST_ACTION,
	GET_KNOWLEDGE_LIST_ACTION,
	SET_INPUT_DTO_ACTION,
	SET_KNOWLEDGE_ACTION,
	GET_KNOWLEDGE_ACTION,
	SET_KNOWLEDGE_CRUD_ID_ACTION,
	SET_SELECTED_KNOWLEDGE_LIST_ACTION,
	GET_SELECTED_KNOWLEDGE_LIST_ACTION,
	SET_FIRST_NODE_LSIT_ACTION,
	SET_FIRST_NODE_ID_ACTION,
	GET_FIRST_NODE_LSIT_ACTION,
	SET_ADD_EXIST,
	SAVE_ACTION,
	DELETE_NODE_ACTION,
	SET_SECOND_NODE_LSIT_ACTION,
	GET_SECOND_NODE_LSIT_ACTION,
	SET_SECOND_NODE_ID_ACTION,
	SET_THREE_NODE_LIST_ACTION,
	GET_THREE_NODE_LIST_ACTION,
	SET_THREE_NODE_ID_ACTION,
	SET_FOUR_NODE_LIST_ACTION,
	GET_FOUR_NODE_LIST_ACTION,
	SET_FOUR_NODE_ID_ACTION,
	SET_MODAL_ATTR_ACTION,
	DELETE_LEVEL_ACTION,
	SET_ADD_LEVEL_ACTION,
	SORT_ACTION
} from './constants';

export function defaultAction() {
	return {
		type: DEFAULT_ACTION
	};
}

export function setAddNew(models) {
	return {
		type: SET_ADD_NEW,
		models
	};
}

export function setTextbookListAction(textbookList) {
	return {
		type: SET_TEXTBOOK_LIST_ACTION,
		textbookList
	};
}

export function getTextbookListAction() {
	return {
		type: GET_TEXTBOOK_LIST_ACTION
	};
}

export function setTextbookAction(textbook) {
	return {
		type: SET_TEXTBOOK_ACTION,
		textbook
	};
}

export function setInputChangeAction(inputList) {
	return {
		type: SET_INPUT_CHANGE_ACTION,
		inputList
	};
}

export function getPhaseListAction() {
	return {
		type: GET_PHASE_LIST_ACTION
	};
}

export function setPhaseListAction(phaseList) {
	return {
		type: SET_PHASE_LIST_ACTION,
		phaseList
	};
}

export function setPhaseAction(phase) {
	return {
		type: SET_PHASE_ACTION,
		phase
	};
}

export function setSubjectListAction(subjectList) {
	return {
		type: SET_SUBJECT_LIST_ACTION,
		subjectList
	};
}

export function getSubjectListAction() {
	return {
		type: GET_SUBJECT_LIST_ACTION
	};
}

export function getSubjectAction() {
	return {
		type: GET_SUBJECT_ACTION
	};
}

export function setSubjectAction(subject) {
	return {
		type: SET_SUBJECT_ACTION,
		subject
	};
}

export function setGradeListAction(gradeList) {
	return {
		type: SET_GRADE_LIST_ACTION,
		gradeList
	};
}

export function setSubjectEditionList(subjectEditionList) {
	return {
		type: SET_SUBJECT_EDITION_LIST,
		subjectEditionList
	};
}

export function setGradeIdAction(gradeId) {
	return {
		type: SET_GRADE_ID_ACTION,
		gradeId
	};
}

export function getGradeListAction() {
	return {
		type: GET_GRADE_LIST_ACTION
	};
}

export function getGradeAction() {
	return {
		type: GET_GRADE_ACTION
	};
}

export function setSubjectIdAction(subjectId) {
	return {
		type: SET_SUBJECT_ID_ACTION,
		subjectId
	};
}

export function saveTextbookAction() {
	return {
		type: SAVE_TEXTBOOK_ACTION
	};
}

export function setCrudIdAction(crudId) {
	return {
		type: SET_CRUD_ID_ACTION,
		crudId
	};
}

export function deleteAction() {
	return {
		type: DELETE_ACTION
	};
}

export function setEditionListAction(editionList) {
	return {
		type: SET_EDITION_LIST_ACTION,
		editionList
	};
}

export function getEditionListAction() {
	return {
		type: GET_EDITION_LIST_ACTION
	};
}

export function setEditionIdAction(editionId) {
	return {
		type: SET_EDITION_ID_ACTION,
		editionId
	};
}

export function setKnowledgeListAction(knowledgeList) {
	return {
		type: SET_KNOWLEDGE_LIST_ACTION,
		knowledgeList
	};
}

export function getKnowledgeListAction() {
	return {
		type: GET_KNOWLEDGE_LIST_ACTION
	};
}

export function getSelectedKnowledgeListAction() {
	return {
		type: GET_SELECTED_KNOWLEDGE_LIST_ACTION
	};
}

export function setSelectedKnowledgeListAction(selectedKnowledgeList) {
	return {
		type: SET_SELECTED_KNOWLEDGE_LIST_ACTION,
		selectedKnowledgeList
	};
}

export function getKnowledgeAction() {
	return {
		type: GET_KNOWLEDGE_ACTION
	};
}

export function setKnowledgeAction(knowledge) {
	return {
		type: SET_KNOWLEDGE_ACTION,
		knowledge
	};
}

export function setKnowledgeCrudIdAction(knowledgeCrudId) {
	return {
		type: SET_KNOWLEDGE_CRUD_ID_ACTION,
		knowledgeCrudId
	};
}

export function setInputDtoAction(inputDto) {
	return {
		type: SET_INPUT_DTO_ACTION,
		inputDto
	};
}

export function setFirstNodeListAction(firstNodeList) {
	return {
		type: SET_FIRST_NODE_LSIT_ACTION,
		firstNodeList
	};
}

export function setFirstNodeIdAction(firstNodeId) {
	return {
		type: SET_FIRST_NODE_ID_ACTION,
		firstNodeId
	};
}

export function getFirstNodeListAction() {
	return {
		type: GET_FIRST_NODE_LSIT_ACTION
	};
}

export function setSecondNodeListAction(secondNodeList) {
	return {
		type: SET_SECOND_NODE_LSIT_ACTION,
		secondNodeList
	};
}

export function getSecondNodeListAction() {
	return {
		type: GET_SECOND_NODE_LSIT_ACTION
	};
}

export function setSecondNodeIdAction(secondNodeId) {
	return {
		type: SET_SECOND_NODE_ID_ACTION,
		secondNodeId
	};
}

export function setThreeNodeListAction(threeNodeList) {
	return {
		type: SET_THREE_NODE_LIST_ACTION,
		threeNodeList
	};
}

export function getThreeNodeListAction() {
	return {
		type: GET_THREE_NODE_LIST_ACTION
	};
}

export function setThreeNodeIdAction(threeNodeId) {
	return {
		type: SET_THREE_NODE_ID_ACTION,
		threeNodeId
	};
}

export function setAddExit(addExist) {
	return {
		type: SET_ADD_EXIST,
		addExist
	};
}

export function setFourNodeListAction(fourNodeList) {
	return {
		type: SET_FOUR_NODE_LIST_ACTION,
		fourNodeList
	};
}

export function getFourNodeListAction() {
	return {
		type: GET_FOUR_NODE_LIST_ACTION
	};
}

export function setFourNodeIdAction(fourNodeId) {
	return {
		type: SET_FOUR_NODE_ID_ACTION,
		fourNodeId
	};
}

export function saveAction() {
	return {
		type: SAVE_ACTION
	};
}

export function deleteNodeAction() {
	return {
		type: DELETE_NODE_ACTION
	};
}

export function setModalAttrAction(modalAttr) {
	console.log(modalAttr.toJS(), 'setModalAttrAction');
	return {
		type: SET_MODAL_ATTR_ACTION,
		modalAttr
	};
}

export function deleteLevelAction(id) {
	return {
		type: DELETE_LEVEL_ACTION,
		id
	};
}

export function setAddLevelAction(addLevel) {
	return {
		type: SET_ADD_LEVEL_ACTION,
		addLevel
	};
}

export function sortAction(va) {
	return {
		type: SORT_ACTION
	};
}
