/**
*
* Tree
*
*/

import React, { PropTypes } from 'react';
// import styled from 'styled-components';
import ModalWithSearch from './SearchTreeWithModal';
import SearchTree from './SearchTree';

export default class Tree extends React.PureComponent {
  static ModalWithSearch = ModalWithSearch;
  static SearchTree = SearchTree;
  static propTypes = {
    data: PropTypes.array,      // eslint-disable-line
    draggable: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.array,  // eslint-disable-line
  };
  render() {
    return (
      <div>
        {React.Children.toArray(this.props.children)}
      </div>
    );
  }
}

export class TreeNode extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    draggable: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.array,  // eslint-disable-line
  };
  onDragStart = (e) => {
    // console.log('拖动开始');
    e.dataTransfer.setData('Text', e.target.id);
  };
  onDrop= (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('Text');
    const pNode = e.target.parentNode.parentNode.parentNode;
    pNode.appendChild(document.getElementById(data));
    // console.log('拖动结束');
  };
  onDragOver = (e) => {
    e.preventDefault();
  };
  render() {
    return (
      <div style={{ paddingLeft: 20 }} id={this.props.id} draggable={this.props.draggable} onDragStart={this.onDragStart} onDrop={this.onDrop} onDragOver={this.onDragOver} >
        <div>
          <span>{this.props.title}</span>
        </div>
        {React.Children.toArray(this.props.children)}
      </div>
    );
  }
}
