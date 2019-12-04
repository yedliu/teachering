import React from 'react';

const iStyle = {
  position: 'absolute',
  zIndex: 10,
  display: 'inline-block',
  top: '0',
  left: '0',
  padding: '2px 4px',
  background: 'rgb(197, 226, 246)',
  border: '1px solid #5E83A7',
  boxShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 8px',
  borderRadius: '2px',
  fontSize: '12px',
  lineHeight: '16px',
  cursor: 'pointer',
  width: 70,
};

class ZmTip extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.clickEvent = this.clickEvent.bind(this);
  }
  clickEvent(e) {
    e.preventDefault();
    this.props.addAnswer(e);
  }
  render() {
    const { style = {}} = this.props;
    return (<div style={Object.assign({}, iStyle, style)} onClick={this.clickEvent}>
      +设为答案
    </div>);
  }
}

export default ZmTip;
