import request, { getjsonoptions } from 'utils/request';
import Config from 'utils/config';
import util from '../../util';

// 省
const getProvince = () => {
  const reqUrl = `${Config.trlink_qb}/api/region/province`;
  return request(reqUrl, Object.assign({}, getjsonoptions()));
};

// 市
const getCity = (params) => {
  if (!params.provinceId) {
    return util.lackParam('省份id');
  }
  const reqUrl = `${Config.trlink_qb}/api/region/city`;
  return request(reqUrl, Object.assign({}, getjsonoptions()), params);
};

// 区
const getCounty = (params) => {
  if (!params.cityId) {
    return util.lackParam('城市id');
  }
  const reqUrl = `${Config.trlink_qb}/api/region/county`;
  return request(reqUrl, Object.assign({}, getjsonoptions()), params);
};

export default {
  getProvince,
  getCity,
  getCounty
};
