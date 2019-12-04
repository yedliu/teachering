import React, { PropTypes } from 'react';
import Ueditor from 'components/Ueditor';
import { configOption } from 'containers/PaperFinalVerify/ueditorConfig';


export default class Editor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      seeFormulaModal: props.seeFormulaModal || false,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { seeFormulaModal } = this.state;
    const newSeeFormulaModal = nextProps.seeFormulaModal.toString();
    if (seeFormulaModal.toString() !== newSeeFormulaModal) {
      this.setState({
        seeFormulaModal: nextProps.seeFormulaModal,
      });
    }
  }
  saveEditorData = (value) => {
    const {
        newQuestion,
        setNewQuestionMsg,
        clickTarget,
    } = this.props;
    console.log('clickTarget', clickTarget);
    const {
        degree,
        i,
        property,
    } = clickTarget;
    // 选词填空题标题限制

    if (newQuestion.get('templateType') === 7 && (value || '').length > 100) {
      message.info('标题内容最多只能为100字');
    }
    setNewQuestionMsg(degree, i, property, value);
  }
  showformulaWrapper = () => {
    const { seeFormulaModal } = this.state;
    this.setState({ seeFormulaModal: !seeFormulaModal });
  }
  initOver = () => {
    const { newQuestion, clickTarget, contentwrapper } = this.props;
    const {
        scrollTop,
        property,
        i,
        degree,
        index,
    } = clickTarget;
    contentwrapper && (contentwrapper.scrollTop = 55);
    console.log('contentwrapper', contentwrapper, contentwrapper.scrollTop);
    const getParentHtml = () => {
      if (i === -1) {
        return newQuestion.get(property) || '';
      } else {
        return newQuestion.getIn([property, i]) || '';
      }
    };
    const getChildrenHtml = () => {
      if (i === -1) {
        return newQuestion.getIn([degree, index, property]) || '';
      } else {
        return newQuestion.getIn([degree, index, property, i]) || '';
      }
    };
    const degreeMap = {
      parent: getParentHtml(),
      children: getChildrenHtml()
    };
    const html = degreeMap[degree] || '';
    const content = window.UE.getEditor('editor1');
    content.setContent(html);
    this.setState({ memory: html });
  }
  render() {
    const {
      seeFormulaModal,
    } = this.state;
    const {
        soucre,
     } = this.props;
    /**
     * clickTarget
     * @param degree: 级别 "parent" | "children"
     * @param i: -1 | 0 | ... 选项第几项
     * @param index: -1 | 0 | ... 子题第几题
     * @param property: "title" | "optionList"
     * @param scrollTop: 0
     * @param target: "parenttitle-1-1" |"childrenoptionList0100"
     */
    const style = {
      height: 120,
      editorheight: 'auto',
      editorWidth: '100%',
      editorMargin: '0',
      id: 'editor1',
      option: configOption,
    };
    return <div style={{ position: 'relative' }}>
      { seeFormulaModal
      ? <Ueditor
        innerRef={x => { this.ueditorbox = x }}
        soucre={soucre}
        saveEditorData={this.saveEditorData}
        showformulaWrapper={this.showformulaWrapper}
        initOver={this.initOver}
        {...style}
          ></Ueditor>
          : ''}
    </div>;
  }
}
Editor.propTypes = {
  soucre: PropTypes.string,
  newQuestion: PropTypes.object,
  clickTarget: PropTypes.object,
  seeFormulaModal: PropTypes.bool,
};