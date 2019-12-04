import { getAllPhase, getSubject, getGrade, getEdition } from './server';
export const makeFilterConfig = async (data, phaseId, subjectId) => {
  let config = data.config;
  let grades = data.grades;
  let editions = data.editons;
  let defaultPhase = phaseId; // 默认初中数学
  let defaultSubject = subjectId;
  // if (phaseId >= 0) {
  //   defaultPhase = phaseId;
  //   defaultSubject = void 0;
  // }
  // if (subjectId >= 0) {
  //   defaultPhase = phaseId;
  //   defaultSubject = subjectId;
  // }
  console.log(phaseId, subjectId);
  await getAllPhase().then(res => {
    if (res.length > 0) {
      config.forEach(item => {
        if (item.key === 'phaseId') {
          item.options = res;
          item.value = defaultPhase;
        }
      });
    }
  });
  if (defaultPhase >= 0) {
    // 获取学科
    await getSubject({ phaseId: defaultPhase }).then(res => {
      if (res.length > 0) {
        config.forEach(item => {
          if (item.key === 'subjectId') {
            item.options = res;
            item.value = defaultSubject;
          }
        });
      }
    });
    // 获取年级
    await getGrade(defaultPhase).then(res => {
      grades = res.map(g => {
        return { value: g.id, label: g.name };
      });
    });
  } else {
    grades = [];
    config.forEach(item => {
      if (item.key === 'subjectId') {
        item.options = [];
        item.value = void 0;
      }
    });
  }
  // 获取版本
  if (defaultSubject >= 0) {
    await getEdition({ phaseId: defaultPhase, subjectId: defaultSubject }).then(res => {
      editions = res.map(item => {
        return {
          value: item.id,
          label: item.name
        };
      });
    });
  } else {
    editions = [];
  }
  return { config, grades, editions };
};
