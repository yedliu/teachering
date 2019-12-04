import React from 'react';
import { Select, Cascader } from 'antd';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { setPaperParams, getCourseSystemList } from '../redux/action';
const Option = Select.Option;

// 转换为 Cascader 可用的数据
const convertData = data => {
  if (!Array.isArray(data)) return void 0;
  return data.map(el => {
    const children = convertData(el.children);
    return { label: el.name, value: el.id, children };
  });
};

// 根据最后一级的 ID 查找之前所有的节点
let find = (array, id) => {
  let stack = [];
  let going = true;

  let walker = (array, id) => {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (!going) break;
      stack.push(item['value']);
      if (item['value'] === id) {
        if (item['children']) stack = [];
        going = false;
      } else if (item['children']) {
        walker(item['children'], id);
      } else {
        stack.pop();
      }
    }
    if (going) stack.pop();
  };

  walker(array, id);
  return stack;
};

const CourseSystem = ({
  editionList = fromJS([]),
  courseSystemList = fromJS([]),
  editionId,
  courseSystemId,
  onChange,
  gradeDictCode,
  subjectDictCode,
  dispatch,
  style = {},
}) => {
  const courseData = convertData(courseSystemList.toJS());
  const ids = find(courseData, courseSystemId);
  console.log(ids, courseSystemId, courseData);
  return (
    <div style={{ ...style }}>
      <Select
        style={{ margin: '0 5px 0 0', width: 160 }}
        placeholder="请选择正式课体系"
        value={editionId && `${editionId}`}
        onChange={value => {
          onChange('editionId', value);
          dispatch(
            getCourseSystemList({
              gradeDictCode,
              subjectDictCode,
              editionId: value,
            }),
          );
        }}
      >
        {editionList.map(el => (
          <Option value={`${el.get('id')}`} key={el.get('id')}>
            {el.get('name')}
          </Option>
        ))}
      </Select>
      <Cascader
        style={{ width: 320 }}
        options={
          courseData.length > 0
            ? courseData
            : [
              {
                value: '无正式课课程',
                label: '当前筛选条件无正式课课程',
                disabled: true,
              },
            ]
        }
        value={ids}
        placeholder="请选择关联课程"
        notFoundContent="无正式课课程"
        onChange={value => onChange('courseSystemId', value[value.length - 1])}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const subState = state.get('childPaperManagement');
  const list = subState.get('dataList');
  const params = subState.get('paperParams');
  return {
    editionId: params.get('editionId'),
    editionList: list.get('editionList'),
    courseSystemList: list.get('courseSystemList'),
    courseSystemId: params.get('courseSystemId'),
    subjectDictCode: params.get('subjectDictCode'),
    gradeDictCode: params.get('gradeDictCode'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (key, value) => {
      dispatch(setPaperParams(key, value));
    },
    dispatch,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseSystem);
