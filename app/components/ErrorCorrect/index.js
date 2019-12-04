/**
*
* ErrorCorrect
*
*/

import React from 'react';
import styled from 'styled-components';
import Config from 'utils/config';
import { Modal, Button, Select, Form, Input, Upload, Icon, message } from 'antd';
import { AppLocalStorage } from 'utils/localStorage';
import correntionApi from 'api/qb-cloud/question-corrention-controller';

const upload = window._baseUrl.imgCdn + '7b5c74ca-123f-4ed3-b9e1-05e8b84cffa6.svg';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const ButtonDiv = styled.div`
  .button {
    width: 50px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border: 1px solid red;
    border-radius: 5px;
    cursor: pointer;
    color: red;
    &:hover {
      opacity: 0.6;
    }
  }
  .transparent {
    background: transparent;
    border: none;
    &:hover {
      color: red;
      opacity: 0.6;
    }
  }
`;
const UploadDiv = styled.div`
  .ant-upload-select-picture-card i {
    font-size: 28px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
  }

  .ant-upload-list-item-uploading-text {
  }
  .ant-upload-list-item-progress {
    background: url(${upload});
    width: 55px;
    bottom: 12px;
    height: 35px;
    background-size: 100% 100%;
  }
`;
const errorTypeList = [
  {
    id: '1',
    name: '题干错误'
  },
  {
    id: '2',
    name: '答案错误'
  },
  {
    id: '3',
    name: '解析错误'
  },
  {
    id: '4',
    name: '知识体系不符'
  },
  {
    id: '5',
    name: '图片或格式问题'
  },
  {
    id: '6',
    name: '其他'
  }
];

// let imgUid = -1; // 图片唯一识别id
class ErrorCorrectForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.imgPreview = this.imgPreview.bind(this);
    this.imgChange = this.imgChange.bind(this);
    this.customRequest = this.customRequest.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.state = {
      showModal: false,
      imgVisible: false,
      previewImage: '',
      fileList: [],
      loading: false
    };
  }

  showModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ showModal: !this.state.showModal, fileList: [] });
  }

  imgChange = ({ fileList }) => {
    console.log('fileList', fileList);
    this.setState({ fileList });
  }

  imgPreview(file) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      imgVisible: true
    });
  }

  imgCancel = () => this.setState({ imgVisible: false })

  beforeUpload = (file) => {
    return true;
  }

  customRequest(e) {
    const form = new FormData();
    form.append('file', e.file);
    fetch(`${Config.tklink}/api/homeworkLesson/uploadImg`, {
      method: 'POST',
      headers: {
        mobile: AppLocalStorage.getMobile(),
        password: AppLocalStorage.getPassWord(),
      },
      body: form,
    }).then((response) => {
      return response.json();
    }, (err) => {
      message.error(err.message);
    }).then((json) => {
      if (json && json.code.toString() === '1') {
        console.log('上传成功', json);
        const fileList = this.state.fileList;
        // 找到此文件把地址写入
        fileList.some(it => { // eslint-disable-line
          if (it.uid == e.file.uid) { // eslint-disable-line
            it.status = 'done';
            it.url = `https://oss-cn-hangzhou.aliyuncs.com/zm-chat-interview${json.data}`;
            return true;
          }
        });
        this.setState({
          fileList: fileList.slice()
        });
      } else {
        message.error(json.message || '图片上传失败！');
      }
    });
  }

  handleOk() {
    this.setState({
      loading: true
    });
    this.props.form.validateFields((err, values) => {
      if (err) {
        this.setState({
          loading: false
        });
        return;
      }
      const fileList = this.state.fileList;
      const { questionId, extraParams, sourceModule /* = 1012 */} = this.props;
      let param = {
        correctionType: values.errorType,
        correctionDesc: values.errorDetail,
        // presentUser: AppLocalStorage.getUserInfo().id,
        questionId: questionId,
        source: 1011,
        sourceModule,
      };
      if (extraParams) {
        param = Object.assign({}, param, extraParams);
      }
      fileList.map((file, index) => { // eslint-disable-line
        param[`picUrl${index + 1}`] = file.url;
      });
      // const url = http://192.168.25.179:8080/qb-web/api/questionCorrention/insert;
      // const url = `${Config.trlink_qb}/api/questionCorrention/insert`;
      correntionApi.insert(param).then((json) => {
        if (json && json.code.toString() === '0') {
          message.success('纠错上报成功！');
          this.setState({
            showModal: false,
            fileList: [],
            loading: false,
          });
        } else {
          message.error(json.message || '上传失败！');
          this.setState({
            loading: false
          });
        }
      }).catch(err => { // eslint-disable-line
        message.success('上传失败，可能是接口或网络问题！');
        this.setState({
          loading: false
        });
      });
    });
  }

  render() {
    const { transparent, size } = this.props;
    const { showModal, imgVisible, fileList, previewImage, loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <ButtonDiv style={{ display: 'inline' }}>
        {showModal ? (
          <Modal
            title="纠错"
            visible={true}
            footer={[
              <Button key="back" size="large" onClick={this.showModal}>取消</Button>,
              <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>提交</Button>,
            ]}
            maskClosable={false}
            onCancel={this.showModal}
          >
            <Form>
              <FormItem
                {...formItemLayout}
                label="错误类型"
              >
                {getFieldDecorator('errorType', {
                  rules: [{
                    required: true, message: '请选择类型',
                  }, {
                  }],
                })(
                  <Select placeholder="请选择错误类型" onChange={this.errorTypeChange}>
                    {errorTypeList.map(it => <Option key={it.id} value={it.id}>{it.name}</Option>)}
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="错误描述"
              >
                {getFieldDecorator('errorDetail', {
                  rules: [{
                    required: true, message: '请输入错误描述',
                  }, {
                    whitespace: true, message: '请输入内容',
                  }, {
                    max: 150,
                    message: '长度不能超过150个字符'
                  }],
                })(
                  <TextArea placeholder="请输入错误描述" autosize />
                )}
              </FormItem>
            </Form>
            {/* 上传区域 */}
            <UploadDiv className="clearfix">
              <Upload
                accept="image/*"
                customRequest={this.customRequest}
                beforeUpload={this.beforeUpload}
                listType="picture-card"
                fileList={fileList}
                onPreview={this.imgPreview}
                onChange={this.imgChange}
              >
                {fileList.length >= 5 ? null : uploadButton}
              </Upload>
              {imgVisible ? (
                <Modal visible={true} footer={null} onCancel={this.imgCancel}>
                  <img alt="查看图片" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              ) : ''}
            </UploadDiv>
          </Modal>
        ) : ''}

        <Button style={this.props.style} type="danger" onClick={this.showModal} className={transparent ? 'transparent' : ''} size={size}>纠错</Button>
      </ButtonDiv>
    );
  }
}

ErrorCorrectForm.propTypes = {

};

const ErrorCorrect = Form.create()(ErrorCorrectForm);

export default ErrorCorrect;
