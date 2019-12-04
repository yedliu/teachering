import React from 'react';
import { Button } from 'antd';
import { Footer } from './style';
import Question from './Question';

const questionConfig = {
  1: [ // 单选题
    {
      module: 'QuestionTitle',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
    {
      module: 'Options',
      rules: { required: true, min: 2, max: 6 },
      config: { maximumWords: 1000 },
    },
    { module: 'Answer', rules: { required: true }},
    {
      module: 'Analysis',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
  ],
  2: [ // 辨析题
    {
      module: 'QuestionTitle',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
    {
      module: 'ReferenceAnswer',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
  ],
  3: [ // 解答题
    {
      module: 'QuestionTitle',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
    {
      module: 'ReferenceAnswer',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
  ],
  4: [ // 材料分析题
    // {
    //   module: 'QuestionTitle',
    //   rules: { required: true },
    //   config: { maximumWords: 5000 },
    // },
    {
      module: 'Materials',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
    {
      module: 'SubQuestion',
      rules: { required: true, min: 1, max: 5 },
      config: { maximumWords: 200 },
    },
    {
      module: 'ReferenceAnswer',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
  ],
  5: [ // 写作题
    {
      module: 'QuestionTitle',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
    {
      module: 'Materials',
      rules: { required: false },
      config: { maximumWords: 5000 },
    },
    {
      module: 'ReferenceAnswer',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
  ],
  6: [ // 教学设计题
    {
      module: 'QuestionTitle',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
    {
      module: 'ReferenceAnswer',
      rules: { required: true },
      config: { maximumWords: 5000 },
    },
  ],
};

export default class TCQuestion extends React.Component {
  constructor(props) {
    super(props);
    const {
      questionType,
      optionType,
      options,
      questionTitle,
      subQuestion,
      materials,
      analysis,
      answer,
      referenceAnswer,
    } = props;
    this.state = {
      questionType: questionType || 1,
      errorMessage: {},
      optionType: optionType || 'text',
      Options: options || ['', '', '', ''],
      QuestionTitle: questionTitle || '',
      SubQuestion: subQuestion || [''],
      Materials: materials || '',
      Analysis: analysis || '',
      Answer: answer || '',
      ReferenceAnswer: referenceAnswer || '',
    };
  }

  optionsData = {};

  // 保存数据
  saveEditorData = (module, data) => {
    this.setState({ [module]: data });
  };

  // 答案的类型发生变化
  onOptionTypeChange = type => {
    const { optionType, Options } = this.state;
    this.optionsData[optionType] = Options;
    if (this.optionsData[type]) {
      this.setState({ optionType: type, Options: this.optionsData[type] });
    } else {
      this.setState({ optionType: type, Options: ['', '', '', ''] });
    }
  };

  // 提交题目
  handleSubmit = () => {
    const { questionType, errorMessage, optionType } = this.state;
    const currentQuestion = questionConfig[questionType];
    const data = {};
    // 提交直接先检测必填项是否填写完整
    const hasError = currentQuestion
      .map(el => {
        const tempData = this.state[el.module];
        const rules = el.rules;
        const message = this.verifyQuestion(tempData, rules);
        errorMessage[el.module] = message;
        const key = this.uncapitalize(el.module);
        data[key] = tempData;
        return message;
      })
      .some(el => el);
    data.questionType = questionType;
    data.optionType = optionType;
    this.setState({ errorMessage });
    if (hasError) return;
    const { onSave } = this.props;
    if (typeof onSave === 'function') onSave(data); // 传入的数据只包含当前题型需要的字段
  };

  changeQuestionType = value => {
    this.setState({ questionType: value, errorMessage: {}});
  };

  uncapitalize = str => {
    return str.slice(0, 1).toLowerCase() + str.slice(1);
  };
  verifyQuestion = (data, rules) => {
    const { min, max, required } = rules;
    if (required) {
      if (data.length <= 0) {
        return '此项为必填项';
      }
    }
    if (max) {
      if (max < data.length) {
        return `长度不能超过${max}`;
      }
    }
    if (min) {
      if (min > data.length) {
        return `长度不能小于${min}`;
      }
    }
    if (Array.isArray(data)) {
      if (!data.every(el => el.length > 0)) {
        return '请完善填写内容';
      }
    }
    return '';
  };

  render() {
    const { questionTypeList, onCancel, loading, okText = '完成', selectDisabled } = this.props;
    const {
      questionType,
      errorMessage,
      optionType,
      ...questionModuleData
    } = this.state;
    console.log(questionType);
    const currentQuestion = questionConfig[questionType];

    return (
      <div style={{ height: '100%' }}>
        <div style={{ height: 'calc(100% - 40px)' }}>
          <Question
            errorMessage={errorMessage}
            currentQuestion={currentQuestion}
            optionStart="A"
            optionType={optionType}
            data={questionModuleData}
            questionType={questionType}
            questionTypeList={questionTypeList}
            onOptionTypeChange={this.onOptionTypeChange}
            onModuleValueChange={this.saveEditorData}
            changeQuestionType={this.changeQuestionType}
            selectDisabled={selectDisabled}
          />
        </div>
        <Footer>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={this.handleSubmit}
            loading={loading}
          >
            {okText}
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Footer>
      </div>
    );
  }
}
