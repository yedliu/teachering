import React from 'react';
import styled from 'styled-components';
import Ueditor from 'components/Ueditor';


const UEditorWrapper = styled.div`
  .edui-editor-iframeholder{
    height: 140px !important;
  }
`;

const defaultConfig = {
  toolbars: [[
    'bold', 'italic', 'underline', 'wavy', 'strikethrough', 'spechars', 'removeformat', 'formatmatch', '|',
    'insertorderedlist', 'insertunorderedlist', 'forecolor', '|',
    'touppercase', 'tolowercase', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
    'horizontal', '|',
    'undo', 'redo',
  ], [
    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
    'formulakatex',
  ]],
  // imageActionName: '',
  zIndex: 900,     // 编辑器层级的基数,默认是900
  charset: 'utf-8',
  isShow: true,
  focus: true,
  initialFrameWidth: '100%',
  enableAutoSave: false,
  pasteplain: true,
  maxListLevel: 3,
  elementPathEnabled: false,
  tabSize: 1,
  removeFormatAttributes: '',
  maxUndoCount: 30,
  autoHeightEnabled: true,
  autoTransWordToList: true,
  scaleEnabled: false,
  wordCount: false,
  allowDivTransToP: false,
  imagePopup: true,
  disabledTableInTable: true,
};

class Editor extends React.Component {
  render() {
    const {
      source,
      saveEditorData,
      initOver,
    } = this.props;

    return (
      <UEditorWrapper>
        <Ueditor
          soucre={source}
          id="teacher-certification-question"
          height={120}
          editorheight="auto"
          editorWidth="100%"
          editorMargin="0"
          saveEditorData={saveEditorData}
          initOver={initOver}
          option={{ ...defaultConfig }}
        />
      </UEditorWrapper>
    );
  }
}

export default Editor;
