import styled from 'styled-components';

export const PaperListWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
export const SortDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid rgba(215, 215, 215, 0.3);
  .selected {
    color: #2385EE;
  }
  dd {
    margin: 0 5px;
    cursor: pointer;
  }
  b {
    color: #333333;
  }
`;
export const SpceButtonDiv = styled.div`
  button {
    margin: 2px 5px;
  }
`;