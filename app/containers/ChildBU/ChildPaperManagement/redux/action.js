import * as contants from './contants';

export const getSubjectList = (params = {}) => ({
  type: contants.GET_SUBJECT_LIST,
  params,
});

export const getQuestionTypeList = (params = {}) => ({
  type: contants.GET_QUESTION_TYPE_LIST,
  params,
});

export const getPaperTypeList = (params = {}) => ({
  type: contants.GET_PAPER_TYPE_LIST,
  params,
});

export const getPaperDifficulty = (params = {}) => ({
  type: contants.GET_DIFFICULTY_LIST,
  params,
});

export const getYearList = (params = {}) => ({
  type: contants.GET_YEAR_LIST,
  params,
});

export const getEditionList = (params = {}) => ({
  type: contants.GET_EDITION_LIST,
  params,
});

export const getCourseSystemList = (params = {}) => ({
  type: contants.GET_COURSE_SYSTEM,
  params,
});

export const getStateList = (params = {}) => ({
  type: contants.GET_STATE_LIST,
  params,
});

export const setListData = (data, dataType) => ({
  type: contants.SET_LIST_DATA,
  data,
  dataType,
});

export const changePage = page => ({
  type: contants.CHANGE_PAGE,
  data: page,
});

export const setPaperParams = (key, value) => ({
  type: contants.SET_PAPER_PARAMS,
  key,
  value
});

export const setPaperData = paperData => ({
  type: contants.SET_PAPER_DATA,
  data: paperData,
});

export const setSelectedId = id => ({
  type: contants.SET_SELECTED_ID,
  id,
});

export const toggleShowAnswer = ids => ({
  type: contants.TOGGLE_SHOW_ANSWER,
  ids,
});

export const setEditScoreData = data => ({
  type: contants.SET_EDIT_SCORE_DATA,
  data,
});

export const setQuestionScore = (ids, score) => ({
  type: contants.SET_QUESTION_SCORE,
  ids,
  score
});

export const deleteBigQuestion = (index) => ({
  type: contants.DELETE_BIG_QUESTION,
  index,
});

export const deleteSmallQuestion = (id) => ({
  type: contants.DELETE_SMALL_QUESTION,
  id,
});

export const orderQuestion = (id, orderType, index) => ({
  type: contants.ORDER_QUESTION,
  id,
  orderType,
  index
});

export const saveExamPaper = () => ({
  type: contants.SAVE_EXAM_PAPER
});

export const showAddQuestion = (status) => ({
  type: contants.SHOW_ADD_QUESTION_MODAL,
  status
});

export const setErrorMessage = (message) => ({
  type: contants.SER_ERROR_MESSAGE,
  message
});

export const setAllPaperParams = (data) => ({
  type: contants.ALL_PAPER_PARAMS,
  data
});

export const setSearchParams  = (key, value) => ({
  type: contants.SET_SEARCH_PARAMS,
  key,
  value,
});

export const getPaperList = (params) => ({
  type: contants.GET_EXAM_PAPER_LIST,
  params
});

export const setPaperList = (data) => ({
  type: contants.SET_EXAM_PAPER_LIST,
  data
});

export const deletePaper = (id) => ({
  type: contants.DETELE_PAPER,
  id
});

export const changeOnlineFlag = (isOffline, id) => ({
  type: contants.CHANGE_PAPER_ONLINE_FLAG,
  isOffline,
  id
});

export const getPaperDetail = (id, nextType) => ({
  type: contants.GET_EXAM_PAPER_DETAIL,
  id,
  nextType,
});

export const togglePaperPreview = (status) => ({
  type: contants.TOGGLE_PAPER_PREVIEW,
  status,
});

export const setPaperListLoading = (loading) => ({
  type: contants.SET_PAPER_LIST_LOADING,
  loading,
});

export const setPaperListTotal = (total) => ({
  type: contants.SET_PAPER_LIST_TOTAL,
  total,
});
export const setSpining = (spinning) => ({
  type: contants.SET_SPINNING,
  spinning,
});

export const showAllAnswer = (status) => ({
  type: contants.SHOW_ALL_ANSWER,
  status
});