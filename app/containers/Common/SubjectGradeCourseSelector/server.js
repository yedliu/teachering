import subjectApi from 'api/tr-cloud/subject-endpoint';
import editionApi from 'api/tr-cloud/zm-child-edition-endpoint';
import { handleRequest } from 'utils/helpfunc.js';


export const getChildSubjectGrade = () => {
  return handleRequest(subjectApi.getChildSubjectGrade);
};
export const getEdition = (params) => {
  return handleRequest(editionApi.getEdition, { params });
};
export const getCourse = (params) => {
  return handleRequest(subjectApi.getChildCourses, { params });
};

