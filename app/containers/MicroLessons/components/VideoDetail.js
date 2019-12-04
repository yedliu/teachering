import React from 'react';
import { Modal, Form, Input, Radio, Button, Icon } from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class VideoDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: '',
      videoName: ''
    };
  }
  componentDidMount() {
    if (this.props.data && this.props.data.videoId > 0) {
      let data = this.props.data;
      this.setState({
        videoId: data.videoId,
        videoName: data.videoName || '--'
      });
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    let video = nextProps.selectedVideo || {};
    console.log(video);
    if (video.id < 0) {
      video = {};
    }
    this.setState({
      videoId: video.id,
      videoName: video.name || '--'
    });
  }
  handleSubmit=(e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = values;
        if (this.state.videoId) {
          params.videoId = this.state.videoId;
        }
        console.log(params);
        this.props.onSave(params);
      }
    });
  }
  render() {
    const { status, onClose, data = {}, onSelectVideo, onClearVideo } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          visible
          title={status === 'add' ? '新增课程内容' : '编辑课程内容'}
          onCancel={onClose}
          maskClosable={false}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="视频课程内容">
              {
                getFieldDecorator('name', {
                  rules: [{ required: true, message: '必填', whitespace: true }, { max: 20, message: '最多20字' }],
                  initialValue: data && data.name ? data.name : void 0
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem label="是否试听">
              {
                getFieldDecorator('audition', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: data && (typeof data.audition === 'boolean') ? data.audition : void 0
                })(
                  <RadioGroup name="radiogroup">
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
            <FormItem>
              {
                this.state.videoId ?
                  <p>已选视频：{this.state.videoName} <Icon type="close-circle" style={{ cursor: 'pointer' }} onClick={onClearVideo} /></p> :
                  <Button onClick={onSelectVideo}>添加视频</Button>
              }
            </FormItem>
            <FormItem>
              <div style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 20 }} onClick={onClose}>取消</Button>
                <Button type="primary" htmlType="submit">保存</Button>
              </div>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(VideoDetail);
