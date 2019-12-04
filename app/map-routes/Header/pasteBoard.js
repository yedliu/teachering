import React from 'react';
import styled from 'styled-components';
import { Icon, Popover } from 'antd';
import { ChromePicker } from 'react-color';

import AppLocalStorage from 'utils/localStorage';

const TextArea = styled.textarea `
  -webkit-appearance: none;
  outline: none;
  min-height: 150px;
  max-height: 500px;
  flex: 1;
  font-size: 15px;
  line-height: 16px;
  border: none;
  padding: 5px;
  width: 100%;
  &::placeholder {
    color: #DDDDDD;
    font-size: 15px;
  }
  ${(props) => (!props.readOnly ? `
    &:focus {
      box-shadow: 0px 0px 4px #999 inset
    }
  ` : '')}
`;
const Buttons = styled.div`
  text-align: right;
  font-size: 18px;
  i {
    cursor: pointer;
  }
  margin: 0 5px;
`;
const Line = styled.a`
  right: 5px;
  top: 0;
  position: absolute;
`;
const PickerDiv = styled.div`
  position: absolute;
  zIndex: 2;
  right: 0px;
  bottom: -100%;
`;

export default class PasteBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showChromePicker: false,
      hex: AppLocalStorage.getBoardColor(),
    };
  }

  showBoard = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  chooseColor = () => {
    this.setState({
      showChromePicker: !this.state.showChromePicker,
    });
  }

  handleChange = (color) => {
    const { rgb, hex } = color;
    this.setState({
      color: rgb,
      hex
    });
    AppLocalStorage.setBoardColor(hex);
  };

  render() {
    const { pasteContent, onChange, close } = this.props;
    const { visible, showChromePicker, color, hex } = this.state;
    const board = (
      <div style={{ width: 150 }}>
        <TextArea placeholder="有什么想记得我先帮您记着~" autoFocus onChange={e => onChange(e.target.value)} value={pasteContent} />
        <Buttons>
          <Icon type="heart-o" title="选择图标颜色" onClick={this.chooseColor} />
          <Icon type={visible ? 'lock' : 'unlock'} title={visible ? '' : '固定面板'} onClick={this.showBoard} />
          <Icon type="delete" title="清空" onClick={() => onChange('')} />
          <Icon type="close-square-o" title="关闭粘贴板" onClick={close} />
          {showChromePicker ? (
            <PickerDiv>
              <ChromePicker color={color} onChange={this.handleChange} />
            </PickerDiv>
          ) : null}
        </Buttons>
      </div>
    );
    const attribute = {
      content: board,
      defaultVisible: true,
      title: '我的粘贴板',
    };
    if (visible) {
      attribute.visible = true;
    }
    return (
      <Popover {...attribute} placement="bottom">
        <Line href="#">
          <Icon type="edit" style={{ color: hex }} />
        </Line>
      </Popover>
    );
  }
}