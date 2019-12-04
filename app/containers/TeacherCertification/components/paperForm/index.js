import React from 'react';
import { Form, Input, Switch, Button, Select } from 'antd';
import PaperListItem from '../paperListItem';
import styled from 'styled-components';
const Option = Select.Option;
const FormItem = Form.Item;
const ActionBar = styled.div`
display: flex;
justify-content: space-between;
border-bottom: 1px solid #eee;
line-height: 40px;
width: 100%;
`;
const Footer = styled.div`
width: 100%;
text-align: center;
padding-top: 20px;
`;
const QuestionListWrapper = styled.div`
width: 100%;
overflow-y: auto;
flex: 1;
`;
const CuForm = styled(Form)`
 height: 100%;
 display: flex;
 flex-direction: column;
 overflow: hidden;
`;
class PaperForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditScore: false,
      isYearRequired: false
    };
  }
  componentDidMount() {
    const { data } = this.props;
    if (data && data.typeCode === 'tsept_classic_question') {
      this.setState({ isYearRequired: true });
    }
  }

  /**
   * 表单提交
   * @param e
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { onSubmit } = this.props;
        onSubmit(values);
      }
    });
  }
  /**
   * 处理年份是否必填，经典真题的时候必填，全真模拟的时候非必填
   * @param e
   */
  handleSelect=(e) => {
    if (e === 'tsept_real_simulate') {
      // 年份不必填
      this.setState({ isYearRequired: false });
    } else if (e === 'tsept_classic_question') {
      // 年份必填
      this.setState({ isYearRequired: true });
    }
  }
  render() {
    const { isYearRequired } = this.state;
    const { formData, onBatchSetScore, data, selectedSmallId, onDel, onOrder, onShowAnalysis, onBatchShowAnalysis, onEditItem } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { style: { width: '80px' }},
      wrapperCol: { style: { flex: 1 }}
    };
    const oneLine = {
      labelCol: { style: { width: '80px' }},
      wrapperCol: { style: { width: '110px' }},
    };
    return (
      <CuForm onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="试卷名称"
          style={{ display: 'flex' }}
          >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请输入名称'
            }, { max: 50, message: '最多50个字' }],
            initialValue: (data && data.name) || void 0
          })(
            <Input placeholder="请输入名称"  />
            )}
        </FormItem>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {
              formData && formData.map(item => {
                return <FormItem
                  {...oneLine}
                  label={item.label}
                  style={{ display: 'flex' }}
                  key={item.key}
                >
                  {getFieldDecorator(item.key, {
                    rules: item.key === 'yearCode' ? isYearRequired && [{
                      required: true, message: '必填'
                    }] : [{
                      required: true, message: '必填'
                    }],
                    initialValue: (data[item.key] && String(data[item.key])) || void 0
                  })(
                    <Select allowClear placeholder={`请选择${item.label}`} onChange={this.handleSelect}>
                      {item.data.map(op => {
                        return <Option key={op.itemCode} value={String(op.itemCode)}>
                          {op.itemName}
                        </Option>;
                      })}
                    </Select>
                  )}
                </FormItem>;
              })
            }
        </div>
        <ActionBar>
          <h2><strong>题目详情</strong></h2>
          <span>
                答案和解析：
              <Switch checkedChildren="显示" unCheckedChildren="隐藏" onChange={onBatchShowAnalysis}></Switch>
          </span>
        </ActionBar>
        <QuestionListWrapper className="paper-question-list-wrapper">
          <div className="paper-question-list-inner" style={{ position: 'relative' }}>
            {
              data && data.examPaperContentOutpuDtoList ?
                data.examPaperContentOutpuDtoList.map((item, index) => {
                  return  <PaperListItem
                    key={item.name}
                    index={index + 1}
                    bigQuestionList={item}
                    onBatchSetScore={onBatchSetScore}
                    selectedSmallId={selectedSmallId}
                    onDel={onDel}
                    onOrder={onOrder}
                    onShowAnalysis={onShowAnalysis}
                    showEdit
                    onEdit={onEditItem}
                  />;
                }) :
                null
            }
          </div>
        </QuestionListWrapper>
        <Footer>
          <Button type="primary" htmlType="submit" className="paperDetailSubmit">保存并发布</Button>
        </Footer>
      </CuForm>
    );
  }
}
const WrappedPaperForm = Form.create()(PaperForm);
export default WrappedPaperForm;
