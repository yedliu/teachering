import React from 'react';
import { Select, Input, Row, Col, Switch } from 'antd';
import { connect } from 'react-redux';
import EditQuestion from './EditQuestion';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import { setPaperParams, setListData, getEditionList, showAllAnswer } from '../redux/action';
import CourseSystem from './CourseSystem';
import { getRules } from '../utils';
const Option = Select.Option;

const ErrorBlock = styled.div`
  color: red;
  width: 100%;
  padding-left: 5px;
  height: 20px;
  line-height: 1;
  padding-bottom: 5px;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-item: center;
`;

export const TextOptionWrapper = styled.div`
  flex: 1;
  position: relative;
  display: inline-block;
  .count {
    position: absolute;
    width: 35px;
    right: 5px;
    top: 0;
    bottom: 0;
    display: inline-block;
    line-height: 28px;
    text-align: right;
  }
`;

export const TextOption = styled(Input)`
  height: 28px;
  padding-right: 40px;
  width: 100%;
`;

const EditForm = ({ data = [], errorMessage = {}, onChange, showAllAnswer, dispatch }) => {
  let subjectList = fromJS([]);
  data.some(el => {
    if (el.key === 'subjectDictCode') {
      subjectList = el.data;
      return true;
    }
    return false;
  });
  const handleChange = (key, value) => {
    typeof onChange === 'function' && onChange(key, value);
    if (key === 'subjectDictCode') {
      let gradeList = fromJS([]);
      subjectList.some(el => {
        if (el.get('id') === value) {
          gradeList = el.get('children');
          return true;
        }
        return false;
      });
      const gradeDictCode = gradeList.getIn([0, 'id']);
      dispatch(setPaperParams('gradeDictCode', void 0));
      dispatch(setPaperParams('editionId', void 0));
      dispatch(setPaperParams('courseSystemId', void 0));
      dispatch(setListData(gradeList, 'gradeList'));
      dispatch(getEditionList({ gradeDictCode, subjectDictCode: value }));
    }
    if (key === 'gradeDictCode') {
      let subjectDictCode;
      data.some(el => {
        if (el.key === 'subjectDictCode') {
          subjectDictCode = el.value;
          return true;
        }
        return false;
      });
      dispatch(setPaperParams('editionId', void 0));
      dispatch(setPaperParams('courseSystemId', void 0));
      dispatch(getEditionList({ gradeDictCode: value, subjectDictCode }));
    }
    if (key === 'editionId') {
      dispatch(setPaperParams('courseSystemId', void 0));
    }
  };
  const rules = getRules();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div>
        <Row>
          {data.map(el => (
            <Col
              span={el.span || 6}
              key={el.key}
              style={{ padding: '0 10px', display: 'flex' }}
            >
              <span
                style={{
                  width: 70,
                  paddingTop: 4,
                  textAlign: 'right',
                  display: 'inline-block',
                }}
              >
                {rules[el.key] && rules[el.key].required && (
                  <em style={{ color: 'red' }}>*</em>
                )}
                {el.label}：
              </span>
              <div style={{ display: 'inline-block', flex: 1 }}>
                <RenderChild
                  style={{ marginBottom: 5,  width: '100%', ...(el.style || {}) }}
                  type={el.type}
                  data={el.data}
                  placeholder={el.placeholder}
                  value={el.value}
                  max={rules[el.key].max}
                  onChange={(value) => { handleChange(el.key, value) }}
                />
                <ErrorBlock>{errorMessage.get(el.key)}</ErrorBlock>
              </div>
            </Col>
          ))}
        </Row>
        <div style={{ display: 'flex', flex: 1 }}>
          <span
            style={{
              width: 80,
              paddingTop: 4,
              textAlign: 'right',
              display: 'inline-block',
            }}
          >
            <em style={{ color: 'red' }}>*</em>
            关联课程：
          </span>
          <div style={{ display: 'inline-block' }}>
            <CourseSystem style={{ display: 'inline-block', marginBottom: 4 }} />
            <ErrorBlock>{errorMessage.get('editionId') || errorMessage.get('courseSystemId')}</ErrorBlock>
          </div>
        </div>
      </div>
      <div
        className="paper-question-list-wrapper"
        style={{ flex: 1, overflow: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}
      >
        <QuestionHeader>
          <div>
            <h3 style={{ padding: 5, display: 'inline-block' }}>题目详情：</h3>
            <ErrorBlock width={100}>{errorMessage.get('examPaperContentOutpuDtoList') && '题目不能为空'}</ErrorBlock>
          </div>
          <div>
            <Switch onChange={showAllAnswer} checkedChildren="显示" unCheckedChildren="隐藏" />
            <span>显示答案与解析</span>
          </div>
        </QuestionHeader>
        <EditQuestion />
      </div>
    </div>
  );
};

const RenderChild = ({
  type,
  data,
  style = {},
  placeholder,
  value,
  onChange,
  max
}) => {
  if (type === 'select') {
    return (
      <Select
        onChange={onChange}
        allowClear
        placeholder={placeholder}
        value={value && `${value}`}
        style={{ width: 150, ...style }}
      >
        {data.map(el => (
          <Option key={el.get('id')} value={`${el.get('id')}`}>
            {el.get('name')}
          </Option>
        ))}
      </Select>
    );
  }

  if (type === 'input') {
    return (
      <TextOptionWrapper style={{ width: 150, ...style }}>
        <TextOption onChange={e => onChange(e.target.value)} value={value} maxLength={max} />
        {
          max && <span className="count"
            style={{ color: value && value.length === max ? '#e0503f' : '#666' }}>
            {value ? value.length : 0}/{max}
          </span>
        }
      </TextOptionWrapper>
    );
  }

  return null;
};

const mapStateToProps = state => {
  const subState = state.get('childPaperManagement');
  const list = subState.get('dataList');
  const params = subState.get('paperParams');
  const errorMessage = subState.get('errorMessage');
  return {
    params,
    errorMessage,
    data: [
      {
        label: '试卷名称',
        key: 'name',
        type: 'input',
        value: params.get('name'),
        span: 24,
        placeholder: '请填写试卷名称',
      },
      {
        label: '试卷类型',
        key: 'typeId',
        type: 'select',
        data: list.get('paperTypeList'),
        value: params.get('typeId'),
        placeholder: '请选择试卷类型',
      },
      {
        label: '学科',
        key: 'subjectDictCode',
        type: 'select',
        data: list.get('subjectList'),
        value: params.get('subjectDictCode'),
        placeholder: '请选择学科',
      },
      {
        label: '年级',
        key: 'gradeDictCode',
        type: 'select',
        data: list.get('gradeList'),
        value: params.get('gradeDictCode'),
        placeholder: '请选择年级',
        rules: { required: true },
      },
      {
        label: '试卷难度',
        key: 'difficulty',
        type: 'select',
        data: list.get('paperDifficulty'),
        value: params.get('difficulty'),
        placeholder: '请选择试卷难度',
        rules: { required: true },
      },
      {
        label: '年份',
        key: 'year',
        type: 'select',
        data: list.get('yearList'),
        value: params.get('year'),
        placeholder: '请选择年份',
        rules: { required: true },
      },
      {
        label: '上架状态',
        key: 'onlineFlag',
        type: 'select',
        data: list.get('stateList'),
        value: params.get('onlineFlag'),
        placeholder: '请选择上架状态',
        rules: { required: true },
      },
    ],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (key, value) => {
      dispatch(setPaperParams(key, value));
    },
    showAllAnswer: (status) => {
      dispatch(showAllAnswer(status));
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditForm);
