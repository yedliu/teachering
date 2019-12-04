/*
 *
 * Knowledge
 *
 */

import React, { PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Checkbox, Form, Input, Select, Modal, message, Spin, Radio, Button } from 'antd';
import { BgModal, CenterDiv } from 'components/CommonFn/style';
import { makeIsLoading } from 'containers/LeftNavC/selectors';
import {
  makeSelectCrudId,
  makeSelectInputDto,
  makeSelectKnowledgeList,
  makeSelectModalAttr,
  makeSelectPhaseSubject,
  makeSelectPhaseSubjectList,
  makeSelectSelectedKnowledgeList,
  makeSelectOriginKnowledgeList,
} from './selectors';
import {
  deleteAction,
  getKnowledgeAction,
  getKnowledgeListAction,
  getPhaseSubjectListAction,
  saveAction,
  setCrudIdAction,
  setInputDtoAction,
  setKnowledgeListAction,
  setPhaseSubjectAction,
  setSelectedKnowledgeListAction,
  sortAction,
  setModalAttrAction,
  getOriginKnowledgeListAction,
} from './actions';
import { FlexColumn, FlexRow, FlexRowCenter } from '../../components/FlexBox';
import ListView, { ListViewItem } from '../../components/ListView/index';
const picNull = window._baseUrl.imgCdn + '18cdee41-78a4-4873-b815-17cbf07aaab2.png';
import knowledgeEndPoint from '../../api/tr-cloud/knowledge-endpoint';
import SelectKnowledgeModal from './SelectKnowledgeModal';
import KonwledgeModal from './knowledgeModal';
import CopyWritingForm from '../../components/CopyWritingForm';
const FormItem = Form.Item;

const Wrapper = styled(FlexColumn)`
  flex-grow:1;
  height: auto;
  background-color: white;
  font-size: 14px;
`;

const HeaderWrapper = styled(FlexRowCenter)`
  width: 100%;
  height: auto;
  background-color: white;
  padding:20px 0 15px;
  padding-left: 20px;
  flex-wrap: wrap;
`;

const BodyWrapper = styled(FlexRow)`
  justify-content:flex-start;
  width: 100%;
  height: auto;
  background-color: #f5f6f8;
  flex-grow:1;
  overflow:auto;
  .iySlzp {
    min-height: 60px!important;
  }
`;
const Text = styled.div`
  white-space:pre-wrap;
  display: inline-block;
  vertical-align: top;
  flex: 1;
`;
const TextWrap = styled.div`
  display: flex;
  width:100%;
`;
const sceneListEnum = ['新课', '同步', '单元复习', '期中复习', '期末复习', '中考复习', '高考复习', '竞赛', '会考', '杯赛', '日校衔接', '小升初'];
const labelListEnum = ['高频', '创新', '压轴', '核心', '期中', '期末', '常识', '基础', '必考'];

export class Knowledge extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedKnowledge: fromJS([]),
      knowledgeNameStr: '',
      showKnowledgeAtlas: false,
      curKnowledgeId: '', // 当前选择的知识点
      curKnowledgeItemList: [], // 当前选择的需要循环的知识点列表
      showCopyWriting: false,
      copyWriting: {},
    };
  }

  componentDidMount() {
    this.props.dispatch(getPhaseSubjectListAction());
  }

  showKnowledgeTreeFunc = (bool) => {
    if (bool) {
      this.setState({
        showKnowledgeTree: true,
      });
    } else {
      this.setState({
        showKnowledgeTree: false,
      });
    }
  }

  initSelectKnowledge = () => {
    // 初始化知识点
    this.setState({
      selectedKnowledge: fromJS([]),
      knowledgeNameStr: '',
      copyWriting: {}
    });
  }

  getOne = (e) => {
    this.initSelectKnowledge();
    knowledgeEndPoint.getOne({ id: e.id }).then(res => {
      if (Number(res.code) === 0) {
        const selectedKnowledge = res.data ? res.data.frontKnowledge.map(e => String(e.id)) : [];
        const { studySuggestionEasy, studySuggestionMiddle, studySuggestionDifficulty } = res.data ? res.data : {};
        let isShowCopyWriting = studySuggestionEasy || studySuggestionMiddle || studySuggestionDifficulty;
        this.setState({
          selectedKnowledge: fromJS(selectedKnowledge),
          knowledgeNameStr: res.data ? res.data.frontKnowledge.map(e => e.name).join('、') : '',
          copyWriting: isShowCopyWriting ? {
            studySuggestionEasy,
            studySuggestionMiddle,
            studySuggestionDifficulty
          } : {}
        });
      }
    });
    this.setState({
      curKnowledge: fromJS(e)
    });
  }

  lookMap = (item, itemList) => {
    message.destroy();
    this.showKnowledgeAtlas(true, item, itemList);
  }

  showKnowledgeAtlas = (showKnowledgeAtlas, item, itemList) => {
    this.setState({
      showKnowledgeAtlas,
      curKnowledgeId: item ? item.id : '',
      curKnowledgeItemList: itemList || [],
    });
  }
  // 生成已选前置知识点名称字符串
  makeKnowledgeLabels = (originKnowledgeList, selected, targetLabel) => {
    if (selected.length === 0) {
      return '';
    }
    originKnowledgeList.forEach(item => {
      if (selected.indexOf(Number(item.get('id'))) > -1) {
        targetLabel.push(item.get('name'));
      }
      let children = item.get('children');
      if (children && children.count() > 0) {
        this.makeKnowledgeLabels(children, selected, targetLabel);
      }
    });
    return targetLabel.join('、');
  }
  // 显示隐藏文案编辑弹框
  controlCopyWritingModal=(isShow) => {
    this.setState({ showCopyWriting: isShow });
  }
  // 保存文案
  saveCopyWriting=(values) => {
    this.setState({ copyWriting: values });
    this.controlCopyWritingModal(false);
  }
  render() {
    const {
      showKnowledgeTree, selectedKnowledge, knowledgeNameStr,
      curKnowledge, showKnowledgeAtlas, curKnowledgeId,
      curKnowledgeItemList, showCopyWriting, copyWriting,
    } = this.state;
    const {
      dispatch, knowledgeList, originKnowledgeList, modalAttr,
    } = this.props;
    let bodyItems = [];
    let allList = knowledgeList.toJS();
    if (allList.length < 5) {
      allList = allList.concat([[], [], [], [], []]).slice(0, 5);
    }
    if (allList.length > 0) {
      // console.log(allList, 'allList');
      bodyItems = allList.map((itemList, index) => {
        let listViewList = [];
        let hiddenFooter = false;
        if (itemList.length === 0) {
          listViewList.push(
            <div key={1} style={{ textAlign: 'center', marginTop: 80, fontSize: 14 }}>
              <img src={picNull} alt="暂无数据" />
              <p style={{ color: '#999', marginTop: 20 }}>暂无数据</p>
            </div>
          );
        } else {
          const isLastNode = (id) => {
            if (index === 4) {
              return true;
            }
            if (index < 2) {
              // 一二级不考虑
              return false;
            }
            // 找寻比我小的节点有没有以我为父节点的，也就是判断是不是最后一级节点
            return allList[index + 1].every(a => a.pid !== id);
          };
          const onlyLastNodes = itemList.filter(e => isLastNode(e.id));
          listViewList = itemList.map((item, index2) => {
            const style = { borderBottom: '1px solid #F0F0F0' };
            let selected = false;
            if (item.editable) {
              return (
                <ListViewItem
                  key={index2}
                  name={this.props.inputDto.get('name')}
                  editable
                  isLastNode={isLastNode(item.id)} //
                  lookMap={() => this.lookMap(item, onlyLastNodes)}
                  onChange={(e) => this.props.onChange(e, this.props.inputDto)}
                  save={this.props.save}
                  cancel={this.props.cancel}
                />
              );
            } else {
              const curLevelItem = this.props.selectedKnowledgeList.get(index);
              if (curLevelItem && item.id === curLevelItem.get('id')) {
                selected = true;
              }
              return (
                <ListViewItem
                  selected={selected}
                  style={style}
                  key={index2}
                  name={item.name}
                  toolBarVisible={item.toolBarVisible}
                  lookMap={() => this.lookMap(item, onlyLastNodes)}
                  isLastNode={isLastNode(item.id)} //
                  editable={item.editable}
                  onMouseOver={() => this.props.onMouseOver(index, index2, this.props)}
                  onMouseLeave={() => this.props.onMouseLeave(index, this.props)}
                  draggable
                  onDragStart={(e) => this.props.onDragStart(e, index, index2)}
                  onDrop={(e) => this.props.onDrop(e, index, index2, this.props)}
                  onDragOver={(e) => this.props.onDragOver(e)}
                  onClick={() => this.props.handleItemOnClick(item, index2, this.props)}
                  goToUpdate={(e) => {
                    // 获取当前的前置知识点
                    this.getOne(item);
                    this.props.goToUpdate(e, item, index2, this.props);
                  }}
                  goToDelete={(e) => this.props.goToDelete(e, index, index2, this.props)}
                  handleDelete={(e) => this.props.handleDelete(e, item, index2, this.props)}
                  handlePopCancel={(e) => this.props.handlePopCancel(e)}
                />
              );
            }
          });
        }
        if (index && allList[index - 1].length === 0) {
          hiddenFooter = true;
        }
        return (
          <ListView
            key={index}
            title={`${index + 1}级知识点`}
            onFooterBtnClick={() => {
              this.setState({
                selectedKnowledge: fromJS([]),
                knowledgeNameStr: '',
                curKnowledgeId: '',
                copyWriting: {},
              }, () => {
                this.props.handleOnFooterBtnClick(index + 1, this.props);
              });
            }}
            hiddenFooter={hiddenFooter}
          >
            {listViewList}
          </ListView>
        );
      });
    } else {
      bodyItems.push(
        <div key={1} style={{ textAlign: 'center', marginTop: 80, fontSize: 14 }}>
          <img src={picNull} alt="暂无数据" />
          <p style={{ color: '#999', marginTop: 20 }}>暂无数据</p>
        </div>
      );
    }
    return (
      <Wrapper>
        <HeaderWrapper>
          <Select
            className={'selectCls'}
            size="large"
            style={{ paddingRight: 40, width: 240 }}
            value={{
              key: this.props.phaseSubject.get('id').toString(),
              label: this.props.phaseSubject.get('name')
            }}
            labelInValue
            onChange={(value) => this.props.handlePhaseSubjectSelectOnChange(value, this.props)}
          >
            {this.props.phaseSubjectList.map((phaseSubject) => (
              <Select.Option
                value={phaseSubject.get('id').toString()}
                key={phaseSubject.get('id')}
                title={phaseSubject.get('name')}
              >
                {phaseSubject.get('name')}
              </Select.Option>
              ))}
          </Select>
        </HeaderWrapper>
        <BodyWrapper>
          <div style={{ whiteSpace: 'nowrap', textAlign: 'center', width: '100%' }}>{bodyItems}</div>
        </BodyWrapper>
        <CollectionCreateForm
          {...this.props.inputDto.toJS()}
          ref={(form) => { this.form = form }}
          visible={modalAttr.get('visible')}
          onChange={(values) => this.props.onChange(this.props, values)}
          onCancel={() => {
            this.initSelectKnowledge();
            dispatch(setModalAttrAction(modalAttr.set('visible', false)));
          }}
          onCreate={() => {
            this.form.validateFields((err, values) => {
              if (err) {
                return;
              }
              dispatch(saveAction(this.state.selectedKnowledge, this.state.copyWriting));
            });
          }}
          showKnowledgeTreeFunc={this.showKnowledgeTreeFunc}
          knowledgeNameStr={knowledgeNameStr}
          controlCopyWritingModal={this.controlCopyWritingModal}
          showCopyWriting={showCopyWriting}
          saveCopyWriting={(values) => { this.saveCopyWriting(values) }}
          copyWriting={copyWriting}
        />
        {this.props.isLoading ? (
          <BgModal>
            <CenterDiv>
              <Spin size="large" />
            </CenterDiv>
          </BgModal>
        ) : (
          ''
        )}
        {showKnowledgeTree ? (
          <SelectKnowledgeModal
            originKnowledgeList={originKnowledgeList}
            selectedKnowledge={selectedKnowledge}
            curKnowledge={curKnowledge}
            onOk={(selectedKnowledge) => {
              let targetLabel = [];
              let targetLabelStr = this.makeKnowledgeLabels(originKnowledgeList, selectedKnowledge.toJS().map(e => Number(e)), targetLabel);
              this.setState({
                selectedKnowledge,
                /* knowledgeNameStr: backChooseItem(originKnowledgeList, selectedKnowledge.toJS().map(e => Number(e))).join('、'), */
                knowledgeNameStr: targetLabelStr
              });
              this.showKnowledgeTreeFunc(false);
            }}
            onCancel={() => {
              this.showKnowledgeTreeFunc(false);
            }}
          />
        ) : null}
        {/** 知识点图谱 */}
        {showKnowledgeAtlas ? (
          <KonwledgeModal
            close={this.showKnowledgeAtlas.bind(this, false)}
            curKnowledgeId={curKnowledgeId}
            curKnowledgeItemList={curKnowledgeItemList}
          />
        ) : null}
      </Wrapper>
    );
  }
}

const CollectionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: {
        ...props.name,
        value: props.name
      },
      comprehensiveDegree: {
        ...props.comprehensiveDegree,
        value: props.comprehensiveDegree ? props.comprehensiveDegree.toString() : ''
      },
      examFrequency: {
        ...props.examFrequency,
        value: props.examFrequency ? props.examFrequency.toString() : ''
      },
      labelList: {
        ...props.labelList,
        value: props.labelList
      },
      sceneList: {
        ...props.sceneList,
        value: props.sceneList
      },
      difficulty: {
        ...props.difficulty,
        value: props.difficulty,
      },
    };
  }
})((props) => {
  const { visible, onCancel, onCreate, showKnowledgeTreeFunc, knowledgeNameStr, form, controlCopyWritingModal, showCopyWriting, saveCopyWriting, copyWriting } = props;
  const { getFieldDecorator } = form;
  return (
    <Modal visible={visible} onOk={onCreate} onCancel={onCancel} width={700}>
      <div>
        <Form layout="vertical">
          <FormItem label="名称">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入名称' },
                { whitespace: true, message: '请输入名称' } /* , { max: 20, message: '不能超过20个字符' } */
              ]
            })(<Input placeholder="请输入名称" />)}
          </FormItem>
          <FormItem label="综合度">
            {getFieldDecorator('comprehensiveDegree', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <Select>
                <Select.Option key={1} value={'1'} title={'L1'}>
                  L1
                </Select.Option>
                <Select.Option key={2} value={'2'} title={'L2'}>
                  L2
                </Select.Option>
                <Select.Option key={3} value={'3'} title={'L3'}>
                  L3
                </Select.Option>
                <Select.Option key={4} value={'4'} title={'L4'}>
                  L4
                </Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="考试频率">
            {getFieldDecorator('examFrequency', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <Select>
                <Select.Option key={1} value={'1'} title={'低'}>
                  低
                </Select.Option>
                <Select.Option key={2} value={'2'} title={'中'}>
                  中
                </Select.Option>
                <Select.Option key={3} value={'3'} title={'高'}>
                  高
                </Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="场景">
            {getFieldDecorator('sceneList', {
              rules: [{ required: true, message: '请选择至少一项' }]
            })(
              <Checkbox.Group>
                {sceneListEnum.map((e, index) => <Checkbox key={index + 1} value={index + 1}>{e}</Checkbox>)}
              </Checkbox.Group>
            )}
          </FormItem>
          <FormItem label="标签">
            {getFieldDecorator('labelList', {
              rules: [{ required: true, message: '请选择至少一项' }]
            })(
              <Checkbox.Group>
                {labelListEnum.map((e, index) => <Checkbox key={index + 1} value={index + 1}>{e}</Checkbox>)}
              </Checkbox.Group>
            )}
          </FormItem>
          <FormItem label="难度">
            {getFieldDecorator('difficulty', {
              rules: [{ required: true, validator: (rule, value, callback) => {
                if (value > 0) {
                  callback();
                } else {
                  callback('请选择难度');
                }
              }, message: '请选择一个难度' }]
            })(
              <Radio.Group>
                <Radio key={1} value={1}>低</Radio>
                <Radio key={2} value={2}>中</Radio>
                <Radio key={3} value={3}>高</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem>
            <Button style={{ marginRight: 10 }} type="primary" onClick={() => showKnowledgeTreeFunc(true)}>前置知识点绑定</Button>
            <Button style={{ marginRight: 10 }} type="primary" onClick={() => controlCopyWritingModal(true)}>知识点文案编辑</Button>
          </FormItem>
          {
            knowledgeNameStr ? (<FormItem label="已关联知识点">
              <div style={{ maxHeight: '50px', overflow: 'hidden', overflowY: 'auto', lineHeight: '20px' }}>
                {knowledgeNameStr}
              </div>
            </FormItem>) : null
          }
          {
            Object.keys(copyWriting).length > 0 ? (<FormItem label="知识点文案">
              <div style={{ maxHeight: '60px', overflow: 'hidden', overflowY: 'auto', lineHeight: '20px' }}>
                <TextWrap><strong>学习建议(好)：</strong><Text>{copyWriting.studySuggestionEasy}</Text></TextWrap>
                <TextWrap><strong>学习建议(中)：</strong><Text>{copyWriting.studySuggestionMiddle}</Text></TextWrap>
                <TextWrap><strong>学习建议(差)：</strong><Text>{copyWriting.studySuggestionDifficulty}</Text></TextWrap>
              </div>
            </FormItem>) : null
          }
        </Form>
        {showCopyWriting ?
          <Modal
            footer={null}
            title="知识点文案编辑"
            visible={true}
            closable={false}
            maskClosable={false}
          >
            <CopyWritingForm
              initialForm={copyWriting}
              handleCancel={() => { controlCopyWritingModal(false) }}
              handleSubmit={(values) => { saveCopyWriting(values) }}
              maxLength={300}
            />
          </Modal>
        : null }
      </div>
    </Modal>
  );
});

Knowledge.propTypes = {
  dispatch: PropTypes.func.isRequired,
  phaseSubjectList: PropTypes.instanceOf(Immutable.List).isRequired,
  phaseSubject: PropTypes.instanceOf(Immutable.Map).isRequired,
  knowledgeList: PropTypes.instanceOf(Immutable.List).isRequired,
  selectedKnowledgeList: PropTypes.instanceOf(Immutable.List).isRequired,
  handleOnFooterBtnClick: PropTypes.func.isRequired,
  inputDto: PropTypes.instanceOf(Immutable.Map).isRequired,
  onChange: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  goToUpdate: PropTypes.func.isRequired,
  goToDelete: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  handleItemOnClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handlePopCancel: PropTypes.func.isRequired,
  modalAttr: PropTypes.instanceOf(Immutable.Map).isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = createStructuredSelector({
  // Knowledge: makeSelectKnowledge(),
  phaseSubjectList: makeSelectPhaseSubjectList(),
  phaseSubject: makeSelectPhaseSubject(),
  knowledgeList: makeSelectKnowledgeList(),
  selectedKnowledgeList: makeSelectSelectedKnowledgeList(),
  inputDto: makeSelectInputDto(),
  crudId: makeSelectCrudId(),
  modalAttr: makeSelectModalAttr(),
  isLoading: makeIsLoading(),
  originKnowledgeList: makeSelectOriginKnowledgeList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handlePhaseSubjectSelectOnChange: (value, props) => {
      dispatch(setPhaseSubjectAction(props.phaseSubject.set('id', value.key).set('name', value.label)));
      dispatch(getKnowledgeListAction());
      dispatch(getOriginKnowledgeListAction());
    },
    handleItemOnClick: (item, index, props) => {
      // console.log('点击了：', item, index, props);
      const level = item.level;
      dispatch(setSelectedKnowledgeListAction(props.selectedKnowledgeList.set(level - 1, fromJS(item))));
      dispatch(setCrudIdAction(item.id));
      dispatch(setInputDtoAction(props.inputDto.set('level', item.level)));
      dispatch(getKnowledgeAction());
    },
    handleOnFooterBtnClick: (level, props) => {
      // console.log(level, 'handleOnFooterBtnClick');
      dispatch(setCrudIdAction(0));
      dispatch(
        setInputDtoAction(
          props.inputDto
            .set('name', '')
            .set('comprehensiveDegree', '1')
            .set('examFrequency', '1')
            .set('sort', '')
            .set('sceneList', [])
            .set('labelList', [])
            .set('difficulty', 0)
            .set('level', level)
            .set('id', void 0)
        )
      );
      dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
    },
    onChange: (props, values) => {
      // console.log(values, 'onChange');
      let dto = props.inputDto;
      if (values.name) {
        dto = dto.set('name', values.name.value);
      }
      if (values.comprehensiveDegree) {
        dto = dto.set('comprehensiveDegree', values.comprehensiveDegree.value);
      }
      if (values.examFrequency) {
        dto = dto.set('examFrequency', values.examFrequency.value);
      }
      if (values.labelList) {
        dto = dto.set('labelList', values.labelList.value);
      }
      if (values.sceneList) {
        dto = dto.set('sceneList', values.sceneList.value);
      }
      if (values.difficulty) {
        dto = dto.set('difficulty', values.difficulty.value);
      }
      // console.log(dto.toJS(), 'dto');
      dispatch(setInputDtoAction(dto));
    },
    save: () => {
      // console.log('save');
      dispatch(saveAction());
    },
    cancel: () => {
      // console.log('cancel');
      dispatch(getKnowledgeListAction());
    },
    onMouseOver: (level, index, props) => {
      // console.log('onMouseOver');
      const editor = props.knowledgeList.get(level).find((value) => value.get('editable') === true);
      if (editor) {
        return;
      }
      const list = props.knowledgeList
        .get(level)
        .map((value, index2) => value.set('toolBarVisible', index === index2));
      dispatch(setKnowledgeListAction(props.knowledgeList.set(level, list)));
      // console.log('我来了');
    },
    onMouseLeave: (level, props) => {
      // console.log('onMouseLeave');
      // console.log('props.crudId:', props.crudId);
      if (props.crudId !== 0) {
        return;
      }
      const list = props.knowledgeList.get(level).map((value) => value.set('toolBarVisible', false));
      dispatch(setKnowledgeListAction(props.knowledgeList.set(level, list)));
      // console.log('我又走了');
    },
    goToUpdate: (e, item, index, props) => {
      e.stopPropagation();
      dispatch(setCrudIdAction(item.id));
      dispatch(setModalAttrAction(props.modalAttr.set('visible', true)));
      dispatch(
        setInputDtoAction(
          props.inputDto
            .set('name', item.name)
            .set('comprehensiveDegree', item.comprehensiveDegree)
            .set('examFrequency', item.examFrequency)
            .set('sort', item.sort)
            .set('sceneList', fromJS(item.sceneList || []))
            .set('labelList', fromJS(item.labelList || []))
            .set('difficulty', item.difficulty || 0)
            .set('level', item.level)
            .set('index', index)
        )
      );
    },
    goToDelete: (e, level, index, props) => {
      e.stopPropagation();
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      const deleteId = props.knowledgeList.get(level).get(index).get('id');
      dispatch(setCrudIdAction(deleteId));
      // console.log('goToDelete:', deleteId);
    },
    handleDelete: (e, item, index, props) => {
      e.stopPropagation();
      dispatch(setInputDtoAction(props.inputDto.set('level', item.level).set('index', index)));
      dispatch(setCrudIdAction(item.id));
      dispatch(deleteAction());
      // console.log('handleDelete');
    },
    handlePopCancel: (e) => {
      e.stopPropagation();
      dispatch(setCrudIdAction(0));
    },
    onDragStart: (e, level, index) => {
      e.stopPropagation();
      // console.log('拖动开始', level, index);
      e.dataTransfer.setData('text', JSON.stringify({ level, index }));
    },
    onDrop: (e, level, index, props) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('text'));
      if (level !== data.level) {
        message.warning('不同层级之间不可移动');
        return;
      }
      const list = props.knowledgeList;
      const oldData = list.get(level).get(data.index);
      const newData = list.get(level).get(index);
      const arr = list.get(level).set(data.index, newData).set(index, oldData);
      dispatch(setInputDtoAction(props.inputDto.set('level', level)));
      dispatch(setKnowledgeListAction(props.knowledgeList.set(level, arr)));
      dispatch(sortAction());
      // console.log('拖动结束', level, index, arr.toJS());
    },
    onDragOver: (e) => {
      e.preventDefault();
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Knowledge);
