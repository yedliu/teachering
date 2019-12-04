import React from 'react';
import ChoseTab from './choseTab';
import ImgUpload from './img';
import AudioUpload from './audio';
import JudgAnswer from './judgAnswer';
import TextEditor from './textEditor';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
  }

  render() {
    const {
      serialMark,
      optionList = [1, 2, 3, 4, 5, 6],
      editorText,
      answerOption = [0, 0, 0],
      type = 'listen',
      fileUpload, // eslint-disable-line
      ...restProps
    } = this.props;

    return (
      <div>
        <ChoseTab
          serialMark={serialMark}
          optionList={optionList}
          editorText={editorText}
          answerOption={answerOption}
          type={type}
          {...restProps}
        />
      </div>

    );
  }
}
Upload.ImgUpload = ImgUpload;
Upload.AudioUpload = AudioUpload;
export {
  ImgUpload,
  AudioUpload,
  JudgAnswer,
  TextEditor
};

export default Upload;
