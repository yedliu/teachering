export default {
  toolbars: [[
    'bold', 'italic', 'underline', 'wavy', 'strikethrough', /* 'superscript', 'subscript', */ 'spechars', 'removeformat', 'formatmatch', /* 'autotypeset', 'blockquote', 'pasteplain', */'|',
    'insertorderedlist', 'insertunorderedlist', 'forecolor', '|',
    'touppercase', 'tolowercase', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
    'horizontal', 'date', 'time', '|',
    'undo', 'redo',
  ], [
    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
  ]],
  imageActionName: '',
  zIndex: 90,     // 编辑器层级的基数,默认是900
  charset: 'utf-8',
  isShow: true,
  focus: true,
  initialFrameWidth: 708,
  initialFrameHeight: 350,
  enableAutoSave: false,
  pasteplain: true,
  maxListLevel: 3,
  elementPathEnabled: false,
  tabSize: 1,
  tabNode: '<zmIndent contenteditable="false">空类0</zmIndent>',
  removeFormatAttributes: '',
  maxUndoCount: 30,
  autoHeightEnabled: false,
  scaleEnabled: false,
  wordCount: true,
  imagePopup: false,
  maximumWords: 10000,
  insertorderedlist: {
    // decimal: '',          // '1,2,3...'
    // 'lower-alpha': '',      // 'a,b,c...'
    // 'lower-roman': '',      // 'i,ii,iii...'
    // 'upper-alpha': '',      // 'A,B,C'
    // 'upper-roman': '',      //'I,II,III...'
  },
  insertunorderedlist: {
    // dash: '— 破折号', // -破折号
    // dot: ' 。 小圆圈', // 系统自带
    // circle: '',  // '○ 小圆圈'
    // disc: '',    // '● 小圆点'
    // square: '',   //'■ 小方块'
  },
  // scaleEnabled: true,
  // minFrameWidth: 100,
  // minFrameHeight: 180,
  disabledTableInTable: true,
};
