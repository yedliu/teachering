/**
 *
 * AlwaysFormula
 *
 */

import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { FlexRow, FlexCenter, FlexRowCenter } from 'components/FlexBox';
import { PlaceHolderBox } from 'components/CommonFn/style';
import Katex from 'katex';
import { compatibleForKatexUpgrade } from 'zm-tk-ace/utils';
import { Button, message, Input } from 'antd';

import {
  chemistry,
  physics,
  biological,
  math0,
  math1,
  math2,
  defaultFormulaList,
  allFormula,
} from './formula';

const TextArea = Input.TextArea;
const FormulaWrapper = styled.div`
  position: absolute;
  top: calc(100vh - 500px);
  left: 50px;
  width: ${props => (['finalVerify', 'apperInputVerify', 'questionPicker'].includes(props.soucre) ? '700px' : props.soucre === 'h5courseware' || props.soucre === 'scourseware' ? '100%' : '400px')};
  height: ${props => (props.soucre === 'h5courseware' || props.soucre === 'scourseware' ? '' : 'auto')};
  min-height: ${props => (props.soucre === 'h5courseware' || props.soucre === 'scourseware' ? '100%' : '350px')};
  padding: 10px;
  z-index: 1000;
  border: 1px solid #ddd;
  background: #fff;
  overflow: auto;
`;
const FormulaBox = styled(FlexRow)`
  flex-wrap: wrap;
  .base {
    white-space: normal;
  }
`;
const FormulaItem = styled(FlexCenter)`
  width: auto;
  height: auto;
  padding: 5px;
  background: #fff;
  user-select: none;
  border: 1px solid #ddd;
  margin: 5px;
  color: #000;
  cursor: pointer;
`;
const DropBox = styled.div`
  flex: 1;
  height: 30px;
  background: #ddd;
  cursor: move;
`;
const CloseBox = styled.div`
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  margin-left: 5px;
  line-height: 24px;
  text-align: center;
  font-size: 30px;
  user-select: none;
  cursor: pointer;
`;
const ButtonBox = styled(FlexRowCenter)`
  height: 50px;
`;
const FormulaPreBox = styled.div`
  flex: 2;
  border-left: 1px solid #ddd;
  margin-left: 5px;
  padding-left: 5px;
`;
const NavContainer = styled.div`
  display: flex;
  flex: auto;
  border-bottom: 1px solid #cccccc;
  padding-bottom: 10px;
`;
const NavItem = styled.div`
  display: flex;
  flex: auto;
  justify-content: center;
`;

class AlwaysFormula extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.mouseMoveEvent = this.mouseMoveEvent.bind(this);
    this.mouseUpEvent = this.mouseUpEvent.bind(this);
    this.chooseDorMulaList = this.chooseDorMulaList.bind(this);
    this.setRange = this.setRange.bind(this);
    this.insertText = this.insertText.bind(this);
    this.state = {
      canMover: false,
      // position: {
      //   x: '100px',
      //   y: '100px',
      // },
      momeryPosition: {
        detX: 0,
        detY: 0,
        x: 0,
        y: 0,
      },
      formulaData: '',
      analyze: '',
      formatFormula: '',
      selection: {
        start: 0,
        end: 0,
      },
      pickedSubject: null,
    };
  }
  componentDidMount() {
    document.body.addEventListener('mousemove', this.mouseMoveEvent);
    document.body.addEventListener('mouseUpEvent', this.mouseUpEvent);
    document.body.addEventListener('mouseleave', this.mouseMoveEvent);
  }
  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.mouseMoveEvent);
    document.body.removeEventListener('mouseUpEvent', this.mouseUpEvent);
  }
  setRange() {
    setTimeout(() => {
      let oTxt1 = document.getElementById('textAreaFinalVerify');
      if (
        typeof oTxt1.selectionStart === 'number' &&
        oTxt1.selectionStart >= 0
      ) {
        let selection = { start: 0, end: 0, value: '' };
        if (this.state.formulaData.replace(/\s/g, '').length > 0) {
          selection = {
            start: oTxt1.selectionStart,
            end: oTxt1.selectionEnd,
            value: oTxt1.value || '',
          };
        }
        this.setState({ selection });
        oTxt1 = null;
      }
    }, 20);
  }
  mouseMoveEvent(e) {
    if (!this.state.canMover) return;
    const momeryPosition = this.props.momeryPosition;
    const x = e.clientX - momeryPosition.detX;
    const y = e.clientY - momeryPosition.detY;
    // this.setState({ position: { x, y } });
    this.props.changeFormulaBoxPosition({ x, y });
  }
  mouseUpEvent() {
    this.setState({ canMover: false });
  }
  chooseDorMulaList() {
    const { subjectId, gradeId, phaseId } = this.props;
    let res = [];
    if (subjectId === 2) {
      if (this.props.soucre === 'scourseware') {
        // 切片课件
        switch (Number(phaseId)) {
          case 1:
            res = math0;
            break;
          case 2:
            res = math1;
            break;
          case 3:
            res = math2;
            break;
          default:
            res = math0;
            break;
        }
      } else {
        if ([1, 2, 3, 4, 5, 6].indexOf(gradeId) > -1) {
          res = math0;
        } else if ([7, 8, 9].indexOf(gradeId) > -1) {
          res = math1;
        } else if ([10, 11, 12].indexOf(gradeId) > -1) {
          res = math2;
        }
      }
    } else if ([14, 15, 16].indexOf(subjectId) > -1) {
      res = math2;
    } else if (subjectId === 6) {
      res = biological;
    } else if (subjectId === 5) {
      res = chemistry;
    } else if (subjectId === 4) {
      res = physics;
    } else if (subjectId === 11) {
      res = math0;
    } else if (subjectId === 10) {
      res = math1;
    } else if ([15, 16].indexOf(subjectId) > -1) {
      res = math2;
    } else {
      res = defaultFormulaList;
    }
    // res = chemistry;
    const { pickedSubject } = this.state;
    const allTypes = {
      chemistry,
      physics,
      biological,
      math0,
      math1,
      math2,
      defaultFormulaList,
    };
    if (pickedSubject && allTypes[pickedSubject]) {
      return [].concat(allFormula).concat(allTypes[pickedSubject]);
    }
    return [].concat(allFormula).concat(res);
  }
  insertText(txt) {
    const selection = this.state.selection;
    // const len = selection.end - selection.start;
    // let text = document.querySelector('#textArea');
    const value =
      (selection.value || '').slice(0, selection.start) +
      txt +
      (selection.value || '').slice(selection.end);
    let formatFormula = '';
    const newSelection = {
      start: selection.start + txt.length,
      end: selection.end + txt.length,
      value,
    };
    try {
      formatFormula = Katex.renderToString(compatibleForKatexUpgrade(value));
      this.setState({
        formulaData: value,
        formatFormula,
        selection: newSelection,
      });
    } catch (err) {
      this.setState({ formulaData: value, selection: newSelection });
    }
  }
  render() {
    const position = this.props.formulaBoxPosition;
    const soucre = this.props.soucre;
    const formulaList = this.chooseDorMulaList();
    const subjectStr = `chemistry:化学,physics:物理,biological:生物,math0:小学数学,math1:初中数学,math2:高中数学,defaultFormulaList:默认`;
    // const subjectStr = `physics:物理,math0:小学数学,math1:初中数学,math2:高中数学,defaultFormulaList:默认`;

    return (
      <FormulaWrapper
        innerRef={x => {
          this.formulabox = x;
        }}
        style={{ top: position.y, left: position.x }}
        soucre={this.props.soucre}
      >
        {/* 公式查询切换 */}
        <NavContainer>
          {subjectStr.split(',').map(item => {
            const [subject, name] = item.split(':');
            return (
              <NavItem
                key={item}
                onClick={_ => {
                  this.setState({ pickedSubject: subject }, () => {
                    console.log(this.state.pickedSubject, subject, name);
                  });
                }}
              >
                {name}
              </NavItem>
            );
          })}
        </NavContainer>
        {soucre === 'h5courseware' || soucre === 'scourseware' ? '' : (
          <FlexRow>
            <DropBox
              onMouseDown={e => {
                const x = this.formulabox.offsetLeft;
                const y = this.formulabox.offsetTop;
                const detX = e.clientX - x;
                const detY = e.clientY - y;
                // this.setState({ canMover: true, momeryPosition: { detX, detY, x, y } });
                this.setState({ canMover: true });
                this.props.changeMomeryPosition({ detX, detY, x, y });
              }}
              onMouseUp={this.mouseUpEvent}
            />
            <CloseBox onClick={() => this.props.closeFormulaBox(false)}>
              ×
            </CloseBox>
          </FlexRow>
        )}
        {['finalVerify', 'apperInputVerify', 'questionPicker'].includes(soucre) ? (
          <FlexRow>
            <FormulaBox style={{ minWidth: 300, flex: 3 }}>
              {formulaList.map((item, index) => {
                return (
                  <FormulaItem
                    key={index}
                    dangerouslySetInnerHTML={{
                      __html: Katex.renderToString(compatibleForKatexUpgrade(item || '')),
                    }}
                    onClick={() => {
                      const txt = formulaList[index];
                      this.insertText(txt);
                      // this.setState({  })
                    }}
                  />
                );
              })}
            </FormulaBox>
            <FormulaPreBox style={{ border: '1px solid #ddd', padding: 5 }}>
              <ButtonBox>
                <FlexRowCenter
                  type="primary"
                  style={{ fontSize: 16, color: 'black', padding: '0 5px' }}
                >
                  公式编辑处：
                </FlexRowCenter>
                <PlaceHolderBox />
                <Button
                  onClick={() => {
                    if (
                      this.state.analyze ||
                      this.state.formatFormula !== '解析失败'
                    ) {
                      this.props.insertText(this.state.formulaData
                        .replace(/\\text{([^}]+)}/g, '$1')
                        .replace(/\s?([^\x00-\xff]+)/g, (e, $1) => {
                          return ` \\text{${$1}}`;
                        }));
                      return;
                    }
                    message.warn('请确保公式输入正确');
                  }}
                >
                  插入公式
                </Button>
              </ButtonBox>
              <TextArea
                id="textAreaFinalVerify"
                onClick={this.setRange}
                onKeyDown={e => {
                  if ([8, 13, 32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                    this.setRange();
                  }
                }}
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 0,
                  resize: 'none',
                }}
                value={this.state.formulaData}
                onChange={e => {
                  let formatFormula = '';
                  const value = e.target.value || '';
                  try {
                    formatFormula = Katex.renderToString(compatibleForKatexUpgrade(value));
                    this.setState({
                      formulaData: value,
                      formatFormula,
                      analyze: true,
                    });
                  } catch (err) {
                    this.setState({
                      formulaData: value,
                      formatFormula: '解析失败',
                      analyze: false,
                    });
                  }
                  this.setRange();
                }}
              />
              <FlexRowCenter
                style={{ fontSize: 16, color: 'black', padding: '5px' }}
              >
                公式预览：
              </FlexRowCenter>
              <div
                style={{ background: '#fff' }}
                dangerouslySetInnerHTML={{ __html: this.state.formatFormula }}
              />
            </FormulaPreBox>
          </FlexRow>
        ) : (<FormulaBox>
          {formulaList.map((item, index) => {
            return (
              <FormulaItem
                key={index}
                dangerouslySetInnerHTML={{
                  __html: Katex.renderToString(compatibleForKatexUpgrade(item || '')),
                }}
                onClick={() => {
                  const txt = formulaList[index];
                  this.props.insertText(txt);
                }}
              />
            );
          })}
        </FormulaBox>)}
      </FormulaWrapper>
    );
  }
}

AlwaysFormula.propTypes = {
  formulaBoxPosition: PropTypes.object, // 必传（定位）
  changeFormulaBoxPosition: PropTypes.func,
  momeryPosition: PropTypes.object,
  changeMomeryPosition: PropTypes.func,
  subjectId: PropTypes.number,
  gradeId: PropTypes.number,
  insertText: PropTypes.func,
  closeFormulaBox: PropTypes.func,
  soucre: PropTypes.string,
};

export default AlwaysFormula;
