
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import { Button,Row, Col, Checkbox, Modal,Select,Input,Radio} from 'antd';
import {ContextMenu, Item, Separator, menuProvider} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css'
import { FadeInDiv, fadeIn, FlexRowDiv, FlexColumnDiv, DivShadow } from 'components/Div';
import { makeTreeRightClickItem, makeTreeRightMenuOpen, makeTreeRightMenuType, makeAddDirectionInfo } from './selectors';
import { setTreeRightMenuOpen, setRenameSelectTreeItem, setRenameDirectionAction, setCreateDirectionAction, setAddDirectionInfo, setResetAddDirectionInfoAction } from './actions';
const RadioGroup = Radio.Group;
const addMenu = [
  {label:'上方添加',value:1},
  {label:'下方添加',value:2},
  {label:'添加子目录',value:3},
];
const LevelMenu = [
  {label:'上方添加',value:1},
  {label:'下方添加',value:2}
];
const RootMenu = [
  {label:'添加子目录',value:3},
]
export class TreeRightMenu extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props){
    super(props);
    this.makeMenu = this.makeMenu.bind(this);
  }
  makeMenu(type){
    const makeRenameContent=()=>{
      return <Row>
        <Input maxLength="15" value={this.props.treeItem.get('name','')} onChange={(e)=>{
          this.props.dispatch(setRenameSelectTreeItem(e.target.value))
        }}/>
        <Row type={'flex'} justify={'center'} style={{marginTop:'20px'}}>
          <Button onClick={()=>{
            this.props.dispatch(setRenameDirectionAction());
          }}>确定</Button>
        </Row>
      </Row>
    }
    const makeAddDirectionContent=()=>{
      const Level = this.props.treeItem.get('level');
      const resultMenu = Level === 3 ? LevelMenu : Level === 0 ? RootMenu : addMenu;
      return <div><Row>
        <RadioGroup
          value={this.props.addDirectionInfo.get('option')}
          onChange={(e) =>{
            this.props.dispatch(setAddDirectionInfo('option',e.target.value))
          }}
        >
          {resultMenu.map((item,index)=>{
            return <Radio key={index} value={item.value}>{item.label}</Radio>
          })}
        </RadioGroup>
      </Row>
      <Row style={{margin:'20px 0'}}>
        <Input maxLength="15" placeholder="目录名" value={this.props.addDirectionInfo.get('name')} onChange={(e) =>{
          this.props.dispatch(setAddDirectionInfo('name',e.target.value))
        }}/>
      </Row>
      <Row type={'flex'} justify={'center'}>
        <Button onClick={()=>{
          this.props.dispatch(setCreateDirectionAction());
        }}>提交</Button>
      </Row>
      </div>
    }
    switch (type){
      case 'rename':
        return <div>{makeRenameContent()}</div>
      case 'add':
        return <div>{makeAddDirectionContent()}</div>
      default:
        return <div>......</div>
    }
  }

  render() {
    return (<Modal
      visible={this.props.modalOpen}
      title={this.props.actionType ==='add'? "添加目录" : '重命名'}
      footer=""
      maskClosable={false}
      onCancel={() => {
        this.props.dispatch(setTreeRightMenuOpen(false));
        this.props.dispatch(setResetAddDirectionInfoAction(fromJS({})));
      }}
    >
      {this.makeMenu(this.props.actionType)}
    </Modal>)
  }
}

TreeRightMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalOpen:PropTypes.bool.isRequired,
  treeItem:PropTypes.instanceOf(Immutable.Map).isRequired,
  actionType:PropTypes.string.isRequired,
  addDirectionInfo:PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = createStructuredSelector({
  treeItem: makeTreeRightClickItem(),
  modalOpen: makeTreeRightMenuOpen(),
  actionType: makeTreeRightMenuType(),
  addDirectionInfo: makeAddDirectionInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TreeRightMenu);

