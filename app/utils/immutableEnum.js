import { fromJS } from 'immutable';

export const difficultyList = fromJS([
  { id: 1, name: '一级' },
  { id: 2, name: '二级' },
  { id: 3, name: '三级' },
  { id: 4, name: '四级' },
  { id: 5, name: '五级' }
]);

export const purposeList = fromJS([
  { id: '1', name: '线上测评' },
  { id: '2', name: '本地化教研' },
  { id: '3', name: '估分' },
]);

export const onlineFlagTypes = fromJS([{ id: 1, name: '编辑中' }, { id: 2, name: '已上架' }]);

export const paperTypeList = fromJS([
  { id: 1, name: '同步测试', paperFields: ['subjectId', 'year', 'gradeId', 'termId', 'difficulty', 'editionId', 'teachingEditionId', 'businessCardId', 'purpose'] },
  { id: 2, name: '单元测试', paperFields: ['subjectId', 'year', 'gradeId', 'termId', 'difficulty', 'editionId', 'teachingEditionId', 'businessCardId', 'purpose'] },
  { id: 3, name: '专题试卷', paperFields: ['subjectId', 'year', 'gradeId', 'termId', 'difficulty', 'editionId', 'teachingEditionId', 'purpose'] },
  { id: 4, name: '月考试卷', paperFields: ['subjectId', 'year', 'gradeId', 'termId', 'difficulty', 'editionId', 'teachingEditionId', 'businessCardId', 'purpose'] },
  { id: 5, name: '开学考试', paperFields: ['subjectId', 'year', 'gradeId', 'termId', 'difficulty', 'provinceId', 'cityId', 'countyId', 'editionId', 'teachingEditionId', 'purpose'] },
  { id: 6, name: '期中考试', paperFields: ['subjectId', 'year', 'gradeId', 'termId', 'difficulty', 'provinceId', 'cityId', 'countyId', 'editionId', 'teachingEditionId', 'businessCardId', 'purpose'] },
  { id: 7, name: '期末考试', paperFields: ['subjectId', 'year', 'gradeId', 'termId', 'difficulty', 'provinceId', 'cityId', 'countyId', 'editionId', 'teachingEditionId', 'businessCardId', 'purpose'] },
  { id: 8, name: '水平会考', paperFields: ['subjectId', 'year', 'gradeId', 'termId', 'difficulty', 'provinceId', 'cityId', 'countyId', 'purpose'] },
  { id: 9, name: '竞赛测试', paperFields: ['subjectId', 'gradeId', 'year', 'provinceId', 'cityId', 'countyId', 'purpose'] },
  { id: 10, name: '高考模拟', paperFields: ['subjectId', 'year', 'provinceId', 'cityId', 'countyId', 'examTypeId', 'businessCardId', 'purpose'] },
  { id: 11, name: '高考真题', paperFields: ['subjectId', 'year', 'provinceId', 'cityId', 'countyId', 'examTypeId', 'purpose'] },
  { id: 12, name: '自主招生', paperFields: ['subjectId', 'gradeId', 'year', 'provinceId', 'cityId', 'countyId', 'purpose', 'teachingEditionId'] },
  { id: 13, name: '中考模拟', paperFields: ['subjectId', 'year', 'provinceId', 'cityId', 'countyId', 'examTypeId', 'businessCardId', 'purpose'] },
  { id: 14, name: '中考真题', paperFields: ['subjectId', 'year', 'provinceId', 'cityId', 'countyId', 'examTypeId', 'purpose'] },
  { id: 15, name: '小升初', paperFields: ['subjectId', 'gradeId', 'year', 'provinceId', 'cityId', 'countyId', 'purpose'] },
  { id: 16, name: '重点自测', paperFields: ['subjectId', 'gradeId', 'termId', 'year', 'difficulty', 'editionId', 'teachingEditionId', 'businessCardId', 'purpose'] },
  { id: 17, name: '随堂测试', paperFields: ['subjectId', 'gradeId', 'termId', 'year', 'difficulty', 'editionId', 'teachingEditionId', 'businessCardId', 'purpose'] },
]);

export const contentTypeMap = fromJS({
  '1': 'richText', // 富文本
  '2': 'text', // 纯文本
  '3': 'img', // 图片
  '4': 'audio', // 音频
  '5': 'video', // 视频
});
