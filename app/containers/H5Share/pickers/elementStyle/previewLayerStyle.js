import styled, { injectGlobal } from 'styled-components';

export const ActionBar = styled.div`
  position: absolute;
  margin: auto;
  z-index: 1;
  padding: 5px 10px;
  text-align: center;
  background: rgba(255, 255, 255, 0.85);
  > span {
    margin-left: 10px;
  }
`;

export const PreviewBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 5px;
  overflow: hidden;
`;

export const IframeBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  #previewBox {
    width: 100%;
    height: 100%;
    border: none;
  }
`;