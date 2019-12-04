import React from 'react';
import styled from 'styled-components';
const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  background: #eee;
`;
const Type = styled.div`
  padding: 3px 10px;
  margin: 0 20px 5px 20px;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 5px;
  background: ${props => { return props.active ? '#108ee9' : '' }};
  color: ${props => { return props.active ? '#fff' : '' }};
  cursor: pointer;
`;

class ExamType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentExamTypeId: ''
    };
  }
  select=(item) => {
    const { select } = this.props;
    if (item) {
      this.setState({ currentExamTypeId: item.key });
      select(item.key);
    }
  }
  render() {
    const { examTypeList } = this.props;
    const { currentExamTypeId } = this.state;
    return (
      <Wrapper>
        {
          examTypeList ? examTypeList.map(item => {
            return <Type active={currentExamTypeId === item.key} key={item.key} onClick={() => { this.select(item) }}>{item.value}</Type>;
          }) : null
        }
      </Wrapper>
    );
  }
}
export default ExamType;
