import React from 'react';
import { Modal, Button } from 'antd';
import { PreViewImgWrapper, CenterWrapper, ImgView } from './style';
import UpLoadImage from './upLoadImage';

const isUrl = (url) => (url && url.length > 10);
const defaultImgSize = {
  imgMaxWidth: 600,
  imgMaxHeight: 600,
  zoomStep: 100,
};
const zoomPrompt = '长或宽都低于600像素的图片无法进行缩放';

class ViewImg extends React.Component {
  state = {
    imgMaxWidth: '100%',
    imgMaxHeight: '100%',
  };
  closeView = () => {
    const { closeView } = this.props;
    this.setState({
      imgMaxWidth: '100%',
      imgMaxHeight: '100%',
    });
    closeView && closeView();
  }
  zoom = (toBeBigFlag) => {
    const { naturalWidth, naturalHeight } = this.imgView;
    if (naturalHeight > 0 && naturalWidth > 0) {
      const { width: imgWidth, height: imgHeight } = this.imgView;
      let maxWidth = imgWidth;
      let maxHeight = imgHeight;
      if (toBeBigFlag) {
        maxWidth += defaultImgSize.zoomStep;
        maxHeight += defaultImgSize.zoomStep;
      } else {
        maxWidth -= defaultImgSize.zoomStep;
        maxHeight -= defaultImgSize.zoomStep;
      }
      if (maxWidth > naturalWidth) {
        maxWidth = naturalWidth;
      } else if (maxWidth < defaultImgSize.imgMaxWidth) {
        maxWidth = defaultImgSize.imgMaxWidth;
      }
      if (maxHeight > naturalHeight) {
        maxHeight = naturalHeight;
      } else if (maxHeight < defaultImgSize.imgMaxHeight) {
        maxHeight = defaultImgSize.imgMaxHeight;
      }
      this.setState({
        imgMaxWidth: maxWidth,
        imgMaxHeight: maxHeight,
      });
    }
  }
  render() {
    const { show, viewImg, finishUpload } = this.props;
    const hasUrl = isUrl(viewImg.url);
    const { imgMaxWidth, imgMaxHeight } = this.state;
    return (
      <Modal
        visible={show}
        zIndex={50}
        style={{
          top: 100,
          transition: 'top 0.2s ease',
        }}
        width="80%"
        bodyStyle={{ height: 'calc(100vh - 200px)', minHeight: 400, minWidth: 400 }}
        onCancel={this.closeView}
        footer={null}
      >
        <PreViewImgWrapper>
          <p style={{ width: '100%', height: '100%', textAlign: 'center', lineHeight: 'calc(100vh - 272px)' }}>
            {hasUrl ? <ImgView innerRef={x => { this.imgView = x }} style={{ maxWidth: imgMaxWidth, maxHeight: imgMaxHeight }} src={viewImg.url} alt="图片加载失败" title={viewImg.name || ''} /> : null}
          </p>
        </PreViewImgWrapper>
        <CenterWrapper>
          <UpLoadImage
            size="small"
            btnText="重新上传"
            showType="preview"
            btnType="primary"
            type={viewImg.type}
            moduleId={viewImg.id}
            finishUpload={finishUpload}
          />
          <span>&nbsp;&nbsp;</span>
          <Button type="primary" shape="circle" size="small" icon="plus" title={zoomPrompt} onClick={() => this.zoom(true)} ></Button>&nbsp;放大&nbsp;&nbsp;
          <Button type="primary" shape="circle" size="small" icon="minus" title={zoomPrompt} onClick={() => this.zoom(false)} ></Button>&nbsp;缩小&nbsp;&nbsp;
        </CenterWrapper>
      </Modal>
    );
  }
}


export default ViewImg;