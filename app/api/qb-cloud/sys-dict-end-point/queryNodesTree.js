import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';
import cacheData from './cache';

// 请求数据字典
// type = 'QB_CORRECTION_ROLE' | 'QB_CORRECTION_SOURCE' | 'QB_CORRECTION_ROLE,QB_CORRECTION_SOURCE'
const queryNodesTree = async (type) => {
  const cacheTypeData = cacheData[type] || {};
  const nowTime = new Date().getTime();
  if (nowTime - cacheTypeData.fetchTime < cacheData.cacheTime) {
    return cacheTypeData;
  }
  const reqUrl = `${Config.zmcqLink}/api/sysDict/queryNodesTree?groupCodeList=${type}`;
  const repos = request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: type }));
  return repos.then((res) => {
    const dataList = res.data || [];
    if (Number(res.code) === 0 && dataList.length > 0) {
      const data = Object.assign({}, res, {
        fetchTime: nowTime,
        data: dataList.map((item) => Object.assign({}, item, { id: item.itemCode, name: item.itemName })),
      });
      cacheData[type] = data;
    } else {
      cacheData[type] = res;
    }
    return cacheData[type];
  });
};

export default queryNodesTree;


// QB_CORRECTION_ROLE                     用户角色
// QB_CORRECTION_SOURCE                   来源
