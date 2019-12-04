// import React from 'react';
import styled from 'styled-components';
import { FlexColumnDiv } from '../../../components/Div';
import { sliderScale, previewOriginWidth } from '../config';
const GridSvg = window._baseUrl.imgCdn + '9b0297ac-83ba-4a6d-adf7-81c9f82e3ed4.svg';

const authorRadius = 8;
const paddingInner = 10;
const topEditHeight = 80;
const rightEditWidth = 304;
const defaultFontFamily = 'SourceHanSansCN, Arial, "思源黑体 CN Normal", "思源黑体 CN Regular", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "sans-serif", "Helvetica Neue For Number"';

const positionCenter = `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`;

const beforeAfter = `
  content: '';
  display: inline-block;
`;

// 提示说明区域
export const EmptyMessager = styled(FlexColumnDiv)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 120%;
`;

// 编辑页面区域
export const EditPageWarper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: ${topEditHeight + paddingInner}px;
  padding-right: ${rightEditWidth + paddingInner}px;
  padding-left: ${paddingInner}px;
  padding-bottom: ${paddingInner}px;
  overflow: hidden;
  background: #eaf1f2;
  user-select: none;
  &.disableEdit {
    >.elementTools,
    >.controlTools {
      filter: blur(1px);
    }
  }
`;

// 右键菜单
export const ContextMenuBox = styled.div`
  position: absolute;
  background: whitesmoke;
  width: 8em;
  z-index: 1;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  >div {
    text-align: center;
    padding: 5px 2em 5px 2em;
    border-bottom: 1px dashed #cacaca;
    &:last-child {
      border-bottom: none;
    }
  }
  ${props => {
    const { position = {}} = props;
    return position.fromBottom
      ? `left: ${props.position.x || 0}px; top: auto; bottom: ${props.position.y || 0}px;`
      : `left: ${props.position.x || 0}px; top: ${props.position.y || 0}px;`;
  }}
`;

// 编辑容器
export const EditPageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// 顶部插入元素栏
export const EditToolbarTop = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: calc(100% - ${rightEditWidth + 20}px);
  height: ${topEditHeight - 20}px;
  background: #fff;
  box-shadow: 0px 0px 5px rgba(102, 102, 102, 0.35);
  border: none;
  overflow: hidden;
  border-radius: 3px;
`;

// 顶部单个元素容器
export const ToolbarItems = styled(FlexColumnDiv)`
  width: 8%;
  position: relative;
  height: ${topEditHeight - 20}px;
  display: inline-flex;
  text-align: center;
  align-items: center;
  >span {
    display: inline-flex;
    justify-content: center;
    align-items: flex-end;
    flex: 3;
    transform-origin: center;
    transform: scale(0.86);
  }
  >span.text {
    align-items: flex-start;
    flex: 2;
    color: #999;
  }
`;

// 右侧工具栏
export const EditToolbarRight = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: ${rightEditWidth}px;
  height: 100%;
  ${props => props.invisible && 'visibility: hidden' || ''};
  box-shadow: 0px 1px 5px rgba(102, 102, 102, 0.35);
  background: #fff;
`;

// 编辑内容容器
export const EditPageContent = styled.div`
  width: 0;
  height: 0;
  ${positionCenter};
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
              0 1px 10px 0 rgba(0, 0, 0, 0.12),
              0 4px 5px 0 rgba(0, 0, 0, 0.14);
`;

// 对齐线
export const AlignmentLines = styled.div`
  position: absolute;
  background: SeaGreen;
  z-index: 1;
  ${props => props.aliginLeft && ` width: 1px; height: 100%; top: 0; left: ${props.aliginLeft}%; ` || ''}
  ${props => props.aliginTop && ` width: 100%; height: 1px; left: 0; top: ${props.aliginTop}%; ` || ''}
`;

// 编辑页面元素容器
export const EditPlayground = styled.div`
  width: ${previewOriginWidth}px;
  height: ${previewOriginWidth / sliderScale}px;
  font-family: ${defaultFontFamily};
  background: #ffffff;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: left top;
  transform: scale(${props => props.scale || 1});
  font-size: 14px;
  color: #666666;
  box-sizing: border-box;
  overflow: hidden;
  img {
    max-width: 100%;
  }
  img[zmtype="small"] {
    vertical-align: middle;
  }
  * {
      box-sizing: border-box;
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
    height: 1em;
    text-align: center;
    border: 1px solid #666666;
    color: transparent;
    border: transparent;
    user-select: none;
  }
  zmsubline {
    box-sizing: border-box;
    display: inline-block;
    width: 4em;
    position: relative;
    height: 1.5em;
    text-align: center;
    border-bottom: 1px solid #000;
    color: transparent;
    user-select: none;
  }
  zmsublineIndex {
    display: block;
    color: black;
    text-align: center;
    vertical-align: middle;
    position: absolute;
    left: 50%;
    bottom: 5px;
    font-size: 20px;
    border-radius: 50%;
    box-sizing: content-box;
    margin-left: -15px;
    width: 30px;
    line-height: 30px;
    height: 30px;
    border: solid black 1px;
  }
  /* 部分英文字幕下划线底部被截 */
  u {
    text-decoration: none;
    border-bottom: 1px solid;
    padding-bottom: .2em;
  }
  table {
    display: inline-block;
    border: 1px solid #666;
    border-collapse: collapse;
  }
  table td, table th {
    padding: 3px 5px;
    text-align: center;
    border: 1px solid #666;
    vertical-align: middle;
  }
  .katex-html {
    background: transparent!important;
    .base{
      white-space: normal!important;
    }
  }
  &.beachStyle {
    zmblank, zmsubline, zmsublineIndex, table, table td, table th {
      border-color: #723F0F;
      color: #723F0F;
    }
  }
  &.techStyle, &.oceanStyle, &.pyramidStyle {
    zmblank, zmsubline, zmsublineIndex, table, table td, table th {
      border-color: #ffffff;
      color: #ffffff;
    }
  }
  &.rainforestStyle {
    zmblank, zmsubline, zmsublineIndex, table, table td, table th {
      border-color: #773B06;
      color: #773B06;
    }
  }
`;

// 元素控制容器
export const ControlBox = styled.div`
  position: absolute;
  &::after{
    ${beforeAfter}
    ${positionCenter}
    top: -1px;
    bottom: -1px;
    left: -1px;
    right: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    bottom: auto;
    z-index: -1;
    border: 1px solid transparent;
    box-sizing: border-box;
  }
  &.hoverStyle::after{
    border: 1px solid LightSalmon;
  }
  &.pickedStyle::after{
    border: 1px dashed Tomato;
  }
  &.activeStyle::after{
    border: 1px solid DodgerBlue;
  }
  /* 题目元素 */
  &.questionStyle {
    position: relative;
    top: 0!important;
    left: 0!important;
    width: 100%!important;
    height: auto;
    min-height: 100%;
  }
`;

// 元素拖放控制锚点
export const ControlAuthor = styled.div`
  position: absolute;
  margin: auto;
  width: ${authorRadius * 2}px;
  height: ${authorRadius * 2}px;
  background: DodgerBlue;
  border-radius: ${authorRadius}px;
  z-index: 10;
  &.tl {
    left: ${-authorRadius}px;
    top: ${-authorRadius}px;
  }
  &.tr {
    right: ${-authorRadius}px;
    top: ${-authorRadius}px;
  }
  &.lb {
    left: ${-authorRadius}px;
    bottom: ${-authorRadius}px;
  }
  &.rb {
    right: ${-authorRadius}px;
    bottom: ${-authorRadius}px;
  }
  &.lc {
    top: 0;
    left: ${-authorRadius}px;
    bottom: 0;
  }
  &.rc {
    top: 0;
    right: ${-authorRadius}px;
    bottom: 0;
  }
  &.tc {
    left: 0;
    top: ${-authorRadius}px;
    right: 0;
  }
  &.bc {
    left: 0;
    bottom: ${-authorRadius}px;
    right: 0;
  }
`;

const textEditorNavHeight = 54;
export const EditorControlBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const EditorTabBox = styled.div`
  position: relative;
  width: 100%;
  height: ${textEditorNavHeight}px;
  z-index: 1;
  border-bottom: 1px solid #efefef;
  background: #ffffff;
`;

// 编辑区域标题
export const EditorNavItem = styled.div`
  width: 50%;
  height: ${textEditorNavHeight}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  font-size: 115%;
  position: relative;

  &:before, &:after{
    ${positionCenter}
    ${beforeAfter}
    z-index: -1;
    width: 50%;
    height: ${textEditorNavHeight - 20}px;
    transform:skewX(-30deg);
    background: #efefef;
    border-top-left-radius: 8px;
    left:-40px;
    top: auto;
    bottom: 0;
    ${props => !props.active && 'display: none' || ''};
  }
  &:after{
    transform: skewX(30deg);
    background: #efefef;
    border-top-right-radius:8px;
    right:-80px;
  }
`;

// 编辑区域容器
export const EditorBodyBox = styled.div`
  width: 100%;
  overflow: auto;
  flex: 1;
`;
export const EditorSliderItem = styled.div `
  position: absolute;
  z-index: 2;
  right: 152px;
  transform: translateX(50%);
  bottom: 100px;
  >div{
    cursor: pointer;
    padding: 6px 28px;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
`;
// 编辑区域容器块
export const EditorBodyBoxItem = styled.div`
  width: 100%;
  max-height: 100%;
  overflow: auto;
  overflow: ${props => (props.overflow ? props.overflow : 'auto')};
  ${props => (props.hide ? 'display: none' : '')};
  ${props => (props.padding ? `padding: ${props.padding}px` : '')};
  &::-webkit-scrollbar, *::-webkit-scrollbar {
    width: 6px;
    height: 0;
    color: #efefef;
    background-color: #ffffff;
  }
  >.BraftEditor-container {
    overflow: visible!important;
    .braft-emojis {
      color: #ffffff;
    }
  }
  user-select: ${props => (props.enableSelect ? 'auto' : 'none')};
  .questionControl {
    padding-left: 12px;
    line-height: 35px;
    display: inline-block;
    width: 100%;
  }
  .questionControl.active {
    background: #ececec;
  }
  .actionIcon {
    float: right;
    width: 35px;
    height: 35px;
    line-height: 35px;
  }
`;

// 元素属性编辑区域
export const PropControlBar = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  user-select: none;
  padding: 10px;
`;

// 右侧元素列表
export const ElementList = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

// 右侧单个元素
export const ElementItem = styled.div`
  height: 35px;
  line-height: 35px;
  margin-bottom: 2px;
  background: ${props => (props.hoverdItem ? 'rgba(0, 0, 0, 0.05)' : 'transparent')};
  >span {
    width: 20%;
    display: inline-block;
    text-align: center;
  }
  >.itemtype {
    padding-left: 4px;
    text-align: left;
  }
`;

// 备注区域
export const RemarkBox = styled.textarea`
  width: 100%;
  height: 320px;
  border: 1px solid #eaeaea;
  padding: 5px;
  position: relative;
`;

// 网格背景
export const Grid = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("${GridSvg}");
  background-size: 240px 135px;
  background-repeat: repeat;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url("${GridSvg}");
    background-size: 240px 135px;
    background-position-x: 120px;
    background-position-y: 67.5px;
    background-repeat: repeat;
  }
`;

// 拖选选择元素区域
export const DragSelect = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.35);
`;

// 元素容器
export const ElementBox = styled.div`
  word-break: break-all;
  word-break: break-word;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
  white-space: normal;
  tab-size: 2;
  ul {
    padding-left: 1.5em;
    list-style-type: disc;
  }
  ol {
    padding-left: 1.2em;
    list-style-type: decimal;
  }
  p, ul, ol, li {
    font-family: inherit;
    line-height: inherit;
  }
  em{
    font-style: italic;
  }
  .media-wrap.image-wrap {
    display: inline-block;
    > img {
      height: 1em;
    }
  }
  .quill, .ql-container, .ql-editor {
    outline: none;
    width: 100%;
    height: 100%;
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    overflow: hidden;
    tab-size: 2!important;
    div, p, span {
      border: none;
      background: transparent;
      text-align: inherit;
      user-select: text;
    }
  }
  .editorBox {
    width: 100%;
    height: 100%;
    user-select: text;
  }
  .ql-clipboard {
    display: none;
  }
`;

// 不可编辑蒙层
export const PreventMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(250, 250, 250, 0.1);
`;
