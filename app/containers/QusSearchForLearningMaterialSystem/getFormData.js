import React from 'react';
import gradeApi from 'api/tr-cloud/grade-endpoint';
import subjectApi from 'api/tr-cloud/subject-endpoint';
import phaseSubjectApi from 'api/tr-cloud/phase-subject-endpoint';
import knowledgeApi from 'api/tr-cloud/knowledge-endpoint';
import editionApi from 'api/tr-cloud/edition-endpoint';
import courseSystemApi from 'api/tr-cloud/course-system-endpoint';
import HomeworkApi from 'api/hw-cloud/homework-endpoint';
import queryNodes from 'api/qb-cloud/sys-dict-end-point';
import termApi from 'api/tr-cloud/term-endpoint';
import regionApi from 'api/qb-cloud/region-end-point';
import textBookEditionApi from 'api/tr-cloud/textbook-edition-endpoint';
import examApi from 'api/qb-cloud/exam-paper-end-point';

const requestTimeOut = 3 * 1000;

export default PackagedComponent => {
  const getQbFormData = async (type = 'init', paramsList = []) => {
    if (type === 'init') {
      return Promise.all([phaseSubjectApi.findAllPhaseSubject(), gradeApi.getGrade()]);
    } else if (type === 'phaseSubject') {
      return phaseSubjectApi.findAllPhaseSubject();
    } else if (type === 'grade') {
      return gradeApi.getGrade();
    } else if (type === 'knowledge') {
      return knowledgeApi.findAllByPhaseSubjectIdForTr(paramsList[0] || {});
    } else if (type === 'question') {
      return questionAip.getQuestionWithEncryptForTr({
        ...paramsList[0], excludeInfo: {
          excludeTypeIdList: [50, 51, 52],
        }
      }, requestTimeOut);
    }
  };
  const getFormDataForHw = async (type = 'init', paramsList = []) => {
    if (type === 'init') {
      return Promise.all([gradeApi.getGrade()]);
    } else if (type === 'subject') {
      return subjectApi.getSubjectByGradeId(paramsList[0]);
    } else if (type === 'edition') {
      return editionApi.getEdition(paramsList[0]);
    } else if (type === 'courseSystem') {
      return courseSystemApi.getClassType(paramsList[0]);
    } else if (type === 'homework') {
      return HomeworkApi.getHomework(paramsList[0]);
    } else if (type === 'homeworkItem') {
      return HomeworkApi.getHomeworkItemById(paramsList[0]);
    }
  };
  const getFormDataForPaper = async (type = 'init', paramsList = []) => {
    if (type === 'init') {
      // 试卷类型、试卷难度、年份、卷型、试卷名片
      // 年级
      // 学科
      // 学期
      return Promise.all([
        queryNodes.queryNodesByGroupList(['QB_EXAM_PAPER_TYPE', 'QB_EXAM_PAPER_DIFFICULTY', 'QB_YEAR', 'QB_EXAM_TYPE', 'QB_PAPER_CARD']),
        gradeApi.getGrade(),
        termApi.getAllTerm(),
        regionApi.getProvince(),
      ]);
    } else if (type === 'subject') {
      return subjectApi.getSubjectByGradeId(paramsList[0]);
    } else if (type === 'textbookEditionAndEdition') {
      return Promise.all([textBookEditionApi.getTextbookEdition(paramsList[0]), editionApi.getEdition(paramsList[0])]);
    } else if (type === 'city') { // 市
      return regionApi.getCityByProvinceId(paramsList[0]);
    } else if (type === 'county') { // 县/区
      return regionApi.getCountyByCityId(paramsList[0]);
    } else if (type === 'textbookEdition') { // 教材版本
      return textBookEditionApi.getTextbookEdition(paramsList[0]);
    } else if (type === 'edition') { // 版本（课程内容版本）
      return editionApi.getEdition(paramsList[0]);
    } else if (type === 'examPaper') { // 试卷列表
      return examApi.findAssembleExamPaper(paramsList[0]);
    } else if (type === 'paperItem') { // 单份试卷内容
      return examApi.getOnePaper(paramsList[0]);
    }
  };
  return (
    class extends React.Component {
      render() {
        return (
          <PackagedComponent
            getFormDataForQb={getQbFormData}
            getFormDataForHw={getFormDataForHw}
            getFormDataForPaper={getFormDataForPaper}
            {...this.props}
          />
        );
      }
    }
  );
};