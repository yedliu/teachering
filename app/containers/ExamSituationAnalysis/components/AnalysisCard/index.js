import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
const Dot = styled.span`
  color: red;
`;
class AnalysisCard extends React.Component {
  renderTitle = () => {
    const { title, tip } = this.props;
    return <div>
      <strong>{title}</strong>
      （<Dot>*</Dot>
      {tip}）
    </div>;
  }
  render() {
    const { children } = this.props;
    return <Card title={this.renderTitle()} style={{ marginBottom: 20 }}>
      {children}
    </Card>;
  }
}
export default AnalysisCard;
