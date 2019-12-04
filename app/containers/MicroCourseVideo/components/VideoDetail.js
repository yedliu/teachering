import React from 'react';
import { Form, Select, Checkbox, Input, Modal, Button, Spin, InputNumber, message } from 'antd';
const { TextArea } = Input;
import Upload from './UploadVideo';
import { makeFilterConfig } from '../../MicroLessons/makeFilterConfig';
import UploadImg from './UploadImg';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const videoConfig = [
  {
    label: '学段',
    options: [],
    value: void 0,
    type: 'select',
    width: 150,
    key: 'phaseId',
    labelWidth: 50,
  },
  {
    label: '学科',
    options: [],
    value: void 0,
    type: 'select',
    width: 150,
    key: 'subjectId',
    labelWidth: 50,
  },
  {
    label: '年级',
    options: [],
    value: void 0,
    type: 'checkboxGroup',
    width: 150,
    key: 'gradeIdList',
    labelWidth: 50
  },
  {
    label: '版本',
    options: [],
    value: void 0,
    type: 'checkboxGroup',
    width: 150,
    key: 'editionIdList',
    labelWidth: 50
  },
  {
    label: '视频名称',
    value: void 0,
    type: 'input',
    width: 150,
    key: 'name',
    labelWidth: 50,
  }
];
const courseContentConfig = [
  {
    label: '学段',
    options: [],
    value: void 0,
    type: 'select',
    width: 150,
    key: 'phaseId',
    labelWidth: 50,
  },
  {
    label: '学科',
    options: [],
    value: void 0,
    type: 'select',
    width: 150,
    key: 'subjectId',
    labelWidth: 50,
  },
  {
    label: '年级',
    options: [],
    value: void 0,
    type: 'checkboxGroup',
    width: 150,
    key: 'gradeIdList',
    labelWidth: 50
  },
  {
    label: '版本',
    options: [],
    value: void 0,
    type: 'checkboxGroup',
    width: 150,
    key: 'editionIdList',
    labelWidth: 50
  },
  {
    label: '课程名称',
    value: void 0,
    type: 'input',
    width: 150,
    key: 'name',
    labelWidth: 50
  },
  {
    label: '课时',
    value: void 0,
    type: 'inputNumber',
    width: 150,
    key: 'courseHour',
    labelWidth: 50
  },
];
class VideoDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoError: false,
      formConfig: this.props.type === 'microCourseContent' ? courseContentConfig : videoConfig,
      loading: false,
      videoImage: '', // 视频图
      coverImage: '', // 封面图
      descriptionImage: '', // 课程简介图
      videoImageObjectName: '',
      coverImageObjectName: '',
      descriptionImageObjectName: '',
      checkAll: false,
      indeterminate: true
    };
    this.undone = false;
    this.formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
    };
  }
  componentDidMount() {
    const { data = {}, status, type } = this.props;
    if (status === 'edit') {
      console.log(data.phaseId, data.subjectId);
      this.handleMakeConfig(data.phaseId, data.subjectId);
      type === 'microCourseContent'  && this.setState({
        videoImage: data.videoImageUrl,
        coverImage: data.coverImageUrl,
        videoImageObjectName: data.videoImage,
        coverImageObjectName: data.coverImage,
        descriptionImage: data.descriptionUrl,
        descriptionImageObjectName: data.description
      });
    } else {
      this.handleMakeConfig(2, 2);
      this.props.form.setFieldsValue({
        subjectId: '2',
        phaseId: '2'
      });
    }
  }
  videoUrl = ''
  videoSize = 0
  handleMakeConfig=(phaseId, subjectId) => {
    this.setState({ loading: true });
    let formConfig = this.state.formConfig;
    if (!subjectId) {
      this.props.form.setFieldsValue({
        subjectId: void 0
      });
    }
    makeFilterConfig({ config: formConfig }, phaseId, subjectId).then(res => {
      let target = res.config;
      target.forEach(item => {
        if (item.key === 'gradeIdList') {
          item.options = res.grades;
        }
        if (item.key === 'editionIdList') {
          item.options = res.editions;
        }
      });
      this.setState({ formConfig: target, loading: false });
    });
  }
  renderItem=(item) => {
    const { getFieldDecorator } = this.props.form;
    const { data, type } = this.props;
    const inputRules = {
      'name': [{ required: true, message: '必填', whitespace: true }],
      'courseHour': [{ required: true, type: 'number', message: '必填' }, { type: 'number', min: 0.01, message: '应大于0' }],
      'description': [{ required: true, message: '必填', whitespace: true }, { max: 200, message: '最多200字' }],
    };
    if (type === 'microCourseContent') {
      inputRules.name.push({ max: 15, message: '最多15字' });
    }
    let initValue = void 0;
    if (item.type === 'select') {
      initValue = data && item.options.length > 0 && item.options.some(it => String(it.id) === String(data[item.key])) ? String(data[item.key]) : void 0;
    }
    switch (item.type) {
      case 'select':
        return (
          <FormItem key={item.key} label={item.label}>
            {
              getFieldDecorator(item.key, {
                rules: [{ required: true, message: '必选' }],
                initialValue: initValue
              })(
                <Select style={{ width: 200 }} onChange={(value) => { this.handleChange(item.key, value) }}>
                  {
                    item.options.map((item, index) => {
                      return <Option key={index} value={String(item.id)}>{item.name}</Option>;
                    })
                  }
                </Select>
              )
            }
          </FormItem>
        );
      case 'checkboxGroup':
        return (
          <FormItem key={item.key} label={item.label}
            colon={false}
          >
            {
              item.key === 'editionIdList' ?
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  全选
                </Checkbox> : null
            }

            {getFieldDecorator(item.key, {
              rules: [{ required: true, message: '必选' }],
              initialValue: data ? data[item.key] : void 0
            })(
              <CheckboxGroup  options={item.options}  onChange={item.key === 'editionIdList' ? this.checkGroupChange : void 0} />
            )}
          </FormItem>
        );
      case 'input':
        return (
          <FormItem key={item.key} label={item.label}>
            {
              getFieldDecorator(item.key, {
                rules: inputRules[item.key],
                initialValue: data ? String(data[item.key]) : void 0
              })(
                <Input />
              )
            }
            {item.key === 'name' && type === 'microCourseVideo' ? <p style={{ color: '#999' }}>tips:视频上传后会自动填充，无需手动填写</p> : null}
          </FormItem>
        );
      case 'inputNumber':
        return (
          <FormItem key={item.key} label={item.label}>
            {
              getFieldDecorator(item.key, {
                rules: inputRules[item.key],
                initialValue: data ? Number(data[item.key]) : void 0
              })(
                <InputNumber min={0} precision={2} />
              )
            }
          </FormItem>
        );
      case 'textArea':
        return (
          <FormItem key={item.key} label={item.label}>
            {
              getFieldDecorator(item.key, {
                rules: inputRules[item.key],
                initialValue: data ? String(data[item.key]) : void 0
              })(
                <TextArea />
              )
            }
          </FormItem>
        );
    }
  }
  handleUpload=(url, fileSize, fileName) => {
    const { setFieldsValue } = this.props.form;
    this.videoUrl = url;
    this.videoSize = Math.floor(fileSize / 1024);  // 存kb
    this.setState({ videoError: false });
    if (fileName) {
      let nameArr = fileName.split('.');
      setFieldsValue({ name: nameArr[0] });
    } else {
      setFieldsValue({ name: void 0 });
    }
  }
  handleSubmit=(e) => {
    const { type, status } = this.props;
    e.preventDefault();
    if (this.undone) {
      message.warning('文件上传中请稍等');
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (this.props.status === 'add' && !this.videoUrl && type === 'microCourseVideo') {
        this.setState({ videoError: true });
        return;
      }
      if (!err) {
        console.log('Received values of form: ', values, this.videoUrl);
        let params = values;
        if (this.videoUrl) {
          params.objectName = this.videoUrl;
          params.fileSize = this.videoSize;
        }
        if (this.props.type === 'microCourseContent') {
          params.videoImage = this.state.videoImageObjectName;
          params.coverImage = this.state.coverImageObjectName;
          params.description = this.state.descriptionImageObjectName;
        }
        if (status === 'edit') {
          !params.videoImage && (params.videoImage = '');
          !params.coverImage && (params.coverImage = '');
          !params.description && (params.description = '');
        }
        params.gradeIdList = params.gradeIdList.filter(id => this.state.formConfig[2].options.some(item => item.value === id));
        params.editionIdList = params.editionIdList.filter(id => this.state.formConfig[3].options.some(item => item.value === id));
        this.props.onSave(params);
      }
    });
  }
  handleChange=(key, value) => {
    if (key === 'phaseId') {
      // let subjectId = this.state.formConfig.find(item => item.key === 'subjectId').value;
      this.handleMakeConfig(value, void 0);
    }
    if (key === 'subjectId') {
      let phaseId = this.state.formConfig.find(item => item.key === 'phaseId').value;
      this.handleMakeConfig(phaseId, value);
    }
  }
  handleSetUndone=(v) => {
    this.undone = v;
  }
  onCheckAllChange=(e) => {
    const { setFieldsValue } = this.props.form;
    let plainOptions = this.state.formConfig.find(item => item.key === 'editionIdList').options;
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    });
    setFieldsValue({ editionIdList: e.target.checked ? plainOptions.map(item => item.value) : [] });
  }
  checkGroupChange=(checkedList) => {
    let plainOptions = this.state.formConfig.find(item => item.key === 'editionIdList');
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }
  render() {
    const { status, onClose, type } = this.props;
    const { videoImage, coverImage } = this.state;
    return (
      <Modal
        visible
        title={status === 'add' ? '新增视频' : '编辑视频'}
        onCancel={onClose}
        maskClosable={false}
        footer={null}
      >
        <Spin spinning={this.state.loading}>
          <Form onSubmit={this.handleSubmit}>
            {
              this.state.formConfig.map(item => {
                return this.renderItem(item);
              })
            }
            {
              status === 'add' && type === 'microCourseVideo' ?
                <div>
                  <Upload onChange={this.handleUpload} onUndone={this.handleSetUndone} />
                  {
                    this.state.videoError ?
                      <div style={{ color: 'red' }}>
                        请上传500M以内的视频
                      </div> : null
                  }
                </div>
                : null
            }
            {
              type === 'microCourseContent' ?
                <div>
                  <FormItem label="简介图" {...this.formItemLayout} required>
                    <UploadImg
                      btnClass={'up-description-img'}
                      onChange={(url, size, objectName) => {
                        this.setState({ descriptionImage: url, descriptionImageObjectName: objectName });
                      }}
                      imgUrl={this.state.descriptionImage}
                      onUndone={this.handleSetUndone}
                    >上传课程简介图</UploadImg>
                  </FormItem>
                  <FormItem label="视频图" {...this.formItemLayout}>
                    <UploadImg
                      btnClass={'up-video-img'}
                      onChange={(url, size, objectName) => {
                        this.setState({ videoImage: url, videoImageObjectName: objectName });
                      }}
                      imgUrl={videoImage}
                      onUndone={this.handleSetUndone}
                    >上传视频图</UploadImg>
                  </FormItem>
                  <FormItem label="封面图" {...this.formItemLayout}>
                    <UploadImg
                      btnClass={'up-cover-img'}
                      onChange={(url, size, objectName) => { this.setState({ coverImage: url, coverImageObjectName: objectName }) }}
                      imgUrl={coverImage}
                      onUndone={this.handleSetUndone}
                    >上传封面</UploadImg>
                  </FormItem>
                </div>
                : null
            }
            <div style={{ textAlign: 'right', borderTop: '1px solid #eee', padding: '10px 0', marginTop: 20 }}>
              <Button key="back"  onClick={onClose} style={{ marginRight: 20 }}>取消</Button>
              <Button key="submit" type="primary" htmlType="submit">
                确定
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(VideoDetail);
