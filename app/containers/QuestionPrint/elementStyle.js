import styled, { injectGlobal } from 'styled-components';
import '../../lib/katex.min.css';
// import 'katex/dist/katex.min.css';
const defaultFontFamily = '"思源黑体 CN Normal", "思源黑体 CN Regular","Microsoft YaHei",   SourceHanSansCN, Arial, -apple-system, BlinkMacSystemFont, "sans-serif", "Helvetica Neue For Number"';
injectGlobal`
  #SliderEditorWarpper-questionPrint{
    position: relative;
    img {
      max-width: 100%;
    }
    img[zmtype="small"] {
      vertical-align: middle;
      text-align: center;
      display: inline-block;
    }
    img[zmtype="big"] {
      vertical-align: middle;
      text-align: center;
      margin:0 auto;
      display: block;
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
    div[class^="list-item-wrap-"] span{
      word-wrap: break-word;
      word-break: break-all;
      white-space: pre-wrap !important;
    }
    .section-not-to-print > .action{
      width:auto;
      .ant-checkbox-group{
        display: flex;
        align-items: baseline;
        span{
          padding:0;
        }
      }
      button{
        border:1px solid #ccc;
        border-radius:5px;
        padding:0px 6px;
        outline:none;
        &.active{
          background:#3499ff;
          color:#fff;
        }
      }
    }
    .printPageWrapper{
      overflow-y: scroll;
    }
    .printPage{
      font-family: ${defaultFontFamily};
      padding-top:26px;
      padding-bottom:90px;
      position:relative;
      background: #ffffff;
      width:794px;
      min-height:1046px;
      margin:100px auto;
      right:0;
      box-shadow: 0px 1px 5px rgba(102, 102, 102, 0.35);
      &>div.questionBox{
        padding: 20px 120px 20px 73px;
      }
      .top{
        font-size: 11px;
        color: #7B8391;
        letter-spacing: -0.16px;
        text-align: left;
        line-height: 8px;
        padding:0 6px;
        margin:6px 0 6px 2px;
        border-left:2px solid #7B8391;
        span{
          margin-right:18px;
        }
      }
    }
    .PickerQuestion{
      width:500px;
      height:300px;
      margin:0 auto;
      border-radius:5px;
      background:#fff;
      .title{
        padding:0 6px;
        height:40px;
        line-height:40px;
        border-top-left-radius:5px;
        border-top-right-radius:5px;
        border:1px solid #ddd;
      }
      .close{
        float:right;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        width: 30px;
        height: 30px;
        margin-left: 5px;
        line-height: 24px;
        text-align: center;
        font-size: 30px;
        user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
      }
    }
}

@media print {
  .ant-layout-sider {
    display: none!important;
  }
  #app{
    margin-top: -85px;
  }
  #app>div {
    height: auto;
    overflow-x:hidden;
  }
  #app .App{
    left:0;
    margin-right:-234px;
    border:none !importent;
    box-shadow:none;
  }
  #SliderEditorWarpper-questionPrint{
    position: relative;
    overflow: hidden;
    margin:0;
    padding:0;
    border:none;
    box-shadow:none;
    .printPageWrapper{
      overflow: hidden;
      margin:0;
      padding:0;
      border:none;
      box-shadow:none;
    }
    .printPage{
      font-family:  ${defaultFontFamily};
      font-size:16px;
      padding:0;
      position:relative;
      width:608px;
      width:794px;
      height: auto;
      margin:0;
      right:0;
      box-shadow:none;
      overflow-x:hidden;
      page-break-after:always;
      z-index: 999;
      &>div.questionBox{
        padding: 0px 120px 40px 73px;
      }
    }
    .section-not-to-print {
        display: none;
    }
  }

`;
export const QuestionBox = styled.div`
  font-family:  ${defaultFontFamily};
  width: 100%;
  padding: 0px 120px 20px 73px;
  font-size: 14px;
  color: #333333;
  letter-spacing: -0.21px;
  text-align: left;
  p,div{
    margin:0;
    padding:0;
    font-family: ${defaultFontFamily};
  }
  .choice-template-wrapper {
    .title-wrapper{
      .title-content{
        font-size:14px;
        .index{
          margin-right:8px;
          font-size: 14px;
          color: #333333;
          letter-spacing: -0.21px;
          text-align: left;
          font-weight:bolder;
          display: inline-block;
        }
        .index-label{
          margin-left:-6px;
          margin-right:2px;
          color:#666;
          display: inline-block;
        }
        .index-label +p, .index +p{
          display: inline;
        }
        p{
          font-size:14px;
          letter-spacing: -0.21px;
          word-break: break-word
        }
      }
    }

    .complex-children-item-wrapper{
     
      .title-wrapper{
        text-align: left;
        .question-index{
          margin-right:8px;
        }
      }
      .Normal1{
      }
      .optionList-wrapper{
        margin-left:4px;
      }
    }

    .optionList-wrapper{
      margin:0px 0;
      .optionList-item-wrapper {
        min-height: 30px;
        .optionList-item-index {
          height: 30px;
          width: 30px;
          border-radius: 50%;
          font-size: 14px;
          line-height: 28px;
          text-align: center;
          color: #333333;
        }
        .optionList-item-index.active {
          color: yellowgreen;
        }
        .optionList-item-content {
          width:100%;
        }
        .optionList-item-content.active {
          color: yellowgreen;
        }
        .optionList-item-index{
          font-size:14px;
          margin-left: -10px;
        }
        .optionList-item-content{
          font-size:14px;
        }
      }
    }

    .optionList-item-wrapper,
    .knowledgeNameList-wrapper,
    .examPointNameList-wrapper{
      display: flex;
      text-align: left;
      align-items: baseline;
    }

    .knowledgeNameList-wrapper,
    .examPointNameList-wrapper{
      &>div:nth-child(1){
        font-size:12px;
        color:#666666;
      }
      &>div:nth-child(2){
        font-size:12px;
        color:#6f6f6f;
        p{
          font-size:12px;
          color:#6f6f6f;
        }
      }
    }

    .group-complex-item-wrapper,
    .answerList-wrapper, 
    .analysis-wrapper{
      display: flex;
      text-align: left;
      align-items: flex-start;
      flex-wrap: wrap;
    }
    
    .group-wrapper{
      font-size: 12px !important;
      color: #666666;
      letter-spacing: -0.18px;
      p{
        font-size:12px;
        color:#6f6f6f;
      }
      .group-complex{
        .group-complex-item-wrapper{
          .group-complex-item{
            margin-left:8px;
          }
          &>div:nth-child(1){
            font-size:12px;
            color:#666666;
          }
          &>div:nth-child(2){
            font-size:12px;
            color:#6f6f6f;
          }
        }
      }
      .answerList-wrapper,
      .answerList-item-label, 
      .answerList-item-content{
        display:inline-block;
      }
      .analysis-item-content {
        p {
          display:block;
          &>span{
            white-space: nowrap;
            text-indent: 0;
            text-rendering: auto;
            width: auto;
            display: inline-block;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        }
        .answerList-item{
          margin-right:20px;
        }
      } 
    }
  }
`;
