import styled from 'styled-components';
import { FlexColSpaceBetween, FlexRowCenter, FlexCenter, FlexRowCenterSpaceBetween } from 'components/FlexBox';


export const Wrapper = styled(FlexColSpaceBetween)`
  padding: 10px;
  background-color: #fff;
`;
export const SelectBox = styled(FlexRowCenter)`
  height: 40px;
`;
export const TableBox = styled.div`
  flex: 1;
  overflow-y: hidden;
`;
export const TableButtonsWrapper = styled(FlexRowCenterSpaceBetween)``;
export const PreViewImgWrapper = styled(FlexCenter)`
  height: calc(100% - 30px);
  width: 100%;
  overflow: auto;
  img {
    max-height: 100%;
    max-width: 100%;
  }
`;
export const UploadWrapper = styled(FlexCenter)`
  height: 140px;
  width: 140px;
  border: 1px dotted #ddd;
  cursor: pointer;
`;
export const CenterWrapper = styled(FlexCenter)`
  height: 40px;
`;
export const ImgView = styled.img`
  background-color: #eee;
`;
export const ImgThumbnail = styled(ImgView)`
  max-width: 100px;
  max-height: 80px;
`;