import styled from 'styled-components';
import React from 'react';
import { Icon } from 'antd';
import './index.css';
import { titleCase } from 'utils/stringUtil';

export const SorterWrpper = styled.div`
    position: relative;
    margin-left: 4px;
    display: inline-block;
    width: 14px;
    height: 1em;
    vertical-align: middle;
    text-align: center;
    transform : scale(0.8);
`;
const IconWrapper = styled.span `
    line-height: 6px;
    display: block;
    width: 14px;
    cursor: pointer;
    font-size: 14px;
    color: #999;
    transform: scale(0.8);
    &:hover {
      color: #666;
    };
`;

export default class SorterCmp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAscend: false,
      isDescend: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { sortOn } = nextProps;
    if  (!sortOn) {
      this.init();
    }
  }
  init = () => {
    this.setState({ isAscend: false, isDescend: false });
  }
  handleClick = (method) => {
    const { columnKey, onChange } = this.props;
    const status = `is${titleCase(method)}`;
    // console.log('handleClick', this.state[status], method, columnKey);
    if (method === 'ascend') {
      this.setState({
        [status]: !this.state[status],
        isDescend: false,
      });
    } else if (method === 'descend') {
      this.setState({
        [status]: !this.state[status],
        isAscend: false
      });
    } else {
      this.init();
    }
    setTimeout(() => {
      onChange(this.state[status] ? { columnKey: columnKey, order: method } : {});
    }, 0);
  }
  render() {
    const { isAscend, isDescend } = this.state;
    // console.log('render', this.state, this.props.columnKey);
    return (
      <SorterWrpper>
        <IconWrapper title="↑" onClick={() => this.handleClick('ascend')} id="iconWrapper">
          <Icon  type="caret-up"  className={isAscend ? 'on' : 'off'} />
        </IconWrapper>
        <IconWrapper title="↓" onClick={() => this.handleClick('descend')} id="iconWrapper">
          <Icon  type="caret-down" className={isDescend ? 'on' : 'off'} />
        </IconWrapper>
      </SorterWrpper>
    );
  }
}
