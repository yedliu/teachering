// import { css } from 'styled-components';
// import Katex from 'katex';
import { backfromZmStandPrev, renderToKatex } from 'zm-tk-ace/utils';
// 处理自定义标签转化
// const regbackList = [
//   /zmcolor="(#[^"]{3,6})"/g,
//   /zmalign="([a-zA-Z]+)"/g,
//   /<zmindent><\/zmindent>/g,
//   /<zmblank[^>]*>[^<zm]*<\/zmblank>/g,
//   /<zmsubline[^>]*>[^<zm]*<\/zmsubline>/g,
// ];

// 匹配过滤 html 格式
export const filterHtmlForm = (value) => {
  let res = '';
  if (typeof value === 'string') {
    res = value.replace(/<(?!img)[^>]*>|&nbsp;|\s/g, '');
  } else {
    res = value;
  }
  return res;
};

// export const backfromZmStandPrev = (str) => {
//   if (!str) return '';
//   return str.replace(regbackList[0], 'style="color: $1;"')
//       .replace(regbackList[1], 'style="text-align: $1;"')
//       .replace(regbackList[2], '<zmindent></zmindent>')
//       .replace(regbackList[3], '<zmblank></zmblank>')
//       .replace(regbackList[4], '<zmsubline></zmsubline>')
//       .replace(/<zmsubline><zmsubline><\/zmsubline><\/zmsubline>/g, '<zmsubline></zmsubline>');
// };

// Katex转化
// export const renderToKatex = (str) => {
//   if (!str) return '';
//   const str1 = str.replace(/<zmlatex(\scontenteditable="false")?>([^<zm]*(<zmlatex>[^</zmlatex>]+<\/zmlatex>)[^<zm]*)<\/zmlatex>/g, (e, $1, $2) => `<zmlatex>${$2.replace(/<zmlatex(\scontenteditable="false")?>([^</zmlatex>]+)<\/zmlatex>/g, (res, i$1, i$2) => i$2)}</zmlatex>`);
//   const str2 = str1.replace(/(<zmlatex(\scontenteditable="false")?>)|(<\/zmlatex>)/g, '\\$').replace(/\\\$([^\$]+)\\\$/g, (ev, $1) => {
//       let formulaPaste = '';
//   try {
//     formulaPaste = Katex.renderToString($1.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/, "'").replace(/(\u007e|\u301c)/g, (e, i$1) => `\\text{${i$1}}`).replace(/\s?([\u4e00-\u9fa5]+)/g, (e, y$1) => `\\text{${y$1}}`));
//   } catch (err) {
//     formulaPaste = $1;
//   }
//   // console.log(formulaPaste);
//   return formulaPaste;
// });
// // console.log(str2);
// return str2;
// };

// 处理不同题型，映射到老题型字段 并且做自定义标签转化
export const questionMapper = (questionList, newCate) => {
  console.log('开始转化新题型');
  if (!Array.isArray(questionList)) return;
  questionList.forEach((item) => {
    if (!item.questionEsDto) {
      item.questionEsDto = item.questionOutputDTO;
    }

    const questionEsDto = newCate ? item : item.questionEsDto;
    if ((item.questionSource === 2 || newCate) && questionEsDto) {
      // 新题型处理
      questionEsDto.Content = backfromZmStandPrev(questionEsDto.title);
      questionEsDto.Analyse = backfromZmStandPrev(questionEsDto.analysis);
      questionEsDto.answerList = questionEsDto.answerList ? questionEsDto.answerList.map(it => backfromZmStandPrev(it)) : [];
      let cate = 0; // 只有1是选择题
      let optionList = questionEsDto.optionList;
      questionEsDto.Options = optionList;
      if (Array.isArray(optionList) && optionList.length > 0) {
        optionList = optionList.map(it => backfromZmStandPrev(it)).filter(it => filterHtmlForm(it));
        optionList.length > 0 ? cate = 1 : '';
      }
      questionEsDto.Cate = cate;
      questionEsDto.CateName = questionEsDto.questionType;
      questionEsDto.knowledgeIds = questionEsDto.knowledgeIdList;
      questionEsDto.ID = String(questionEsDto.id);
      questionEsDto.Year = questionEsDto.year;
      questionEsDto.Subject = questionEsDto.subjectId;
    }
  });
};

// 处理新题型的展示方式
export const handleAnswersList = (list, func) => {
  if (!Array.isArray(list)) return '';
  return list.map((answer, i) => {
    let content = answer.replace('<p>', `<p>${i + 1}、`);
    return func ? func(content) :  content;
  }).join('');
};

export const getQueryString = () => {
  let qs = location.search.substr(1);// 获取url中"?"符后的字串
  let args = {};// 保存参数数据的对象
  let items = qs.length ? qs.split('&') : [];// 取得每一个参数项,
  let  item = null;
  let  len = items.length;

  for (let i = 0; i < len; i++) {
    item = items[i].split('=');
    let name = decodeURIComponent(item[0]);
    let value = decodeURIComponent(item[1]);
    if (name) {
      args[name] = value;
    }
  }
  return args;
};

export const chooseFont = (id) => {
  let res = '"KaTeX_Math", "思源黑体 CN Normal", "Microsoft YaHei"';
  if (id === 1) {
    res = '"思源黑体 CN Normal", "Microsoft YaHei"';
  } else if (id === 3) {
    res = '"Arial", "思源黑体 CN Normal", "Microsoft YaHei"';
  }
  return res;
};

export { backfromZmStandPrev, renderToKatex };
