
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Immutable, { fromJS } from 'immutable';
import { Modal,Tree,Icon,Popconfirm} from 'antd';
import { ContextMenuProvider, menuProvider } from 'react-contexify';
import { FadeInDiv, fadeIn, FlexRowDiv, FlexColumnDiv, DivShadow } from 'components/Div';
import TreeRightMenu from './TreeRightMenu'
import { setTreeDirectionModalOpen, getTreeDirectionAction, setTreeRightClickItemAction, setTreeRightMenuOpen, setTreeRightMenuTypeAction, setDeleteDirectionAction,
  setDragDirectionItemAction, setRemoveDirectionAction, setDropDirectionItem, setSelectRoteTreeItem} from './actions';
import { makeTreeDirectionModalOPen, makeTreeDirectionData, makeTreeRightClickItem,makeDragDirectionItem, makeDropDirectionItem, makeSelectRoteTreeItem } from './selectors';
const TreeNode = Tree.TreeNode;
const Span = styled.span`
  font-size:14px;
  cursor:pointer;
  margin:0 10px;
`;
const ContentDiv = styled(FlexColumnDiv)`
  min-height:250px;
  height:250px;
  width:100%;
  padding:20px 0;
  justify-content:space-between;
`;
const TreeContent = styled.div`
  height:250px;
  overflow-y:auto;
  min-height:250px;
  .children{
    margin-left:20px;
    line-height:10px;
  }
  .parent{
    display:block;
    line-height:30px;
    color:#333;
  }
  .inlindiv{
    display:inline-block;
    margin-left:30px;
  }
  .hidechild > .children{
    display:none;
  }
`;
const ParentDiv =styled.div`
  display:block;
  line-height:30px;
  color:#333;
  background:${(props) => props.isActive ? '#eee': '#fff'};
`;
const RoteSpan = styled.span`
  margin-right:3px;
  cursor:pointer;
`;
export class TreeDirection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props){
    super(props);
    this.onTreeSelectAction = this.onTreeSelectAction.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
    this.onDragStartAction = this.onDragStartAction.bind(this);
    this.onDragEnterAction = this.onDragEnterAction.bind(this);
    this.onDropAction = this.onDropAction.bind(this);
    this.onDragoverAction = this.onDragoverAction.bind(this);
    this.state = {
      treedata:[
        {name:'根目录',id:-1,level:0,parentId:-1,type:-1,count:0}
      ],
      treeRightClickItem:{},
      clickItem:{},
    }
  }
  componentDidMount(){
    // this.props.dispatch(getTreeDirectionAction())
  }
  onTreeSelectAction(selectedKeys,selectedNodes,e){
    console.log('selectedKeys',selectedKeys,selectedNodes,e)
  }
  onRightClick(info){
    console.log('nodee>>',info,info.node)
    this.props.dispatch(setTreeRightClickItemAction(fromJS(info.node.props)))

  }
  onDragStartAction(item) {
    this.props.dispatch(setDragDirectionItemAction(fromJS(item)))
  }
  onDragEnterAction(item) {
    // console.log('dragEnter',item)
  }
  onDropAction(item) {
    if(item.id === this.props.dragItem.get('id') || this.props.dragItem.get('id') === 0 || item.parentId !== this.props.dragItem.get('parentId') ){
      console.log('不允许拖动');
      return;
    }
    this.props.dispatch(setDropDirectionItem(fromJS(item)));
    this.props.dispatch(setRemoveDirectionAction())
  }
  onDragoverAction(e) {
    e.preventDefault();
  }
  render() {
    console.log('menu',this.props.directionData.toJS())
    const makeMenu=(item)=>{
      if(this.props.selectTreeItem.get('id')==item.id){
        if(this.props.selectTreeItem.get('id') === 0){
          return <div className="inlindiv">
            <Span onClick={() =>{
              this.props.dispatch(setTreeRightMenuTypeAction('add'));
              this.props.dispatch(setTreeRightClickItemAction(fromJS(item)));
              this.props.dispatch(setTreeRightMenuOpen(true))
            }}><Icon type="plus" /></Span>
          </div>
        }else{
        return <div className="inlindiv"><Span onClick={() =>{
          this.props.dispatch(setTreeRightMenuTypeAction('add'));
          this.props.dispatch(setTreeRightClickItemAction(fromJS(item)));
          this.props.dispatch(setTreeRightMenuOpen(true))
        }}><Icon type="plus" /></Span><Span><Popconfirm
          title="是否确定删除该目录"
          okText="确定"
          cancelText="取消"
          onConfirm={() => this.props.dispatch(setDeleteDirectionAction())}
        ><Icon type="delete" /></Popconfirm></Span><Span onClick={()=>{
          this.props.dispatch(setTreeRightMenuTypeAction('rename'));
          this.props.dispatch(setTreeRightClickItemAction(fromJS(item)));
          this.props.dispatch(setTreeRightMenuOpen(true));
        }}><Icon type="edit" /></Span></div>
        }
      }else{
        return ''
      }
    }
    const makeCheck=(id)=>{
      return this.props.selectRoteItem.filter((value) =>{ return value === id}).count() > 0 ? true : false;
    }
    // <Icon type="caret-right" />
    const node_loop = (data) =>{
      return data.map((item,index) =>{
        if(item.children && item.children.length > 0){
          return <ParentDiv className={makeCheck(item.id) ? 'hidechild' : ''} isActive={this.props.selectTreeItem.get('id') === item.id} key={item.id}>{makeRote(item)}<span draggable="true" onDragOver={this.onDragoverAction} onDrop={() => this.onDropAction(item)} onDragEnter={() => this.onDragEnterAction(item)} onDragStart={() => this.onDragStartAction(item)} onClick={() => this.props.onClickTreeItemAction(item)}>{`${item.name} (${item.count})`}</span>{makeMenu(item)}<div className="children">{node_loop(item.children)}</div></ParentDiv>
        }
        return <ParentDiv className={makeCheck(item.id) ? 'hidechild' : ''} key={index} isActive={this.props.selectTreeItem.get('id') === item.id} >{makeRote(item)}<span draggable="true" onDragOver={this.onDragoverAction} onDrop={() => this.onDropAction(item)} onDragEnter={() => this.onDragEnterAction(item)} onDragStart={() => this.onDragStartAction(item)} onClick={() => this.props.onClickTreeItemAction(item)}>{`${item.name} (${item.count})`}</span>{makeMenu(item)}</ParentDiv>
      })
    };
    const makeRote = (item) =>{
     if(item.level===3){
       return ''
     }else {
       return this.props.selectRoteItem.filter((value) => {
         return value == item.id;
       }).count() > 0 ? (<RoteSpan onClick={() => {
         this.props.dispatch(setSelectRoteTreeItem(item.id))
       }}><Icon type="caret-down"/></RoteSpan>) : (<RoteSpan onClick={() => {
         this.props.dispatch(setSelectRoteTreeItem(item.id))
       }}><Icon type="caret-right"/></RoteSpan>)
     }
    }
    return (
      <Modal
        visible={this.props.modalOpen}
        title="目录设置"
        footer=""
        width={'620px'}
        style={{minHeight:'250px',overflowY:'auto'}}
        maskClosable={false}
        onCancel={()=> {
          this.props.dispatch(setTreeDirectionModalOpen(false));
          this.props.dispatch(setTreeRightClickItemAction(fromJS({})));
        }}
      >
        <TreeContent>
          {node_loop(this.props.directionData.toJS())}
        </TreeContent>
        <TreeRightMenu></TreeRightMenu>
      </Modal>
    );
  }
}
TreeDirection.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalOpen:PropTypes.bool.isRequired,
  directionData:PropTypes.instanceOf(Immutable.List).isRequired,
  onClickTreeItemAction:PropTypes.func.isRequired,
  selectTreeItem:PropTypes.instanceOf(Immutable.Map).isRequired,
  dragItem:PropTypes.instanceOf(Immutable.Map).isRequired,
  dropItem:PropTypes.instanceOf(Immutable.Map).isRequired,
  selectRoteItem:PropTypes.instanceOf(Immutable.List).isRequired,
};

const mapStateToProps = createStructuredSelector({
  modalOpen:makeTreeDirectionModalOPen(),
  directionData: makeTreeDirectionData(),
  selectTreeItem: makeTreeRightClickItem(),
  dragItem:makeDragDirectionItem(),
  dropItem:makeDropDirectionItem(),
  selectRoteItem: makeSelectRoteTreeItem(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onClickTreeItemAction:(item) => dispatch(setTreeRightClickItemAction(fromJS(item)))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TreeDirection);

