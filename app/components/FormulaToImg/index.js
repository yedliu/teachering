import { ZmLatex2png } from 'zm-tk-ace';
import { compatibleForKatexUpgrade } from 'zm-tk-ace/utils';
import sizeList from 'components/FormulaToImg/sizeList';
import React from 'react';
import styled from 'styled-components';
import {  Button, Spin, Select } from 'antd';
const Option = Select.Option;
import { uploadFileToAliOSS }  from 'api/tr-cloud/oss-endpoint';
const FormulaImgWrapper = styled.div`
width: 100%;
height: 300px;
margin-top: 20px;
border: 1px solid #eee;
padding: 10px;
overflow: auto;
`;
class FormulaToImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: sizeList[0].value,
      spinning: false
    };
  }
  componentDidMount() {
    const { formula } = this.props;
    if (formula) {
      this.makePng(formula, this.state.size);
    }
  }

  makePng=(formula, size) => {
    let latex2png = new ZmLatex2png();
    let wrapper = document.querySelector('.formula-img-wrapper');
    wrapper.innerHTML = '';
    let f = formula.replace(/\\text{/g, '{');
    f = compatibleForKatexUpgrade(f);
    latex2png.toPng(f, {
      parentEle: wrapper,
      fontSize: size,
    });
  }
  onFontSizeChange=(value) => {
    this.setState({ size: value });
    this.makePng(this.props.formula, value);
  }
  onConfirm=() => {
    let wrapper = document.querySelector('.formula-img-wrapper');
    if (!wrapper) return;
    if (!wrapper.children[0]) return;
    let imgData = wrapper.children[0].src;
    let  formData = new FormData();
    let imgFile = this.convertBase64UrlToBlob(imgData);
    console.log(imgFile, 'ppp');
    imgFile.name = 'formula.png';
    formData.append('file', imgFile, 'formula.png');
    this.setState({ spinning: true });
    uploadFileToAliOSS(imgFile).then(res => {
      this.setState({ spinning: false });
      if (res && res.url) {
        let editor = window.UE.getEditor('editor1');
        editor.execCommand('insertimage', {
          src: res.url,
          'data-latex': this.props.formula,
          class: 'zm-latex-img'
        });
        this.props.onFinish();
      } else {
        alert(res.message || '图片上传失败！');
      }
    });
  }
  convertBase64UrlToBlob=(urlData) => {
    let bytes = window.atob(urlData.split(',')[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png', filename: 'formula.png' });
  }
  render() {
    return (
      <Spin spinning={this.state.spinning}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
            公式字号：
              <Select onChange={this.onFontSizeChange} value={this.state.size}>
                {
                  sizeList.map(item => {
                    return <Option key={item.value} value={item.value}>{item.label}</Option>;
                  })
                }
              </Select>
            </div>
            <Button type="primary" onClick={this.onConfirm}>确定</Button>
          </div>
          <FormulaImgWrapper className="formula-img-wrapper">

          </FormulaImgWrapper>
        </div>
      </Spin>
    );
  }
}

export default FormulaToImg;
