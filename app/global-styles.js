import { injectGlobal } from 'styled-components';

import 'katex/dist/katex.min.css';
import 'font-awesome/css/font-awesome.css';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
    * {
      margin: 0;
      padding: 0;
    }
  }
  /** Prevent sub and sup elements from affecting the line height in all browsers. */
  /* sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
  sub { bottom: -0.25em; }
  sup { top: -0.5em; } */

  body {
    font-family: 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    text-size-adjust: none;
    -webkit-text-size-adjust: none;
    -webkit-print-color-adjust: exact;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #999;
    height: 100%;
    width: 100%;
    &>div {
      height: 100%;
    }
  }

  p,
  label {
    font-family: "思源黑体 CN Normal", "思源黑体 CN Regular","Microsoft YaHei",   SourceHanSansCN, Arial, -apple-system, BlinkMacSystemFont, "sans-serif", "Helvetica Neue For Number", serif;
    line-height: 1.5em;
  }

  .katex {
    display: inline-block;
     .hide-tail{
         transform: scale(1.06) !important;
      }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  .selectCls {
    width: 200px;
    height: 40px;
  }
  .ant-menu.ant-menu-dark .ant-menu-item-selected{
    background-color:#3e4753 !important;
  }
  .ant-menu.ant-menu-dark .ant-menu-submenu .ant-menu-item-selected{
    background-color:#717988 !important;
  }
  ::-webkit-scrollbar {
    width: 13px;
    height: 10px;
    padding-top: 0px;
    background: #eee;
  }
  ::-webkit-scrollbar-thumb {
    border-radius:10px;
    height: 30px;
    width: 5px;
    border: 2px solid #f6f6f6;
    //margin-left:2px;
    background: #ccc;
    //-webkit-box-shadow: 0 1px 1px rgb(0,0,0);
    //background: -webkit-linear-gradient(rgb(200,200,200), rgb(150,150,150));
  }
  ::-webkit-scrollbar-thumb:hover {
      //-webkit-box-shadow: 1px 2px 2px rgba(0,0,0,.25);
      //background-color:rgba(0,0,0,.4)
      background-color:#bbb!important;
  }
  ::-webkit-scrollbar-thumb:active {
      //-webkit-box-shadow:1px 2px 3px rgba(0,0,0,.35);
      //background-color:rgba(0,0,0,.5)
      background-color:#bbb!important;
  }
`;
