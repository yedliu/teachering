import React, { PropTypes } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FlexColumnDiv, FlexRowDiv } from '../../../components/Div';
import { sliderScale, previewOriginWidth } from '../config';

const positionCenter = `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`;

// 预览环节
export const PreviewWarper = styled.div`
  height: 100%;
  border: 1px solid #7f7f7f;
  box-sizing: border-box;
`;

export const PreviewBox = styled.div`
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 0;
    color: #efefef;
    background-color: #ffffff;  
  }
`;

export const PrevPage = styled.div`
  width: 20px;
  height: 55px;
  ${positionCenter};
  right: auto;
  opacity: 0.25;
  >span {
    transform: scale(0.75);
    color: rgba(0, 0, 0 ,0.45);
  }
`;

export const NextPage = styled.div`
  width: 20px;
  height: 55px;
  ${positionCenter};
  left: auto;
  opacity: 0.25;
  >span {
    transform: scale(0.75);
    color: rgba(0, 0, 0 ,0.45);
  }
`;

export const RemarkArea = styled.div`
  position: absolute;
  width: 5em;
  max-height: 1.5em;
  right: 0;
  bottom: 0;
  opacity: 0.45;
  overflow: hidden;
  word-wrap: break-word;
  &:hover {
    opacity: 1;
    width: 100%;
    max-height: 100%;
    overflow: auto;
    background: rgba(255, 255, 255, 0.75);
  }
`;