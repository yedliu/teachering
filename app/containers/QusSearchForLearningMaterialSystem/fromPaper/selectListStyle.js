import styled from 'styled-components';

const wrapperCollapseHeight = 45;

export const SelectListWrapper = styled.div`
  position: relative;
  z-index: 5;
  height: ${wrapperCollapseHeight}px;
  min-height: ${wrapperCollapseHeight}px;
  position: relative;
`;
export const SelectListBox = styled.div`
  height: ${(props) => (props.collapse ? `${wrapperCollapseHeight}px` : 'auto')};
  overflow-y: ${(props) => (props.collapse ? 'hidden' : 'auto')};
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .2);
  transition: height 0.2s linear;
`;

export const FieldsDiv = styled.div`
  padding: 10px 100px 10px 10px;
  position: relative;
  oneFild {
    margin-bottom: 8px;
    margin-right: 10px;
    display: inline-block;
    filedLabel {
      margin:0 5px;
      min-width: 60px;
      display: inline-block;
      text-align: right;
    }
  }
`;
export const Collapse = styled.span`
  position: absolute;
  right: 20px;
  bottom: 10px;
  color: #108ee9;
  text-decoration-line: underline;
  text-decoration-color: #108ee9;
  text-decoration-style: solid;
  cursor: pointer;
  user-select: none;
  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.7;
  }
`;