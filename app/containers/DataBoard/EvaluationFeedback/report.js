import React from 'react';
import { Modal } from 'antd';
import Loading from './components/loading';
import { ReportFail } from './style';
import { getExamEncrypt } from './server';
import Config from 'utils/config';

export default class Report extends React.Component {
  state = {
    loading: true,
    src: '', // h5报告地址
  };
  componentDidMount() {
    this.getEncrypt();
  }

  /**
   * @description 获取加密字符串
   * @return {void}
   */
  getEncrypt = async () => {
    this.setState({ loading: true });
    const id = this.props.examInfoId;
    const encrypt = await getExamEncrypt(id);
    console.log(1111111, encrypt);
    if (encrypt) {
      this.setState({
        src: `${
          Config.mobileLink
        }/h5-evaluation-report?role=1&loadstate=3&key=${encrypt}`,
      });
    } else {
      this.hideLoading();
    }
  };

  /**
   * @description 隐藏 loading
   * @return {void}
   */
  hideLoading = () => {
    this.setState({ loading: false });
  };

  render() {
    const { loading, src } = this.state;
    return (
      <Modal
        visible
        onCancel={this.props.onCancel}
        width={1200}
        bodyStyle={{ position: 'relative' }}
        title="掌门测评报告"
        footer={null}
      >
        {loading && <Loading />}
        {src ? (
          <iframe
            onLoad={this.hideLoading}
            width="1160"
            height="600"
            src={src}
            frameBorder="0"
          />
        ) : (
          <ReportFail>{!loading && '获取测评报告失败，请稍后重试'}</ReportFail>
        )}
      </Modal>
    );
  }
}
