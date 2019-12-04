import styled from 'styled-components';

const SubmitLoading = styled.div`
  width: 100%;
  position: absolute;
  height: 100%;
  background: rgba(0,0,0,0.3);
  z-index: 99;
  div:first-child {
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 400px;
  }
`;

export { SubmitLoading };

export default {
  SubmitLoading,
};
