import React from 'react';
import { fromJS } from 'immutable';
import { Button, Form, Input, Select, } from 'antd';
import { FlexForm } from './formStyle';
import PaperComponent from '../../../components/PaperComponent';
import { findType } from './utils';
const FormItem = Form.Item;
const Option = Select.Option;
class PaperInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  handleSubmit =(e) => {
    let { handleNext, teachingVersion, courseSystem, prePaperName, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (values.epName.trim() ===  prePaperName.trim()) {
        form.setFields({
          epName: { errors: [new Error('试卷名称必须修改')] }
        });
        return;
      }
      if (!err) {
        handleNext(values, teachingVersion, courseSystem);
      }
    });
  }
  handleChange=(value, type) => {
    let { handleSelect, formList, form } = this.props;
    handleSelect(value, type);
    if (type === 'paperTypeId') {
      formList.forEach(item => {
        if (item.type !== 'paperTypeId' && item.type !== 'source') {
          form.setFieldsValue({ [item.type]: void 0 });
        }
      });
    }
    if (type === 'provinceId') {
      form.setFieldsValue({ cityId: void 0  });
      form.setFieldsValue({ countyId: void 0  });
    }
    if (type === 'cityId') {
      form.setFieldsValue({ countyId: void 0  });
    }
  }
  render() {
    let { loading } = this.state;
    let { formList, needsFiles, teachingVersion, courseSystem, modalConfirm, handleClose } = this.props;
    let hasTeachingVersion = needsFiles.includes('teachingEditionId');
    let hasCourseSystem = needsFiles.includes('editionId');
    let gradeId = findType('gradeId', formList).value;
    let subjectId = findType('subjectId', formList).value;
    let gradeList = findType('gradeId', formList).data;
    const { getFieldDecorator } = this.props.form;
    const config = {};
    const renderFormItem = (item) => {
      item.value ? config.initialValue = item.value : config.initialValue = undefined; // eslint-disable-line
      item.require ? config.rules =  [{ required: true, message: '必填' }] : delete config.rules;
      if (item.type === 'source') config.initialValue = '1';
      if (!item.data) item.data = [];
      console.log(item, 111111);
      return <FormItem
        labelCol={item.width === 70 ? { span: 3 } : { span: 7 }}
        wrapperCol={{ span: 14 }}
        label={item.name}
        key={item.type}
        style={{ width: item.width + '%' }}
      >
        {
          item.formType === 1 ?
            getFieldDecorator(item.type, config)(<Input placeholder={item.placeholder} />) :
            getFieldDecorator(item.type, config)(<Select
              allowClear
              placeholder={item.placeholder}
              disabled={item.type === 'source'}
              onChange={(value) => { this.handleChange(value, item.type) }}
            >
              {
                item.data.map(item1 => <Option value={String(item1.id)} key={item1.id}>{item1.name}</Option>)
              }
            </Select>)

        }
      </FormItem>;
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FlexForm>
          {formList.map(item => renderFormItem(item))}
          {hasTeachingVersion || hasCourseSystem ? (
            <div style={{ width: '100%' }}>
              <PaperComponent
                hasTeachingVersion={hasTeachingVersion}
                hasCourseSystem={hasCourseSystem}
                gradeId={gradeId}
                subjectId={subjectId}
                teachingEditionId={teachingVersion.selectedId}
                editionId={courseSystem.selectedId}
                versionValue={teachingVersion.versionValue}
                systemValue={courseSystem.systemValue}
                gradeList={gradeList}
                onOk={modalConfirm}
                showSystemList={fromJS(courseSystem.showSystemList)}
                editionName={courseSystem.editionName}
                teachingEditionName={teachingVersion.teachingEditionName}
              />
            </div>
            ) : ''}
          <FormItem style={{ width: '100%', textAlign: 'right' }}>
            <Button key="back" size="large" onClick={handleClose} style={{ marginRight: 20 }}>取消</Button>
            <Button key="submit" type="primary" size="large" loading={loading} htmlType="submit">
                下一步
            </Button>
          </FormItem>
        </FlexForm>
      </Form>
    );
  }
}
const PaperInfo = Form.create()(PaperInfoForm);
export default PaperInfo;
