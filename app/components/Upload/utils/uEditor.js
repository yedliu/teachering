// import Katex from 'katex';
// import { characterChange } from './characterChange';
import { renderToKatex } from 'zm-tk-ace/utils';
/**
 * 是否需要增加序号
 * @param {*} subject
 * @param {*} questionType
 */
// function isNeedIndexNo(subject, questionType) {
//   if (subject && ESubjects.英语 === subject) {
//     if ([QuestionType['完形填空'], QuestionType['七选五'], QuestionType['任务型阅读']].includes(questionType)) {
//       return true;
//     }
//   }
//   return false;
// }

/**
 * 渲染
 * @param {} str
 */
// export const RenderKatex = (str, subject, questionType) => {
//   const str1 = str.replace(/<zmlatex(\scontenteditable="false")?>([^<zm]*(<zmlatex>[^</z]+<\/zmlatex>)[^</zm]*)<\/zmlatex>/g, (e, $1, $2) => `<zmlatex>${$2.replace(/<zmlatex(\scontenteditable="false")?>([^</zmlatex>]+)<\/zmlatex>/g, (res, i$1, i$2) => i$2)}</zmlatex>`).replace(/&nbsp;/, '');
//   const str2 = str1.replace(/(<zmlatex(\scontenteditable="false")?>)|(<\/zmlatex>)/g, '\\$').replace(/\\\$([^\$]+)\\\$/g, (ev, $1) => {
//     let formulaPaste = '';
//     try {
//       formulaPaste = Katex.renderToString(characterChange($1).replace(/(\u007e|\u301c)/g, (e, i$1) => `\\text{${i$1}}`).replace(/\s?([\u4e00-\u9fa5]+)/g, (e, y$1) => `\\text{${y$1}}`));
//     } catch (err) {
//       formulaPaste = $1;
//     }
//     return formulaPaste;
//   });
//
//   if (isNeedIndexNo(subject, questionType)) {
//     let i = 0;
//     const reg = /<zmsubline[^>]*>[^<zm]*<\/zmsubline>/g;
//     return str2.replace(reg, () => {
//       i += 1;
//       return `<zmsubline style='color:#000;'>${i}</zmsubline>`;
//     });
//   }
//   return str2;
// };
// const renderToKatex = (str) => {
//   return RenderKatex(backfromZmStand(str || ''));
// };

export {
  renderToKatex,
};
