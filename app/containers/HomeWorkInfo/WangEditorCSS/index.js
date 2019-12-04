import { css } from 'styled-components';

export const WangEditorCSS = css`
  table {
    border-top: 1px solid #ccc!important;
    border-left: 1px solid #ccc!important;
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

  // blockquote 样式
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  // code 样式
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }

  // ul ol 样式
  ul, ol {
    margin: 10px 0 10px 20px;
  }
  img {
    max-width: 100%;
  }
`;
