import styled from 'styled-components';

export const PaperMsgWrapper = styled.div`
  width: 100%;
  min-height: 30px;
  position: relative;
`;
export const TiTle = styled.p`
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: "思源黑体 CN Normal", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  text-align: center;
  line-height: 30px;
`;
export const buttonLeftPosition = {
  position: 'absolute',
  top: -4,
  left: 10,
};
export const buttonRightPosition = {
  position: 'absolute',
  top: -4,
  right: 10,
};
export const ShowAllAnalysis = styled.div`
  position: absolute;
  top: 0px;
  right: 110px;
`;