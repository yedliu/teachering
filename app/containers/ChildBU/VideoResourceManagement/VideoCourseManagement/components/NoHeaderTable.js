import React from 'react';
import styled, { keyframes } from 'styled-components';
const TableWrapper = styled.div`
  width: 100%;
  padding: 10px 0;
`;
const showAnimation = keyframes`
  0% {
    opacity: 0; 
   }
  50% {
    opacity: 0.5; 
  }
  100% {
    opacity: 1;
  }
`;
const ButtonWrapper = styled.div`
  position: absolute;
  height: 30px;
  margin: auto;
  top: -8px;
  bottom: 0;
  right: 16px;
  /*display: none;*/
`;
const TableItem = styled.div`
  width: 100%;
  background: #fff;
  min-height: 60px;
  margin-bottom: 16px;
  padding: 0 16px;
  position: relative;
  border-radius: 2px;
  /*&:hover ${ButtonWrapper} {
    display: block;
    animation: ${showAnimation} 1s linear;
  }*/
`;
const ItemTop = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
`;
const Title = styled.div`
  font-size: 16px;
  margin-right: 20px;
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
  overflow: hidden;
`;
const SubTitle = styled.div`
  font-size: 12px;
  color: rgb(153, 153, 153);
  float: left;
`;
const ItemBottom = styled.div`
  width: 100%;
  color: rgb(153, 153, 153);
`;
const Column = styled.div`
  display: inline-block;
  font-size: 14px;
  margin-right: 20px;
`;
// const CustomButton = styled.button`
//   height: 30px;
//   line-height: 30px;
//   background: #108ee9;
//   border-radius: 5px;
//   padding: 0 15px;
//   font-size: 12px;
//   margin-left: 20px;
//   color: #fff;
//   border-color: #108ee9;
//   cursor: pointer;
// `;
const TextBtn = styled.span`
color: #108ee9;
margin-right: 16px;
cursor: pointer;
`;
class NoHeaderTable extends React.Component {
  render() {
    const { listData, onAction } = this.props;
    const renderTableItem = (list) => {
      return list.map((item) => {
        return (<TableItem key={item.id}>
          <ItemTop>
            <Title title={item.title}>
              {item.title}
            </Title>
            {item.subTitles.map((sub, index) => {
              return <SubTitle key={index}>{sub}</SubTitle>;
            })}
          </ItemTop>
          <ItemBottom>
            {
              item.columns.map((c, i) => {
                return <Column key={i}>{c}</Column>;
              })
            }
          </ItemBottom>
          <ButtonWrapper>
            {item.actions.map((b, i) => {
              return <TextBtn key={i} onClick={() => { onAction(b, item) }}  >{b}</TextBtn>;
            })}
          </ButtonWrapper>
        </TableItem>);
      });
    };
    return (
      <TableWrapper>
        {
          renderTableItem(listData)
        }
      </TableWrapper>
    );
  }
}
export default NoHeaderTable;
