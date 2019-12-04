import React, { PropTypes, PureComponent } from 'react';
import {
  Form,
  Modal,
  Input,
  InputNumber,
  Checkbox,
  message,
} from 'antd';
import { fromJS } from 'immutable';
import { getOneLevelInfo, updateOneLevelInfo } from 'api/tr-cloud/course-system-level-endpoint';
import abilityEndPoint from 'api/qb-cloud/base-ability-endpoint';
const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

class LevelAttr extends PureComponent {
  state = {
    levelInfo: fromJS({}),
    abilityList: fromJS([])
  }

  componentDidMount() {
    const { levelId, queryParams } = this.props;
    const { gradeId, subjectId } = queryParams;
    // console.log('queryParams:', levelId, queryParams, visible, this.props.showLevelAttr);
    getOneLevelInfo({ id: levelId }).then((levelInfo) => {
      // console.log('levelInfo:', levelInfo);
      this.setState({ levelInfo: fromJS(levelInfo) });
    });
    const abilityParams = {
      gradeId,
      subjectId,
    };
    abilityEndPoint.queryBySubjectIdGradeId(abilityParams).then((res) => {
        // console.log('AbilityLabels', res);
      const { data: abilityList } = res;
      this.abilityList = abilityList;
      this.setState({ abilityList: fromJS(abilityList) });
    });
  }

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }
  handleSubmit = (e) => {
    const { form, onOk, levelId, queryParams } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      console.log('validateFields', err, values);
      if (err) {
        console.error(err);
        message.error('请填写符合条件的选项！');
        return;
      } else {
        console.log('Received values of form: ', values);
        const { abilityLabels: labelArray = [], ...rest } = values;
        const abilityLabels = labelArray.map((item, i) => {
          const arr = item.split('%%');
          if (typeof item === 'string') {
            return {
              'abilityLabelId': Number(arr[0]) || null,
              'abilityLabelName': arr[1] || '',
            };
          } else {
            return item;
          }
        });

        const params = {
          ...queryParams,
          abilityLabels,
          ...rest,
          id: levelId
        };
        console.log('params', params);
        updateOneLevelInfo(params).then((res) => {
          onOk(values);
          console.log('更新单条等级属性', res);
        });
      }
    });
  }
  checkLevel = (rule, value, callback) => {
    // console.log('checkLevel', value);
    if (value.length <= 3) {
      callback();
      return;
    }
    callback('能力最多只能选择 3 个！');
  }

  render() {
    const { form } = this.props;
    const { levelInfo = fromJS({}), abilityList = fromJS([]) } = this.state;
    // console.log('levelInfo', levelInfo.toJS(), 'abilityList', abilityList.toJS());
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const originOptions = [];
    const normalOriginOptions = [];
    // 已选能力初始值
    const abilityLabels = levelInfo.get('abilityLabels') ? levelInfo.get('abilityLabels').map((item) => {
      item.get('abilityLabelId') && item.get('abilityLabelName')
      && originOptions.push({
        label: item.get('abilityLabelName'),
        value: `${item.get('abilityLabelId')}%%${item.get('abilityLabelName')}`,
      })
      && normalOriginOptions.push({
        label: item.get('abilityLabelName'),
        value: `${item.get('abilityLabelId')}%%${item.get('abilityLabelName')}`,
      });
      return `${item.get('abilityLabelId')}%%${item.get('abilityLabelName')}`;
    }) : fromJS([]);

    const abilityOptions = [...abilityList.toJS(), ...normalOriginOptions];
     // 因为这里后端给的能力列表有不同 ID 但是同 name 的情况，所以这里做下去重
    let obj = {};
    const options = abilityOptions.reduce((cur, next) => {
      const label = next.name || next.label;
      const value = next.id || next.value;
      obj[label] ? '' : obj[label] = true && cur.push({
        label: label,
        value: `${value}%%${label}`,
      });
      return cur;
    }, []);
    // console.log('abilityList', abilityList.toJS());
    // console.log('abilityLabels', abilityLabels.toJS(), options, obj);
    return (
      <Modal
        visible={true}
        title="等级属性"
        onCancel={this.onCancel}
        onOk={this.handleSubmit}
      >
        <Form
          layout="horizontal"
          style={{ width: '80%', margin: '0 auto' }}
          onSubmit={this.handleSubmit}
         >
          <FormItem {...formItemLayout} label="分值：">
            {getFieldDecorator('score', {
              initialValue: levelInfo.get('score'),
              rules: [
                 {  required: true, message: '请输入正确的分数, 0-100之间的正数！', type: 'number' },
              ],
            })(<InputNumber min={0} step={1} max={100} precision={0} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="描述（老师）：">
            {getFieldDecorator('teacherDesc', {
              initialValue: levelInfo.get('teacherDesc'),
              rules: [
                { required: true, message: '请输入老师描述！' },
                { max: 50, message: '老师描述最多输入 50 字！' }
              ],
            })(<TextArea min={0} max={50} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="描述（学生）：">
            {getFieldDecorator('studentDesc', {
              initialValue: levelInfo.get('studentDesc'),
              rules: [
                { required: true, message: '请输入学生描述！' },
                { max: 50, message: '学生描述最多输入 50 字！' }
              ],
            })(<TextArea min={0} max={50} />)}
          </FormItem>
          {options.length > 0 ? <FormItem
            {...formItemLayout}
            label="能力选择（最多3个）："
          >
            {getFieldDecorator('abilityLabels', {
              initialValue: abilityLabels && abilityLabels.toJS(),
              rules: [
                 {  required: true, message: '请选择能力', type: 'array' },
                 {  validator: this.checkLevel }
              ],
            })(<CheckboxGroup options={options} />)}
          </FormItem> : ''}
          <FormItem {...formItemLayout} label="评语：">
            {getFieldDecorator('comment', {
              initialValue: levelInfo.get('comment'),
              rules: [
                { required: true, message: '请输入评语！' },
              ],
            })(<TextArea />)}
          </FormItem>
          <FormItem {...formItemLayout} label="总评：">
            {getFieldDecorator('conclusion', {
              initialValue: levelInfo.get('conclusion'),
              rules: [
                { required: true, message: '请输入总评！' },
              ],
            })(<TextArea />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
LevelAttr.propTypes = {
  queryParams: PropTypes.object.isRequired,
  levelId: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};
const EditLevelAttr = Form.create()(LevelAttr);

export default EditLevelAttr;
