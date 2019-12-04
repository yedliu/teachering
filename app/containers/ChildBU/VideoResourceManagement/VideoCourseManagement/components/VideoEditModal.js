import React from 'react';
import styled from 'styled-components';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import CourseSelector from './CourseSelector';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const ALabel = styled.a`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  width: 100%;
`;
const Footer = styled(FormItem)`
  text-align: center;
 `;
const CancelBtn = styled(Button)`
  margin-left: 20px;
`;
class EditVideoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelectCourse: false,
    };
  }
  handleSubmit = (e) => {
    const { onOk, data } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values, data);
        if (!data.courseSystemId) {
          message.warning('课程体系必选');
          return;
        }
        onOk(values);
      }
    });
  }
  showCourse=() => {
    this.setState({
      showSelectCourse: true
    });
  }
  closeCourseSelector=() => {
    this.setState({
      showSelectCourse: false
    });
  }
  onOk=(names, selected) => {
    console.log(selected, names);
    const { editCsId } = this.props;
    this.setState({
      showSelectCourse: false,
    });
    editCsId(names, selected);
  }
  render() {
    const { showSelectCourse } = this.state;
    const { data = {}, onCancel, courseList, videoStatus } = this.props;
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
    const rules = {
      1: [],
      2: [3],
      3: [2, 4],
      4: [3]
    };
    const statusList = videoStatus.map(item => {
      if (!rules[data.state].includes(item.id)) {
        item.disabled = true;
      } else {
        item.disabled = false;
      }
      return item;
    });
    return (
      <Modal
        title="编辑视频"
        visible={true}
        footer={null}
        onCancel={onCancel}
        maskClosable={false}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="视频名称"
            hasFeedback
          >
            {getFieldDecorator('audioName', {
              rules: [{
                max: 200, message: '最多200字'
              }, {
                required: true, message: '请输入视频名称',
              }],
              initialValue: data.audioName
            })(
              <Input placeholder="请输入视频名称" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="视频链接"
            hasFeedback
            required
          >
            <ALabel
              href={data.ossUrl}
              target="_blank"
              title={data.ossUrl}
              >
              {data.ossUrl}
            </ALabel>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="主讲人"
            hasFeedback
          >
            {getFieldDecorator('lecturer', {
              rules: [{
                max: 10, message: '最多10字'
              }, {
                required: true, message: '请输主讲人',
              }],
              initialValue: data.lecturer
            })(
              <Input placeholder="请输主讲人" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="视频状态"
            hasFeedback
          >
            {getFieldDecorator('state', {
              rules: [{
                required: true, message: '请选择视频状态',
              }],
              initialValue: String(data.state)
            })(
              <Select>
                {
                  statusList.map(item => {
                    return <Option value={String(item.id)} key={item.id} disabled={item.disabled}>{item.name}</Option>;
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="关联课程"
            required
          >
            <div style={{ maxWidth: '100%', overflowX: 'auto', display: 'inline-block' }}>
              <span style={{ marginRight: 20 }}>
                {
                data.courseNames ? data.courseNames.join('>') : ''
              }
              </span>
            </div>
            <Button type="primary" size="small" onClick={this.showCourse}>重新选择</Button>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="视频简介"
            hasFeedback
          >
            {getFieldDecorator('description', {
              rules: [{
                max: 200, message: '最多200字'
              }],
              initialValue: data.description
            })(
              <TextArea />
            )}
          </FormItem>
          <Footer>
            <Button type="primary" htmlType="submit">确定</Button>
            <CancelBtn onClick={onCancel}>取消</CancelBtn>
          </Footer>
        </Form>
        {
          showSelectCourse ?
            <CourseSelector
              onCancel={this.closeCourseSelector}
              treeData={courseList}
              onOk={this.onOk}
            /> : null
        }
      </Modal>
    );
  }
}
const EditVideoModalForm = Form.create()(EditVideoModal);
export default EditVideoModalForm;
