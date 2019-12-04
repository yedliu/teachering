import { fromJS } from 'immutable';
import { isArray, toNumber } from 'lodash';

export const sourceList = [{
  source: 'QuestionBank',
  name: '自主选题',
}, {
  source: 'Homework',
  name: '标准作业',
}, {
  source: 'Paper',
  name: '掌门试卷',
}];
export const sortTypes = ['默认', '修改时间', '使用次数'];
export const hwAndPaperPageSize = 10;

const getRes = (data, res = fromJS([])) => {
  const children = data.getIn(['props', 'children']) || fromJS([]);
  if (data.getIn(['props', 'isLeaf'])) {
    return res.push(toNumber(data.get('key')));
  } else if (children.count() > 0) {
    let newRes = res;
    // eslint-disable-next-line array-callback-return
    children.map((item) => {
      newRes = newRes.concat(getRes(item));
    });
    return newRes;
  }
};
export const filterKnowledgeIdList = (data) => {
  let res = fromJS([]);
  if (!isArray(data) && data.node.props.isLeaf) {
    return [toNumber(data.node.props.eventKey)];
  }
  const children = fromJS(data.node.props.children) || fromJS([]);
  // eslint-disable-next-line array-callback-return
  children.map((item) => {
    res = res.concat(getRes(item));
  });
  return res.toJS();
};

export const sortFormat = (sortObj) => {
  let sort = 1;
  if (sortObj) {
    if (sortObj.name === '默认') {
      sort = 1;
    } else if (sortObj.name === '修改时间') {
      if (sortObj.sortUp) {
        sort = 1;
      } else {
        sort = 0;
      }
    } else if (sortObj.name === '使用次数') {
      if (sortObj.sortUp) {
        sort = 3;
      } else {
        sort = 2;
      }
    }
  }
  return sort;
};

export const dicDataFormat = (dataList) => {
  return dataList.map((item) => ({
    name: item.itemName,
    id: toNumber(item.itemCode),
  }));
};