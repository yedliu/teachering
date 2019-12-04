import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';
import util from '../../util';

// 题目来源和适用场景
const getRoot = (params) => {
  const reqUrl = `${Config.zmcqLink}/api/sysDict/queryDictsByGroupList?groupCodeList=${params.groupCode}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

// 题目来源子
const getChildren = (params) => {
  if (!params.pid) {
    return util.lackParam('题目来源父类id');
  }
  const reqUrl = `${Config.zmcqLink}/api/sysDict/querySecondLevelNodesByGroupAndPid?groupCode=${params.groupCode}&pid=${params.pid}`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions()));
};

export default {
  getChildren,
  getRoot
};
