window.addEventListener('load', function () {
  const menu = $G('menu');
  const latex = $G('latex');
  const textarea = $G('formula-edit');
  const preView = $G('formula-preview');

  let targetSubject = 'defaultFormulaList'; // 当前的学科
  let selection = { start: 0, end: 0, value: '' };  // range
  let formulaData = ''; // 编辑中的 latex
  let formatFormula = ''; // 解析后公式


  const compatibleList = [
    [/\\xLongequal/g, '\\xlongequal'],
    // [/\{array\}/ig, '{matrix}'] 无需此兼容，之前tr的问题是字体未更新导致
  ];
  /**
   * 用于处理 katex 升级的兼容处理
   */
  const compatibleForKatexUpgrade = (str = '') => {
    let res = str;
    compatibleList.forEach((regRec) => {
      res = res.replace(regRec[0], regRec[1]);
    });
    return res;
  };


  const setMenu = () => {
    const subjectStr = `defaultFormulaList:基础,chemistry:化学,physics:物理,biological:生物,math0:小学数学,math1:初中数学,math2:高中数学`;
    const menuStr = subjectStr.split(',').map(item => {
      const subjectItem = item.split(':');
      const subject = subjectItem[0];
      const subjectName = subjectItem[1];
      return `<div data-subject="${subject}" class="${subject === targetSubject ? 'menu-item active' : 'menu-item'}">${subjectName}</div>`;
    }).join('');
    menu.innerHTML = menuStr;
  };

  let changeLatex = () => {
    latex.innerHTML = `${window._latex[targetSubject].map((it, index) => {
      let formulaHtmlStr = it;
      try {
        formulaHtmlStr = katex.renderToString(compatibleForKatexUpgrade(it));
      } catch (err) {
        // 打印报错信息以便定位报错公式
        console.warn(err);
        formulaHtmlStr = 'formatError';
      }
      return `<div class="latex-item">
        ${formulaHtmlStr}
        <div class="latex-item-mask" data-index=${index}></div>
      </div>`;
    }).join('')}`;
  };

  let setRange = () => {
    if (typeof textarea.selectionStart === 'number' && textarea.selectionStart >= 0) {
      if (formulaData.replace(/\s/g, '').length > 0) {
        selection = {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
          value: textarea.value || '',
        };
      } else {
        selection = { start: 0, end: 0, value: '' };
      }
    }
  };

  let renderString = (value) => {
    // console.log('renderString: ', value);
    try {
      formatFormula = katex.renderToString(compatibleForKatexUpgrade(value));
      formulaData = value || '';
      dialog.formulaData = utils.trim(formulaData || ''); // 借由dialog上属性将数据传递出去
    } catch (err) {
      formatFormula = '解析失败';
      formulaData = value;
      dialog.formulaData = '';
    }
    preView.innerHTML = formatFormula;
  };

  let insertFormula = (txt) => {
    let value = `${(selection.value || '').slice(0, selection.start)}${txt}${(selection.value || '').slice(selection.end)}` || '';
    selection = {
      start: selection.start + txt.length,
      end: selection.end + txt.length,
      value,
    };
    renderString(value);
    textarea.value = formulaData;
  };

  function init() {

    setMenu();
    changeLatex();

    textarea.addEventListener('click', (e) => {
      setRange();
    });
    textarea.addEventListener('change', (e) => {
      if (e.target.value === '') {
        formatFormula = '';
        formulaData = '';
        dialog.formulaData = ''; // 借由dialog上属性将数据传递出去
      }
    });
    textarea.addEventListener('keyup', (e) => {
      // console.log(e.keyCode, e)
      if ([13, 32, 37, 38, 39, 40].includes(e.keyCode)) {
        // let value = e.target.value || '';
        // if (value === '') {
        //   renderString(''); // 如果公式为空的话，记得清空
        // }
        setRange();
        // renderString(value);
      } else {
        let value = e.target.value || '';
        setRange();
        renderString(value);
      }
    });
    menu.addEventListener('click', (e) => {
      let target = e.target;
      if (target.className.includes('menu-item')) {
        targetSubject = target.dataset.subject;
        setMenu();
        changeLatex();
      }
    });

    latex.addEventListener('click', (e) => {
      // console.dir(e);
      const index = e.target.dataset['index'];
      const formula = window._latex[targetSubject][index];
      if (formula) {
        insertFormula(formula);
        // textarea.focus();
        // setRange();
      } else {
        console.warn('请正确的选择公式');
      }
    });

    let target = null;
    const setTextAreaRange = function (e) {
      if (e.target === target) {
        setRange();
      }
      document.removeEventListener('keyup', setTextAreaRange);
    };
    latex.addEventListener('keydown', (e) => {
      target = e.target;
      document.addEventListener('keyup', setTextAreaRange);
    });
  }

  init();

});