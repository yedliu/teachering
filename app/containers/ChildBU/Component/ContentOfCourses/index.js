import React from 'react';
import { Modal, Form, Input, Icon, Tooltip, Popover } from 'antd';
import Upload from 'components/EditItemQuestion/questions/ChildSortQuestion/UploadImage';

const TextArea = Input.TextArea;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 },
};

const UploadTips = '支持 .png .jpg .jpeg 格式，推荐尺寸 640 * 360';

const content = (
  <div>
    <h2>追击！永动齿轮 —— 统筹规划</h2>
    <h3>教学目标：</h3>
    <ol>
      <li>1.经历在具体情境中解决最优惠方案、租船、租车等问题，形成解决问题的基本方法</li>
      <li>2.培养学生独立思考、独立解决问题和积极参与学习活动的能力和意识</li>
      <li>3.体会数学与生活的紧密联系，感受数学应用的灵活性、广泛性和优化思想</li>
    </ol>
    <h3>课程重点：</h3>
    <ol>
      <li>1.掌握解决最优惠方案、租船、租车等问题的基本方法</li>
      <li>2.运用方法解决实际问题</li>
    </ol>
    <h3 style={{ display: 'inline-block' }}>课程难点：</h3>
    <span>通过对数据的分析进行合理调整，寻找规划的最佳方案</span>
  </div>
);

class Content extends React.Component {

  componentDidMount() {
    const { data, form } = this.props;
    const { setFieldsValue } = form;
    const { coverUrl, teachGoal } = data;
    if (coverUrl) {
      setFieldsValue({ coverUrl });
    }
    if (teachGoal) {
      setFieldsValue({ teachGoal });
    }
  }
  handleSubmit = (e) => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        this.props.onSubmit(values);
      }
    });

  };

  onChange = coverUrl => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ coverUrl });
  };

  render() {
    const { form, data = {}} = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const imageUrl = getFieldValue('coverUrl');
    const teachGoal = getFieldValue('teachGoal');
    console.log(imageUrl, 111111);
    return (
      <Modal
        title="设置"
        visible
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
      >
        <Form layout="horizontal">
          <FormItem label="封面" {...formItemLayout}>
            {getFieldDecorator('coverUrl', {
              initialValue: data.coverUrl,
              rules: [{ required: true, message: '请上传封面！' }],
            })(
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Upload onChange={this.onChange} imageUrl={imageUrl} />
                <Tooltip placement="rightTop" title={UploadTips}>
                  <Icon style={{ fontSize: 16 }} type="exclamation-circle" />
                </Tooltip>
              </div>,
            )}
          </FormItem>
          <FormItem label="教学目标" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} >
            {getFieldDecorator('teachGoal', {
              initialValue: data.teachGoal,
              rules: [
                { required: true, message: '请输入教学目标！' },
                { max: 150, message: '最多输入 150 个字！' }
              ],
            })(
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextArea value={teachGoal} placeholder="最多输入 150 个字" />
                <Popover content={content}  trigger="hover">
                  <Icon type="question-circle" style={{ fontSize: 16, marginLeft: 5 }} />
                </Popover>
              </div>,
            )}
          </FormItem>
          <FormItem label="课程重点" {...formItemLayout}>
            {getFieldDecorator('courseKeyPoint', {
              initialValue: data.courseKeyPoint,
              rules: [
                { required: true, message: '请输入课程重点！' },
                { max: 150, message: '最多输入 150 个字！' }
              ],
            })(<TextArea placeholder="最多输入 150 个字" />)}
          </FormItem>
          <FormItem label="课程难点" {...formItemLayout}>
            {getFieldDecorator('courseHardPoint', {
              initialValue: data.courseHardPoint,
              rules: [
                { required: true, message: '请输入课程难点！' },
                { max: 150, message: '最多输入 150 个字！' }
              ],
            })(<TextArea placeholder="最多输入 150 个字" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Content);
