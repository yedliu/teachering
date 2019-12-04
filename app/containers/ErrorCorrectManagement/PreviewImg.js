import React, { PropTypes } from 'react';
import { Modal, Button, message, Icon } from 'antd';
import styled, { keyframes } from 'styled-components';

function onChange(a, b, c) {

}
const Wrapper = styled.div`
`
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
`
const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`
const IndexDiv = styled.div`
  display: flex;
`
const ImgIndex = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 3px;
  margin: 0 5px;
  ${props => props.select ? 'border: 3px solid #108ee9' : ''}
  cursor: pointer;
`
export class PreviewImg extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      curIndex: 0,
    }
  }
  render() {
    const { images, close } = this.props;
    const { curIndex } = this.state;
    const len = images.length;
    return (
      <Modal
        width={'auto'}
        style={{maxWidth: '60%'}}
        footer={null}
        closable={false}
        visible={true}
        maskClosable={true}
        onCancel={close} >
        <Wrapper>
          <Img src={images[curIndex]} />
          <ButtonDiv>
            {len > 1 ? (
              <Icon type="left-square-o"
                style={{fontSize: '28px', cursor: 'pointer'}}
                onClick={() => {
                  if (curIndex == 0) {
                    message.info('已经是第一张了')
                    return;
                  }
                  this.setState({
                    curIndex: curIndex - 1
                  })
                }}></Icon>
            ) : ''}
            <IndexDiv>
              {images.map((it, index) => {
                return (
                  <ImgIndex
                    key={it}
                    onClick={() => {
                      this.setState({
                        curIndex: index
                      })
                    }}
                    select={index === curIndex}
                    src={it} />
                )
              })}
            </IndexDiv>
            {len > 1 ? (
              <Icon type="right-square-o"
                style={{fontSize: '28px', cursor: 'pointer'}}
                onClick={() => {
                  if (curIndex == images.length - 1) {
                    message.info('已经是最后一张了')
                    return;
                  }
                  this.setState({
                    curIndex: curIndex + 1
                  })
                }}></Icon>
            ) : ''}
          </ButtonDiv>
        </Wrapper>
      </Modal>
    )
  }
}

export default PreviewImg;
