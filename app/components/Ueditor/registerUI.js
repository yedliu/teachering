const kfIcon = window._baseUrl.imgCdn + '2795357d-614e-4ec5-8955-dc6587c7e15b.png';

export const formatStrHtml = (str) => {
  let newStr = str.replace(/<p style="text-align: center[^>]+>((?:(?!<\/p>)[\s\S])*)<\/p>/g, (e, $1) => {
    // console.log($1, '$1');
    return `<center>${$1}</center>`;
  });
  return newStr.replace(/<p>/g, '').replace(/<\/p>/g, '<br />');
};

const uiNameArr = ['simpleupload', 'anchor', 'link', 'unlink', 'attachment'];
const uiNameCN = ['上传小图', '上传大图', '有下划线的空', '插入空', '插入公式'];
const positionArr = ['-380px 0', '-726px -77px', '-160px -40px', '-240px -20px', '0px 0px'];
const getMsg = {
  getBG: (name) => positionArr[uiNameArr.indexOf(name)],
  getName: (name) => uiNameCN[uiNameArr.indexOf(name)],
};


export const registerui = (UE, input, id, methods = {}, soucre) => {
  UE.registerUI('simpleupload anchor unlink link', (editor, uiName) => {
    editor.registerCommand(uiName, {
      execCommand: () => {
        // alert('execCommand:' + uiName);
        switch (uiName) {
          case 'simpleupload':
            methods.changeState({ imgType: 'small' });
            input.click();
            break;
          case 'anchor':
            methods.changeState({ imgType: 'big' });
            input.click();
            break;
          case 'link':
            methods.insertNode('zmsubline');
            break;
          case 'unlink':
            methods.insertNode('zmblank');
            break;
          case 'attachment':
            methods.showformulaWrapper();
            // methods.replaceNode('center');
            break;
          default:
            break;
        }
      },
    });
    const btn = new UE.ui.Button({
      name: uiName,
      title: getMsg.getName(uiName),
      cssRules: `background-position: ${getMsg.getBG(uiName)}; background-image: ${uiName === 'attachment' ? `url(${kfIcon})!important` : ''};`,
      onclick: () => {
        editor.execCommand(uiName);
      },
    });
    editor.addListener('selectionchange', () => {
      const state = editor.queryCommandState(uiName);
      if (state === -1) {
        btn.setDisabled(true);
        btn.setChecked(false);
      } else {
        btn.setDisabled(false);
        btn.setChecked(state);
      }
    });
    return btn;
  });
};
