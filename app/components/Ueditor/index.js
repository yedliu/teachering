/* eslint-disable react/no-string-refs */
/**
 *
 * Ueditor Components
 *
 */

import React, { PropTypes } from 'react';
import styled from 'styled-components';
import AppLocalStorage from 'utils/localStorage';
import Config from 'utils/config';
import { registerui } from './registerUI';
import UeditorConfig from './config';
import { Modal as AntModel } from 'antd';
import FormulaToImg from 'components/FormulaToImg';
const EditorWrapper = styled.div`
  width: ${props => (props.width ? props.width : '708px')};
  height: ${props => (props.height ? props.height : '430px')};
  margin: ${props => (props.margin ? props.margin : '20px auto 0')};
  #content {
    height: 430px;
    #edui1 {
      height: 100%;
      /* 由于影响到录入处的编辑器高度显示，故注释掉，如有影响到请协调处理， change by yinjie.zhang on 2019.10.10 */
      /* max-height: 300px !important; */
    }
    .edui-editor-toolbarbox {
      top: 0;
      left: 0;
    }
  }
`;

class Ueditor extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeState = this.changeState.bind(this);
    this.insertEmpty = this.insertEmpty.bind(this);
    this.insertNode = this.insertNode.bind(this);
    this.replaceNode = this.replaceNode.bind(this);
    this.getEditorContent = this.getEditorContent.bind(this);
    this.state = {
      ueditorContent: '',
      imgType: '',
      blankCount: 0,
      currentFormula: '',
      showImgModal: false
    };
  }
  componentDidMount() {
    this.initEditor();
    // console.dir(this.refs.input);
    this.refs.input.onchange = () => {
      const input = this.refs.input;
      // console.dir(input);
      // console.dir(e);
      const form = new FormData();
      form.append('file', input.files[0]);
      // console.log(form, 'form');
      fetch(`${Config.trlink_qb}/api/question/fileUpload`, {
        method: 'POST',
        headers: {
          mobile: AppLocalStorage.getMobile(),
          password: AppLocalStorage.getPassWord(),
        },
        body: form,
      })
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (res && res.code.toString() === '0') {
            this.editor.execCommand('insertimage', {
              src: res.data,
              zmType: this.state.imgType,
            });
          } else {
            alert(res.message || '图片上传失败！');
          }
        });
    };
  }
  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    window.UE.delEditor(this.props.id);
  }
  changeState(item) {
    this.setState(item);
    // console.log(this.state);
  }
  insertEmpty() {
    console.log('insertEmpty');
  }
  insertNode(nodeName, attr) {
    const editor = this.editor;
    // console.log(editor);
    let blankType = 1;
    if (nodeName === 'zmblank') {
      blankType = 1;
    } else {
      blankType = 2;
    }
    editor.execCommand(
      'insertHtml',
      `<${nodeName} contenteditable="false">空类${blankType}</${nodeName}>`,
    );
    // }
  }
  replaceNode(nodeName, attr) {
    const range = this.editor.selection.getRange();
    const parentElement = range.startContainer.parentElement;
    // console.dir(parentElement);
    const content = parentElement.innerHTML;
    if (parentElement.nodeName === 'P') {
      parentElement.innerHTML = '';
      // parentElement.focus();
      this.editor.execCommand(
        'insertHtml',
        `<${nodeName}>${content.toString()}</${nodeName}>`,
      );
    } else if (parentElement.nodeName === 'CENTER') {
      parentElement.innerHTML = '';
      this.editor.execCommand('insertHtml', `<p>${content.toString()}</p>`);
    }
    // console.log(range, nodeName, attr);
  }
  initEditor() {
    const { saveEditorData } = this.props;
    const UE = window.UE;
    const id = this.props.id;
    registerui(
      UE,
      this.refs.input,
      this.props.id,
      {
        showFormulaEditor: this.props.showFormulaEditor,
        changeState: this.changeState,
        insertNode: this.insertNode,
        replaceNode: this.replaceNode,
        showformulaWrapper: this.props.showformulaWrapper,
      },
      this.props.soucre,
    );
    const option = this.props.option ? this.props.option : UeditorConfig;
    const ueEditor = UE.getEditor(this.props.id, option);

    this.editor = ueEditor;
    ueEditor.ready(ueditor => {
      if (!ueditor) {
        UE.delEditor(id);
        this.initEditor();
      } else {
        // console.dir(this.editor);
        if (this.props.initOver) this.props.initOver();
        this.editor.body.addEventListener('input', e => {
          const content = this.getEditorContent();
          saveEditorData(content);
        });
        ueEditor.addListener('contentChange', e => {
          // 这里可以注册多个事件，用空格隔开，使用形参 type 可以判断数以哪个事件
          const content = this.getEditorContent();
          saveEditorData(content);
        });
        ueEditor.addListener('formula2Img',  (eventType, data) => {
          if (data.action === 'katex2Img') {
            this.setState({ currentFormula: data.data, showImgModal: true });
          }
        });

      }
    });

    // console.log(UE.browser.chrome, 'chrome');
  }
  getEditorContent() {
    return this.editor.getContent();
  }
  render() {
    return (
      <EditorWrapper
        id={`u${this.props.id}`}
        height={this.props.editorheight}
        width={this.props.editorWidth}
        margin={this.props.editorMargin}
      >
        <div
          style={{
            height: this.props.height ? `${this.props.height}px` : '380px',
          }}
          id={this.props.id}
          name="content"
          type="text/plain"
        />
        <input
          ref="input"
          type="file"
          style={{
            visibility: 'hidden',
            height: 0,
            width: 0,
            display: 'inline-block',
          }}
        />
        {
          this.state.showImgModal ?
            <AntModel
              footer={null}
              visible={true}
              title="生成公式图片"
              width={600}
              onCancel={() => { this.setState({ showImgModal: false }) }}>
              <FormulaToImg
                formula={this.state.currentFormula}
                onFinish={() => { this.setState({ showImgModal: false }) }}
              />
            </AntModel> : null
        }
      </EditorWrapper>
    );
  }
}

Ueditor.propTypes = {
  id: PropTypes.string,
  showFormulaEditor: PropTypes.func,
  saveEditorData: PropTypes.func,
  // option: PropTypes.object,  // option 作为可选参数，传入编辑器的 config 配置。此处注释并非移除不用，而是由于 eslint 校验注释
  editorheight: PropTypes.string,
  editorWidth: PropTypes.string,
  editorMargin: PropTypes.string,
  height: PropTypes.number,
  initOver: PropTypes.func,
  soucre: PropTypes.string,
  showformulaWrapper: PropTypes.func,
};

export default Ueditor;
