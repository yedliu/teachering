// import React from 'react';
import styled from 'styled-components';
import { FlexColumnDiv, FlexRowDiv } from '../../../components/Div';
import { sliderScale, previewOriginWidth } from '../config';
const editIcon = window._baseUrl.imgCdn + '0e4b5dad-ab61-4704-ae04-8e85fcad5f63.png';

const positionCenter = `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`;

/* const beforeAfter = `
  content: '';
  display: inline-block;
`; */

const headerHeight = 60;      // 顶部高度
const previewWidth = 270;     // 左侧预览栏
const previewPageWidth = 200; // 预览栏界面

export const SliderEditorWarpper = styled(FlexColumnDiv)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  font-size: 14px;
  .pickerSlide{
    &>div{
      background:#fff;
    }
  }
`;

export const Header = styled.div`
  width: 100%;
  height: ${headerHeight}px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  background: #f2f2f2;
  justify-content: center;
  /* overflow: hidden; */
  box-shadow: 0px 1px 5px rgba(102, 102, 102, 0.35);
  >div {
    position: absolute;
    margin: auto;
    display: inline-flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
  }
  .back {
    width: 60px;
    height: 30px;
    line-height: 30px;
    left: 20px;
    top: ${(headerHeight - 30) / 2}px;
    border: 1px solid #acacac;
    border-radius: 4px;
  }
  .title {
    display: flex;
    flex-direction: column;
    left: 0;
    right: 0;
    width: 43%;
    .name, .detail {
      display: flex;
      height: ${headerHeight / 2}px;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .name {
      align-items: flex-end;
      font-size: 1.25em;
    }
    .list {
      opacity: 0.65;
    }
    .edit {
      display: none;
    }
  }
  .action {
    height: 30px;
    line-height: 30px;
    right: 20px;
    top: ${(headerHeight - 30) / 2}px;
    display: flex;
    flex-direction: row;
    span {
      display:inline-block;
      padding:2px 6px;
      margin: 0px 6px;
      text-align: center;
    }
    .save {
      color: #ffffff;
      background: #179bd5;
      background: ${props => (props.savePre ? 'gray' : '#179bd5')};
      border-radius: 4px;
    }
    .publish{
      border:1px solid #cccccc;
      color: #727272;
      background: none;
    }
  }
`;

// 内容编辑
export const EditSlideWarper = styled.div`
  width: 100%;
  height: calc(100% - ${headerHeight}px);
  position: absolute;
  top: ${headerHeight}px;
  left: 0;
`;

// 内容编辑 左侧预览
export const PreviewNav = styled.div`
  width: ${previewWidth}px;
  height: 100%;
  position: relative;
  z-index: 1;
  box-shadow: 0px 1px 5px rgba(102, 102, 102, 0.35);
  padding: 40px 0px ${props => props.paddingBottom || 0}px;
`;

export const SlideOption = styled(FlexRowDiv)`
  width: ${previewWidth}px;
  position: relative;
  z-index: 1;
  box-shadow: 0px 1px 1px #cacaca;

`;

export const OptionBtn = styled.div`
  flex: 1;
  box-shadow: 0px 1px 1px #cacaca;
  height: 40px;
  line-height: 40px;
  color: ${props => (props.active ? '#ffffff' : 'rgba(0, 0, 0, 0.65)')};
  text-align: center;
  background: ${props => (props.active ? '#179bd5' : '#ffffff')};
`;

export const SlideThumbnail = styled.div`
`;

export const ScrollDirNav = styled.div`
  height: 100%;
  overflow: auto;
  padding: 2px 5px 2px 0px;
`;

export const PageIndex = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  text-align: center;
  box-shadow: 0px 1px 1px #cacaca;
  z-index: 1;
`;

// 内容编辑 左侧预览 拖拽容器
export const PreviewSectionBox = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

// 内容编辑 左侧预览 拖拽项
export const PreviewSectionItem = styled.div`
  width: 100%;
  padding-left: ${props => (props.padding ? 30 : 0)}px;
  box-sizing: border-box;
  position: relative;
  direction: rtl;
  box-sizing: border-box;
  &:hover {
    overflow: visible;
  }
  &:last-child {
    border-bottom: none;
  }
  &.disabled {
    filter: grayscale(100%);
  }
  &.docHide {
    opacity: 0.75;
  }
`;

// 内容编辑 左侧预览 拖拽项 顶部操作栏
export const SectionHeader = styled.div`
  height: 30px;
  line-height: 30px;
  position: relative;
`;

// 内容编辑 左侧预览 拖拽项 顶部操作栏 可编辑标题
export const SectionTitle = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  text-align: left;
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding-left: 8px;
  display: inline-block;
  outline: none;
  direction: ltr;
  border-bottom: 1px solid #cacaca;
  &:active, &:focus {
    outline: none;
    ${props => (!props.disabled ? `
      background: rgba(62, 144, 255, 0.42);
      background: linear-gradient(to right, rgba(62, 144, 255, 0.42) 0%,rgba(0, 0, 0, 0) 100%);
    ` : '')}
  }
  ${props => props.warn && 'background: #ffd400' || ''};
`;

// 内容编辑 右侧内容编辑区域
export const EditSlideContent = styled.div`
  width: 100%;
  height: 100%;
  padding-left: ${previewWidth}px;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
`;

export const IconItem = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  position: absolute;
  top: 0;
  right: ${props => props.right || 'auto'};
  left: ${props => props.left || 'auto'};
  ${props => (props.hide ? 'display: none' : '')};
  background: #ffffff;
`;

export const FoldIcon = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  position: absolute;
  top: 0;
  left: -30px;
  font-size: 18px;
  user-select: none;
`;

// 内容编辑 左侧预览 拖拽项 顶部操作栏 页面预览
export const PageView = styled.div`
  width: ${previewPageWidth}px;
  height: ${previewPageWidth / sliderScale}px;
  background: #efefef;
  box-sizing: border-box;
  margin: 5px 0;
  position: relative;
  .actionBar {
    position: absolute;
    top: 50%;
    right: 0;
    width: ${props => props.actionWidth || '100%'};
    height: 30px;
    display: none;
    transform: translateY(-50%);
  }
  &.activePreviewPage {
    padding-right: 15px;
    background: #ffffff;
    background-image: url(${editIcon});
    background-repeat: no-repeat;
    background-position: top right;
    background-size: auto 100%;
    .actionBar {
      display: block;
      background: #179bd5;
      margin-right: 15px;
    }
  }
`;

export const CatalogView = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: left;
  padding-left: 15px;
  background: #efefef;
  box-sizing: border-box;
  margin: 5px 0;
  position: relative;
  .actionBar {
    position: absolute;
    top: 50%;
    right: 0;
    width: ${props => props.actionWidth || '100%'};
    height: 30px;
    display: none;
    transform: translateY(-50%);
  }
  &.activePreviewPage {
    padding-right: 15px;
    color: white;
    background: rgba(0,0,0, 0.3);
    background-image: url(${editIcon});
    background-repeat: no-repeat;
    background-position: top right;
    background-size: auto 100%;
    .actionBar {
      display: block;
      background: #179bd5;
      margin-right: 15px;
    }
  }
`;

export const PageViewPreview = styled.div`
  width: ${previewOriginWidth}px;
  height: ${previewOriginWidth / sliderScale}px;
  transform: scale(${previewPageWidth / previewOriginWidth});
  transform-origin: right top;
  direction: ltr;
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
  }
  >.elementItem {
    position: absolute;
  }
  /* 题目元素 */
  >.questionItem {
    position: relative;
    top: 0!important;
    left: 0!important;
    width: 100%!important;
    min-height: 100%;
    .miniScrollBar {
      overflow: hidden;
    }
  }
`;

export const SaveBtn = styled.div`
  width: 120px;
  height: 40px;
  line-height: 40px;
  margin: 30px auto;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
  text-align: center;
`;

export const PickWarper = styled.div`
  ${positionCenter};
  top: ${props => `${props.marginTop || 0}px`};
  padding: 50px 75px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
`;

export const PickBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const ActionBar = styled.div`
  width: 30px;
  height: 100%;
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-bottom: 1px solid #cacaca;
  &:hover {
    width: ${props => props.children.filter(c => c).length * 30}px;
    overflow-y: hidden;
  }
`;

export const InsertSlide = styled.div`
  text-align: center;
  height: 30px;
  line-height: 30px;
  position: relative;
  border: 1px dashed #cacaca;
  margin: 5px;
`;

export const CloseButtom = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px 10px;
  padding: 5px 10px;
  text-align: center;
  background: rgba(255, 255, 255, 0.85);
`;

export const SliderEditorSettingWarpper = styled.div`
  margin-right: 16px;
`;
