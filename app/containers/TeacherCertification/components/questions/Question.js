import React from 'react';
import { Select, Input } from 'antd';
import Modules from './modules';
import UEditor from './child/UEditor';
import { QuestionWrapper, ChildWrapper } from './style';
const { TextArea } = Input;

const Option = Select.Option;

const plainTextModules = ['Options'];

export default class TCQuestion extends React.Component {
  state = {
    showEditor: false, // 是否显示编辑器
    config: {}, // 当前模块的配置
    contentLength: 0, // 当前模块内容的长度
    editorType: 'text', // 控制编辑器的类型 editor: 富文本编辑器， text: TextArea
    content: '', // textarea 的内容
  };

  componentDidMount() {
    this.editor = window.UE.getEditor('teacher-certification-question');
  }
  currentModule = ''; // 当前激活的模块
  currentIndex = void 0; // 选项或者问题的子模块
  /**
   * 模块的点击事件，设置模块的内容
   * @param {string} module 当前点击的模块名称
   * @param {number | event} index 如果点击了选项或者问题的子模块是个参数是个数字
   * @param {event} e React 复合对象
   */
  handleClickModule = (module, index, e) => {
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
    clearTimeout(this.timer3);
    const event = e ? e : index;
    event.stopPropagation();
    if (!this.editor) this.editor = window.UE.getEditor('teacher-certification-question');
    const { data } = this.props;
    let content = '';
    let editorType = plainTextModules.includes(module) ? 'text' : 'editor';
    const editor = this.editor;
    const hasChildModule = module === 'Options' || module === 'SubQuestion';
    const config = this.getConfigByModule(module);

    this.currentModule = module;
    if (hasChildModule) {
      if (index >= 0) {
        this.currentIndex = index;
        const list = data[module];
        content = list[index];
      }
    } else {
      this.currentIndex = void 0;
      content = data[module];
    }
    this.prevContent = content;

    if (editorType !== 'text') {
      // 这一块会内存溢出，延后在进行操作
      this.timer1 = setTimeout(() => {
        editor.setContent(content ? `${content}` : '');
      }, 60);
      this.timer2 = setTimeout(() => {
        editor.focus();
      }, 61);
    } else {
      this.setState({ content });
      this.timer3 = setTimeout(() => {
        this.textArea.focus();
      }, 60); // textArea自动获取焦点
    }

    this.setState({ showEditor: true, editorType, config, currentModule: module }, () => {
      this.shouldUpdateContent(content, module === 'Options');
    });
  };

  /**
   * 获取配置
   * @param {string} module 当前的模块名称
   */
  getConfigByModule = module => {
    const { currentQuestion = [] } = this.props;
    let config = {};
    currentQuestion.forEach(el => {
      if (el.module === module && el.config) {
        config = el.config || {};
      }
    });
    return config;
  };

  /**
   * 更新内容
   * @param {string} value 需要更新的数据
   */
  saveEditorData = value => {
    const currentModule = this.currentModule;
    let content = null;
    const { data } = this.props;
    if (currentModule === 'Options' || currentModule === 'SubQuestion') {
      const index = this.currentIndex;
      if (index >= 0) {
        content = data[currentModule];
        content[index] = value;
      }
    } else if (currentModule) {
      content = value;
    }
    const flag = this.shouldUpdateContent(value, plainTextModules.includes(currentModule));
    if (!flag) return;
    this.props.onModuleValueChange(currentModule, content);
  };
  /**
   * 更新富文本内容
   * 富文本编辑器的内容会影响 TextArea 的内容，需要分开更新
   * @param {string} value 需要更新的数据
   */
  saveUEditorData = value => {
    const currentModule = this.currentModule;
    if (plainTextModules.includes(currentModule)) return;
    this.saveEditorData(value);
  };
  /**
   * 更新纯文本内容
   * 富文本编辑器的内容会影响 TextArea 的内容，需要分开更新
   * @param {string} value 需要更新的数据
   */
  saveTextAreaData = value => {
    const currentModule = this.currentModule;
    if (!plainTextModules.includes(currentModule)) return;
    this.saveEditorData(value);
  };
  /**
   * 检测是否需要更新内容
   * @param {string} value 需要更新的数据
   */
  shouldUpdateContent = (content, isText) => {
    const { config } = this.state;
    const maxLength = config.maximumWords || 0;
    if (!this.editor) this.editor = window.UE.getEditor('teacher-certification-question');
    if (isText) {
      this.setState({ content, contentLength: content.length });
      return content.length > maxLength;
    }
    const editor = this.editor;
    const plainTxt = editor.getContentTxt();
    const contentLength = plainTxt.length;
    this.setState({ contentLength });
    if (contentLength > maxLength) {
      editor.setContent(this.prevContent || '');
      return false;
    } else if (content != null) {
      this.prevContent = content;
    }
    return true;
  };

  onImageOptionChange = (index, url) => {
    const { data } = this.props;
    const content = data.Options;
    content[index] = url;
    this.props.onModuleValueChange('Options', content);
  }

  // 点击答案的事件
  handleChange = e => {
    this.props.onModuleValueChange('Answer', e.target.value);
  };

  // 添加新的选项或者问题
  addNewOption = type => {
    const options = this.props.data[type] || [];
    options.push('');
    this.props.onModuleValueChange(type, options);
  };

  // 删除选项或者问题
  deleteOption = (index, type) => {
    const options = this.props.data[type] || [];
    options.splice(index, 1);
    console.log(index, options);
    this.props.onModuleValueChange(type, options);
  };

  render() {
    const {
      showEditor,
      config,
      contentLength,
      editorType,
      content,
    } = this.state;
    const {
      currentQuestion = [],
      optionStart,
      optionType,
      data,
      onOptionTypeChange,
      errorMessage,
      changeQuestionType,
      questionTypeList = [],
      selectDisabled,
      questionType
    } = this.props;
    const answerList = data.Options.map((el, index) =>
      String.fromCharCode(optionStart.charCodeAt() + index),
    );
    return (
      <QuestionWrapper
        onClick={() => {
          this.setState({ showEditor: false });
        }}
      >
        <div
          className={`question-content ${
            showEditor ? 'content-show' : 'content-hide'
          }`}
        >
          <div className="question">
            <div style={{ position: 'absolute', right: 15, top: 10, zIndex: 2 }}>
              <span>选择题型：</span>
              <Select
                value={`${questionType}`}
                style={{ width: 120 }}
                disabled={selectDisabled}
                onChange={value => {
                  changeQuestionType(value);
                }}
              >
                {questionTypeList.map(el => (
                  <Option key={el.id} value={`${el.id}`}>
                    {el.name}
                  </Option>
                ))}
              </Select>
            </div>
            {currentQuestion.map((el, i) => (
              <Modules
                key={el.module}
                module={el.module}
                onClick={(index, e) => {
                  this.handleClickModule(el.module, index, e);
                }}
                style={i !== 0 ? { marginTop: '10px' } : {}}
                value={data[el.module]}
                index={this.currentIndex}
                active={el.module === this.currentModule && showEditor}
                answerList={answerList}
                optionStart={optionStart}
                optionType={optionType}
                rules={el.rules}
                errorMessage={errorMessage[el.module]}
                onChange={this.handleChange}
                addNewOption={this.addNewOption}
                deleteOption={this.deleteOption}
                onOptionTypeChange={onOptionTypeChange}
                onImageChange={this.onImageOptionChange}
              />
            ))}
          </div>
        </div>
        <div
          onClick={e => {
            e.stopPropagation();
          }}
          className={`base ${this.state.showEditor ? 'show' : 'hide'}`}
        >
          <ChildWrapper show={editorType === 'editor'}>
            <UEditor saveEditorData={this.saveUEditorData} />
          </ChildWrapper>
          <ChildWrapper
            show={editorType === 'text'}
            style={{ padding: `${editorType === 'text' ? '10px 5px' : '0px'}` }}
          >
            <TextArea
              ref={el => {
                this.textArea = el;
              }}
              value={content}
              style={{ height: 200 }}
              onChange={e => {
                this.saveTextAreaData(e.target.value);
              }}
            />
          </ChildWrapper>
          <div
            style={{ textAlign: 'right', marginTop: '-10px', paddingRight: 10 }}
          >
            可输入长度：{(config.maximumWords || 0) - contentLength}
          </div>
        </div>
      </QuestionWrapper>
    );
  }
}
