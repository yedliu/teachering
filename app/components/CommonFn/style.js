import { FlexRowCenter, FlexColumn, FadeIn } from 'components/FlexBox';
import styled, { css } from 'styled-components';
import { chooseFont, pointToUnity } from './index';

export const RootWrapper = styled(FlexColumn)`
  min-width: 800px;
  background: #f5f6f8;
`;
export const PlaceHolderBox = styled.div`
  flex: ${(props) => (props.flex ? props.flex : 99)};
`;

export const ClearFix = styled.div`
  &::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
`;
export const ContainerHeader = styled(FlexRowCenter) `
  height: ${(props) => (props.height ? props.height : 50)}px;
  min-height: ${(props) => (props.height ? props.height : 50)}px;
  background: ${(props) => (props.bgc ? props.bgc : '#fff')};
  padding: ${(props) => (props.pd ? props.pd : '0 20px')};
`;
export const WidthBox = styled.div`
  width: ${props => props.width || 20}px;
`;
export const MinWidthBox = styled.p`
  min-width: ${props => props.width || 20}px;
`;
export const HeightBox = styled.div`
  height: ${props => props.height || 20}px;
`;
export const CustomBox = styled.div`
  width: ${props => props.width || 20}px;
  height: ${props => props.height || 20}px;
`;
export const questionContentStyle = css`
  .MathJye table {
    border-collapse: collapse;
    margin: 0;
    padding: 0;
    text-align: center;
    vertical-align: middle;
    line-height: normal;
    font-size: inherit;
    _font-size: 100%;
    font-style: normal;
    font-weight: normal;
    border: 0;
    float: none;
    display: inline-block;
    zoom: 0;
  }
  table.edittable {
    font-size: small !important;
    border-collapse: collapse;
    text-align: center;
    margin: 2px;
    word-wrap: break-word !important;
    td {
      word-wrap: break-word !important;
    }
  }
  table.edittable td,
  table.edittable th {
    line-height: 30px;
    padding: 5px;
    white-space: normal;
    word-break: break-all;
    border: 1px solid #000;
    vertical-align: middle;
  }
  table.composition {
    border-collapse: collapse;
    text-align: left;
    margin: 2px;
    width: 98%;
  }
  table.composition td,
  table.composition th {
    line-height: 30px;
    white-space: normal;
    word-break: break-all;
    border-width: 0;
    vertical-align: middle;
  }
  table.composition2 {
    border-collapse: collapse;
    width: auto;
  }
  table.composition2 td,
  table.composition2 th {
    text-align: left;
    line-height: 30px;
    white-space: normal;
    word-break: break-all;
    border: none;
    border-width: 0;
    vertical-align: middle;
  }
`;

export const textEllipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const wangStyle = css`
  table {
    // border-top: 1px solid #ccc;
    // border-left: 1px solid #ccc;
    display: inline-block;
    border: 1px solid #ccc;
  }
  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }
  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }
  table td {
    border-top: 1px solid #ccc;
  }
`;

export const questionStyle = css`
  color: #000;
  p {
    margin: 0;
    line-height: 2;
    font-family: '思源黑体 CN Normal', 'sans-serif' !important;
    font-size: 10.5pt;
    span[lang="EN-US"] {
      font-family: ${(props) => (props.subjectId === 1 ? 'sans-serif' : '"Arial Unicode MS","sans-serif"!important')};
    }
  }
  .katex {
    font: 400 1.21em KaTeX_Main, Times New Roman, serif !important;
    font-size: 1.1em !important;
    white-space: normal;
    .text {
      font-family: '思源黑体 CN Normal', 'sans-serif' !important;
      color: #000;
    }
  }
  math {
    display: none;
  }
`;
export const breakword = css`
  word-break: break-all;
  word-wrap: break-word;
`;
export const listStyle = css`
  ul {
    list-style-type: disc;
    list-style-position: inside;
  }
  ol {
    list-style-type: decimal;
    list-style-position: inside;
  }
`;
export const questionItemCss = styled.div`
  white-space: pre-wrap;
  p {
    font-size: 10.5pt;
    color: #000;
    line-height: 2em;
    .mord.text {
      font-family: ${props => chooseFont(props.subjectId)};
      font-size: 9pt;
    }
  }
  img {
    max-width: 100%;
    max-height: 400px;
  }
  img[zmtype='small'] {
    vertical-align: middle;
  }
  zmindent {
    display: inline-block;
    width: 2em;
    height: 1em;
    overflow: hidden;
    vertical-align: middle;
    color: transparent;
    user-select: none;
  }
  zmblank {
    box-sizing: border-box;
    display: inline-block;
    width: 4em;
    height: 1.5em;
    line-height: 1.5em;
    text-align: center;
    vertical-align: middle;
    border: ${(props) => (props.notShowBorder || pointToUnity(props.subjectId) ? 'none' : '1px solid #000')};
    color: ${(props) => (props.notShowBorder ? 'transparent' : '#000')};
    user-select: none;
  }
  zmsubline {
    box-sizing: border-box;
    display: inline-block;
    width: 4em;
    height: 1.5em;
    vertical-align: middle;
    line-height: 1.5em;
    text-align: center;
    border-bottom: 1px solid #000;
    color: ${(props) => (props.notShowBorder ? 'transparent' : '#000')};
    user-select: none;
  }
  .katex-html {
    background: ${(props) => (props.bgTransparent ? 'transparent' : '#9ff')};
    display: inline-block;
  }
  .katex .base {
    ${breakword}
  }
  ${wangStyle}
`;

export const BgModal = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  animation: ${FadeIn};
`;
export const CenterDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`;
