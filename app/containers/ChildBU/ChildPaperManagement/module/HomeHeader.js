import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { Select, Input, Button, Row, Col } from 'antd';
import {
  setSearchParams,
  getPaperList,
  changePage,
  setPaperData,
  setAllPaperParams,
  setListData,
} from '../redux/action';

const Option = Select.Option;

const ItemWrapper = styled.div`
  margin-bottom: 5px;
`;

const Lable = styled.span`
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-bottom: 5px;
`;

const HomeHeader = ({
  data = fromJS([]),
  paperTypeList,
  typeId,
  addNew,
  searchExamPaper,
  onChange,
  dispatch,
}) => {
  let subjectList = fromJS([]);
  // 获取科目数据
  data.some(el => {
    if (el.get('key') === 'subjectDictCode') {
      subjectList = el.get('data');
      return true;
    }
    return false;
  });
  // 科目发生变化，重新设置年级数据
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
      dispatch(setListData(gradeList, 'gradeList'));
      dispatch(setSearchParams('gradeDictCode', void 0));
    }
  };
  return (
    <div>
      <Row>
        <Col>
          <ItemWrapper>
            <Lable>试卷类型：</Lable>
            <RenderChild
              type="select"
              data={paperTypeList}
              placeholder="请选择试卷类型"
              onChange={value => onChange('typeId', value)}
              value={typeId}
            />
            {/* <span style={{ color: '#999' }}>
              （筛选字段将根据不同的试卷类型有所变动）
            </span> */}
          </ItemWrapper>
        </Col>
      </Row>
      <Row>
        {data.map(el => (
          <Col key={el.get('key')} span={5}>
            <ItemWrapper>
              <Lable>{el.get('label')}：</Lable>
              <RenderChild
                type={el.get('type')}
                data={el.get('data')}
                value={el.get('value')}
                placeholder={el.get('placeholder')}
                onChange={value => handleChange(el.get('key'), value)}
              />
            </ItemWrapper>
          </Col>
        ))}
        <Col span={4}>
          <Button
            onClick={searchExamPaper}
            style={{ marginRight: 5 }}
            type="primary"
          >
            搜索
          </Button>
          <Button type="primary" onClick={addNew}>
            新增试卷
          </Button>
        </Col>
      </Row>
    </div>
  );
};

/**
 * @desc 渲染 Select 或 Input 组件
 * @param {string} type select 返回 Select 组件, input 返回 Input 组件
 * @return {ReactNode}
 */
const RenderChild = ({
  type,
  data = fromJS([]),
  value,
  style = {},
  placeholder,
  onChange,
}) => {
  if (type === 'select') {
    return (
      <Select
        style={{ width: 160, ...style }}
        value={value && `${value}`}
        placeholder={placeholder}
        onChange={onChange}
        allowClear
      >
        {data.map(el => (
          <Option value={`${el.get('id')}`} key={el.get('id')}>
            {el.get('name')}
          </Option>
        ))}
      </Select>
    );
  }

  if (type === 'input') {
    return (
      <Input
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: 160, ...style }}
        value={value}
      />
    );
  }

  return null;
};

const mapStateToProps = state => {
  const subState = state.get('childPaperManagement');
  const list = subState.get('dataList');
  const params = subState.get('searchParams');
  return {
    paperTypeList: list.get('paperTypeList'),
    typeId: params.get('typeId'),
    data: fromJS([
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
      },
      {
        label: '试卷难度',
        key: 'difficulty',
        type: 'select',
        data: list.get('paperDifficulty'),
        value: params.get('difficulty'),
        placeholder: '请选择试卷难度',
      },
      {
        label: '年份',
        key: 'year',
        type: 'select',
        data: list.get('yearList'),
        value: params.get('year'),
        placeholder: '请选择年份',
      },
      {
        label: '上架状态',
        key: 'onlineFlag',
        type: 'select',
        data: list.get('stateList'),
        value: params.get('onlineFlag'),
        placeholder: '请选择上架状态',
      },
      {
        label: '试卷名称',
        key: 'name',
        type: 'input',
        value: params.get('name'),
        placeholder: '请填写试卷名称',
        style: { width: '80%' },
      },
    ]),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (key, value) => {
      dispatch(setSearchParams(key, value));
    },
    searchExamPaper: () => {
      dispatch(getPaperList());
    },
    addNew: () => {
      dispatch(changePage('picker'));
      dispatch(setPaperData(fromJS([])));
      dispatch(setAllPaperParams(fromJS({ typeId: '1', difficulty: '2', })));
    },
    dispatch,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeHeader);
