import { fromJS } from 'immutable';
import { isArray, toNumber } from 'lodash';

const getRes = (data, res = fromJS([])) => {
  const children = data.getIn(['props', 'children']) || fromJS([]);
  if (data.getIn(['props', 'isLeaf'])) {
    return res.push(toNumber(data.get('key')));
  } else if (children.count() > 0) {
    let newRes = res;
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
  children.map((item) => {
    res = res.concat(getRes(item));
  });
  return res.toJS();
};
