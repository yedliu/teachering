import queryNodesByGroup from './queryNodesByGroup';
import queryNodesByGroupList from './queryNodesByGroupList';
import queryNodesTree from './queryNodesTree';
import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const getChildren = ({ params = {}}) => {
  const reqUrl = `${Config.zmcqLink}/api/sysDict/querySecondLevelNodesByGroupAndPid`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {}), params);
};


export default {
  ...queryNodesByGroup,
  queryNodesByGroupList,
  getChildren,
  queryNodesTree,
};
