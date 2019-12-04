/* eslint-disable react/no-string-refs */
/* eslint-disable no-case-declarations */
/**
* Created By spark on 2018/6/2
* 分类、配对容器组件
*/

import React, { PropTypes } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Input, Icon, Button, message } from 'antd';
import { fromJS } from 'immutable';
import AppLocalStorage from 'utils/localStorage';
import Config from 'utils/config';
import { judgeChatLength } from 'utils/helpfunc';

const fadeIn = keyframes`
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
`;
const FlexRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
const Box = styled.div`
  width: ${props => props.width || 200}px;
  height: ${props => props.height || 300}px;
  border: 3px solid #E4E4E4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  &:focus {

  }
`;
const closeIcon = css`
  position: absolute;
  right: -8px;
  top: -8px;
  cursor: pointer;
  z-index: 2;
`;
const Header = styled(FlexRow)`
  padding: 5px;
  border-bottom: 1px solid #E4E4E4;
  position: relative;
  b {
    flex: 1;
    white-space: nowrap;
    margin-right: 5px;
  }
  .close-icon {
    ${closeIcon}
  }
`;
const Bottom = styled(FlexRow)`
  display: flex;
  padding: 5px;
  border-top: 1px solid #E4E4E4;
  justify-content: space-around;
`;
const Content = styled.div`
  flex: 1;
  padding: 5px;
  overflow: auto;
  .text {
    label {
      background: #F4F5F7;
      padding: 3px 8px;
      width: 80%;
    }
  }
  .img {
    img {
      max-width: 140px;
    }
    .close-icon {
      ${closeIcon}
    }
  }
`;
const TextItem = styled(FlexRow)`
  height: 35px;
  .close-icon {
    ${closeIcon}
  }
`;
const TextLabel = styled.label`
  animation: 0.5s ${fadeIn} linear;
  .close-icon {
    ${closeIcon}
  }
  .hover {
    display: none;
  }
  &:hover {
    .hover {
      display: block;
    }
  }
`;
const ImgDiv = styled.div`
  position: relative;
  margin: 8px;
  display: inline-block;
`;
class ClassifyBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.addText = this.addText.bind(this);
    this.validateImg = this.validateImg.bind(this);
    this.getTextDom = this.getTextDom.bind(this);
    this.crudContent = this.crudContent.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.getMembers = this.getMembers.bind(this);
    this.getNumByType = this.getNumByType.bind(this);
    this.state = {
    };
  }
  componentDidMount() {
    const { data, sequence, setClassify } = this.props;
    // 如果members中不存在数据，就从其他中取
    if (!data.get('members')) {
      setTimeout(() => {
        setClassify(sequence, data.set('members', this.getMembers()));
      }, (sequence + 1) * 100);
    }
  }
  getMembers() {
    const { data } = this.props;
    return data.get('members') || data.get('subQuestionItemInputDTOList') || data.get('subQuestionMemberList') || fromJS([]);
  }
  getNumByType(type) {
    const { data } = this.props;
    if (type) {
      let amount = 0;
      data.get('members').toJS().map(item => { // eslint-disable-line
        if (item.type == type) { // eslint-disable-line
          amount++;
        }
      });
      return amount;
    } else {
      return data.get('members').count();
    }
  }
  addText() {
    const { textMax, allMax, data } = this.props;
    const textAmount = data.get('textAmount') || this.getNumByType('text');
    const allAmount = data.get('allAmount') || this.getNumByType();
    if (textMax && textAmount >= textMax) {
      message.info('标签数量已达上限');
      return;
    }
    if (allMax && allAmount >= allMax) {
      message.info('数量已达上限');
      return;
    }
    this.crudContent('add', 'text');
  }
  getTextDom(item, index) {
    // const { data, sequence, setClassify } = this.props;
    const { templateType, layoutStyle } = this.props;
    const charLimit = {
      5: 6, // 分类题字数限制为 6 个汉字
      6: ['1'].includes(String(layoutStyle)) ? 28 : 15, // 配对题文文字数限制为 28 个汉字，其他字数限制为 15
    };
    const CloseIcon = (status) => (
      <Icon type="close-circle"
        className={status == 'complete' ? 'close-icon hover' : 'close-icon'} // eslint-disable-line
        onClick={() => { this.crudContent('delete', 'text', '', index) }}
      />
    );
    switch (item.status) {
      case 'init':
        return (
          <TextItem key={index}>
            <div style={{ position: 'relative' }}>
              {CloseIcon('init')}
              <Input placeholder={templateType && `最多输入${charLimit[templateType]}个汉字`} value={item.content}
                autoFocus="autoFocus"
                onPressEnter={() => this.crudContent('confirm', '', '', index)}
                onChange={(e) => {
                  // if (judgeChatLength(e.target.value) > charLimit[templateType] * 2) return;
                  this.crudContent('edit', 'text', e.target.value, index);
                }}
                maxLength={charLimit[templateType]}
              />
            </div>
            {item.content ? (
              <Icon type="check-circle"
                style={{ color: '#108ee9', cursor: 'pointer' }}
                title="按回车确认"
                onClick={() => this.crudContent('confirm', '', '', index)}
              />
            ) : (
              <Icon type="check-circle-o" />
            )}
          </TextItem>
        );
      case 'complete':
        return (
          <TextItem key={index}>
            <TextLabel key={index}>
              {item.content}
              {CloseIcon('complete')}
            </TextLabel>
            <Icon type="edit" style={{ cursor: 'pointer' }}
              title="编辑"
              onClick={() => this.crudContent('init', '', '', index)}
            />
          </TextItem>
        );
      default:
        return (
          <TextItem key={index}>
            <TextLabel key={index}>
              {item.content}
              {CloseIcon('complete')}
            </TextLabel>
            <Icon type="edit" style={{ cursor: 'pointer' }}
              title="编辑"
              onClick={() => this.crudContent('init', '', '', index)}
            />
          </TextItem>
        );
    }
  }
  validateImg() {
    const { ImgMax, allMax, data } = this.props;
    const ImgAmount = data.get('ImgAmount') || this.getNumByType('img');
    const allAmount = data.get('allAmount') || this.getNumByType();
    if (ImgMax && ImgAmount >= ImgMax) {
      message.info('图片数量已达上限');
      return false;
    }
    if (allMax && allAmount >= allMax) {
      message.info('数量已达上限');
      return false;
    }
    return true;
  }
  // 分发改变数据结构的主要方法
  crudContent(method, type, content, index) {
    // index内部组件顺序 sequence卡片顺序
    const { data, setClassify, sequence } = this.props;
    let editData = null;
    // let amount = 0;
    // let allAmount = 0;
    const amountType = type == 'text' ? 'textAmount' : 'ImgAmount'; // eslint-disable-line
    switch (method) {
      case 'add': // eslint-disable-line
        let members = data.get('members');
        if (type === 'text') {
          members = members.push(fromJS({
            type: type,
            status: 'init'
          }));
        } else {
          members = members.push(fromJS({
            type: type,
            content: content
          }));
        }
        editData = data.set(amountType, (data.get(amountType) || 0) + 1)
          .set('allAmount', (data.get('allAmount') || 0) + 1)
          .set('members', members);
        break;
      case 'delete':
        editData = data.set(amountType, (data.get(amountType) || 0) - 1)
          .set('allAmount', (data.get('allAmount') || 0) - 1)
          .set('members', data.get('members').delete(index));
        break;
      case 'edit':
        editData = data.setIn(['members', index, 'content'], content);
        break;
      case 'confirm':
        editData = data.setIn(['members', index, 'status'], 'complete');
        break;
      case 'init':
        editData = data.setIn(['members', index, 'status'], 'init');
        break;
      default:
    }
    setClassify(sequence, editData);
  }
  onChangeFile() {
    if (['2', '3'].includes(String(this.props.layoutStyle))) {
      const limit = this.validateImg();
      if (!limit) return;
      const input = this.input;
      const form = new FormData();
      form.append('file', input.files[0]);
      fetch(`${Config.trlink_qb}/api/question/fileUpload`, {
        method: 'POST',
        headers: {
          mobile: AppLocalStorage.getMobile(),
          password: AppLocalStorage.getPassWord(),
        },
        body: form,
      }).then((response) => {
        return response.json();
      }).then((res) => {
        if (res && res.code.toString() === '0') {
          this.crudContent('add', 'img', res.data);
        } else {
          message.error(res.message || '上传失败');
        }
      });
    }
  }
  render() {
    /*
    * layoutStyle 配对类型
    * sequence 第几个box
    */
    const { closeBox, title, hasTitleInput, sequence,
      layoutStyle, data, setClassify } = this.props;
    const members = this.getMembers().toJS();
    const texts = [];
    const images = [];
    const textAmount = data.get('textAmount') || 0; // eslint-disable-line
    const imgAmount = data.get('imgAmount') || 0; // eslint-disable-line
    // i表示该项在members中顺序
    members.map((it, i) => { // eslint-disable-line
      if (it.type === 'text') {
        texts.push({ index: i, member: it });
      } else if (it.type === 'img') {
        images.push({ index: i, member: it });
      }
    });
    return (
      <Box>
        <Header>
          {closeBox ? (
            <Icon type="close-circle" className="close-icon"
              onClick={() => closeBox(sequence)}
            />
          ) : ''}
          <b>{title}</b>{hasTitleInput ? (
            <Input placeholder="请输入名称" value={data.get('title')}
              onChange={(e) => {
                if (judgeChatLength(e.target.value) > 30) return;
                setClassify(sequence, data.set('title', e.target.value));
              }}
            />
          ) : ''}
        </Header>
        <Content>
          <div className="text">
            {texts.map(item => this.getTextDom(item.member, item.index))}
          </div>
          <div className="img">
            {images.map(item => (
              <ImgDiv key={item.index}>
                <img src={item.member.content} />
                <Icon type="close-circle" className="close-icon"
                  onClick={() => { this.crudContent('delete', 'img', '', item.index) }}
                />
              </ImgDiv>
            ))}
          </div>
        </Content>
        <Bottom>
          {['1', '2'].includes(String(layoutStyle)) ? (
            <Button onClick={() => this.addText(true)}>添加文字</Button>
          ) : ''}
          {['2', '3'].includes(String(layoutStyle)) ? (
            <div style={{ margin: 0, position: 'relative' }}>
              <Button>添加图片</Button>
              <input onChange={this.onChangeFile} ref={(e) => { this.input = e }} type="file" style={{ opacity: 0, top: 2, height: 22, width: 80, position: 'absolute' }} />
            </div>
          ) : ''}
        </Bottom>
      </Box>
    );
  }
}

ClassifyBox.propTypes = {
  textMax: PropTypes.number, // 最多有几处文字
  ImgMax: PropTypes.number, // 最多有几张图片
  allMax: PropTypes.number, // 最多有几个元素
  hasTitleInput: PropTypes.bool, // 标题有没有输出框
  setClassify: PropTypes.func, // 改变内容回调方法
  sequence: PropTypes.number, // 该框位于第几个
  layoutStyle: PropTypes.string.isRequired, // 2表示图文都可以 1表示文字 3表示图片
  templateType: PropTypes.number, // 模板类型
};

export default ClassifyBox;
