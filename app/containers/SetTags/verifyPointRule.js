/**
 * 部分年级学科下会对考点不做考点的校验
 */
export const pointToUnity = (subjectId, gradeId) => {
  return ([1, 3, 11]
    .includes(subjectId) || ([1, 2, 3, 4, 5, 6]
      .includes(gradeId) && subjectId === 2) || ([7, 8, 9]
        .includes(gradeId) && [6, 7, 8, 9]
          .includes(subjectId)));
};
