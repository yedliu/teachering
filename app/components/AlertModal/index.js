/* eslint-disable complexity */
/**
 * A link to a certain page, an anchor tag
 */
import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { FlexColumnDiv, FlexRowDiv, fadeIn } from 'components/Div';
import Button from 'components/Button';
import { FormattedMessage } from 'react-intl';
const warningimg = window._baseUrl.imgCdn + 'e8273d54-2a86-43ae-933c-004634363ed2.png';
const tipimg = window._baseUrl.imgCdn + '3142dc73-06bf-4f80-b0ec-cbf90aab1f24.png';
const successimg = window._baseUrl.imgCdn + '690504a4-27aa-4a81-b63d-ba8633980dd8.png';
const errorimg = window._baseUrl.imgCdn + '883185f0-22e5-4513-942c-10e643d29b60.png';
const happy = window._baseUrl.imgCdn + '7173ef8a-db72-42e2-a2af-8bf5ad86d9e1.png';
import messages from './messages.js';
const smallwrong = window._baseUrl.imgCdn + 'bb63b956-1d8c-4bc5-9761-3b501e941314.png';
const smallgradeconfirm = window._baseUrl.imgCdn + '95f536a7-ed2d-4267-a8c9-024b414b0793.png';
const smallgradecancel = window._baseUrl.imgCdn + '4f815a52-ad21-4c75-8a48-e3cfa1094035.png';
import merge from 'lodash/merge';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    minHeight: '240px',
    minWidth: '485px',
    animation: `${fadeIn} .5s linear`,
    transform: 'translate(-50%, -50%)',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, .2)',
    borderRadius: '6px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
};
const smallGradeStyles = merge({}, customStyles, {
  content: {
    padding: '10px 10px 10px 10px',
    background: '#CDD7EB',
    borderRadius: '16px',
  },
});
const ButtonDivWrapper = styled(FlexRowDiv)`
  margin-top: 40px;
  margin-bottom: 20px;
  justify-content: center;
`;
const ButtonDiv = styled.div`
  margin: 0 10px;
`;

const ContentDiv = styled.div`
  text-align: center;
  font-size: 16px;
  color: #666666;
  width: 485px;
`;

const ImgDivWrapper = styled(FlexRowDiv)`
  justify-content: center;
`;
const ImgDiv = styled.img`
  // margin-top:10px;
  margin-top: ${props => (props.miniStyle ? '26px' : '10px')};
  margin-bottom: 30px;
`;

const CallTitle = styled.p`
  text-align: center;
  font-size: 20px;
  color: #000;
`;

// 修复了button在文字变多时内容被挤下来的问题
const ChangeButton = styled(Button)`
  width: 100%;
  padding: 0.5em 1em;
`;
const ConfirmButton = styled(FlexColumnDiv)`
  width:120px;
  height:40px;
  font-size:14px;
  background:url('${smallgradecancel}') no-repeat 0 0;
  cursor:pointer;
  justify-content:center;
  align-items:center;
  color:#fff;
  margin-right:45px;
`;
const CancelButton = styled(ConfirmButton)`
  margin-right:0;
  background:url('${smallgradeconfirm}') no-repeat 0 0;
`;

// eslint-disable-next-line complexity
const switchDom = (me, child, options, message) => {
  switch (options.showtype) {
    case 'confirm':
      return (
        <ButtonDivWrapper>
          {options.smallGrade ? (
            <ConfirmButton
              style={{ marginRight: '0' }}
              onClick={
                options.cancelFunc
                  ? options.cancelFunc
                  : me.props.onAlertModalClose
              }
            >
              <FormattedMessage {...messages.label1} />
            </ConfirmButton>
          ) : (
            <Button
              showtype={2}
              onClick={
                options.cancelFunc
                  ? options.cancelFunc
                  : me.props.onAlertModalClose
              }
            >
              <FormattedMessage {...messages.label1} />
            </Button>
          )}
        </ButtonDivWrapper>
      );
    case 'choose':
      return (
        <ButtonDivWrapper>
          {options.smallGrade ? (
            <ConfirmButton
              onClick={
                options.sureFunc ? options.sureFunc : me.props.onAlertModalSure
              }
            >
              <FormattedMessage {...messages.label2} />
            </ConfirmButton>
          ) : (
            <ButtonDiv>
              <Button
                showtype={1}
                onClick={
                  options.sureFunc
                    ? options.sureFunc
                    : me.props.onAlertModalSure
                }
              >
                <FormattedMessage {...messages.label2} />
              </Button>
            </ButtonDiv>
          )}
          <ButtonDiv>
            {options.smallGrade ? (
              <CancelButton
                onClick={
                  options.cancelFunc
                    ? options.cancelFunc
                    : me.props.onAlertModalClose
                }
              >
                <FormattedMessage {...messages.label3} />
              </CancelButton>
            ) : (
              <Button
                showtype={2}
                onClick={
                  options.cancelFunc
                    ? options.cancelFunc
                    : me.props.onAlertModalClose
                }
              >
                <FormattedMessage {...messages.label3} />
              </Button>
            )}
          </ButtonDiv>
        </ButtonDivWrapper>
      );
    case 'success':
      return <ButtonDiv />;
    case 'error':
      return <ButtonDiv />;
    case 'change':
      return (
        <ButtonDivWrapper>
          <ButtonDiv>
            <ChangeButton
              showtype={1}
              onClick={
                options.sureFunc ? options.sureFunc : me.props.onAlertModalSure
              }
            >
              {message[0]}
            </ChangeButton>
          </ButtonDiv>
          <ButtonDiv>
            <ChangeButton
              showtype={2}
              onClick={
                options.cancelFunc
                  ? options.cancelFunc
                  : me.props.onAlertModalClose
              }
            >
              {message[1]}
            </ChangeButton>
          </ButtonDiv>
        </ButtonDivWrapper>
      );
    case 'submitsuccess':
      return (
        <ButtonDivWrapper>
          {options.smallGrade ? (
            <ConfirmButton
              style={{ marginRight: '0' }}
              onClick={
                options.cancelFunc
                  ? options.cancelFunc
                  : me.props.submitSuccessCallback
              }
            >
              <FormattedMessage {...messages.label1} />
            </ConfirmButton>
          ) : (
            <Button
              showtype={1}
              onClick={
                options.cancelFunc
                  ? options.cancelFunc
                  : me.props.submitSuccessCallback
              }
            >
              <FormattedMessage {...messages.label1} />
            </Button>
          )}
        </ButtonDivWrapper>
      );
    default:
      return <ButtonDiv />;
  }
};

export const AlertModal = (me, child, options, message) => (
  <Modal
    isOpen={options.isOpen ? options.isOpen : me.props.alertModalIsOpen}
    style={options.smallGrade ? smallGradeStyles : customStyles}
    contentLabel="Example Modal"
  >
    <div style={{ background: '#fff', height: '100%' }}>
      {(() => {
        switch (options.imgtype) {
          case 'warning':
            return (
              <ImgDivWrapper>
                <ImgDiv
                  miniStyle={options.smallGrade ? true : false}
                  src={options.smallGrade ? smallwrong : warningimg}
                />
              </ImgDivWrapper>
            );
          case 'tip':
            return (
              <ImgDivWrapper>
                <ImgDiv src={tipimg} />
              </ImgDivWrapper>
            );
          case 'success':
            return (
              <ImgDivWrapper>
                <ImgDiv src={successimg} />
              </ImgDivWrapper>
            );
          case 'error':
            return (
              <ImgDivWrapper>
                <ImgDiv src={errorimg} />
              </ImgDivWrapper>
            );
          case 'passwdwarn':
            return (
              <CallTitle>
                <strong>密码修改提示</strong>
              </CallTitle>
            );
          case 'happy':
            return (
              <ImgDivWrapper>
                <ImgDiv src={happy} />
              </ImgDivWrapper>
            );
        }
      })()}
      <ContentDiv style={options.styles}>{child}</ContentDiv>
      {switchDom(me, child, options, message)}
    </div>
  </Modal>
);
