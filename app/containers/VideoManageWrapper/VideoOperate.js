
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Button,Row, Col, Checkbox, Modal,Select,Input} from 'antd';
import { FadeInDiv, fadeIn, FlexRowDiv, FlexColumnDiv, DivShadow } from 'components/Div';
export class VideoOperate extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Modal
        visible={this.props.modalOpen}
        title="筛选视频"
        footer=""
        width={'620px'}
        style={{minHeight:'300px'}}
        maskClosable={false}
      >

      </Modal>
    );
  }
}

VideoOperate.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalOpen:PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoOperate);

