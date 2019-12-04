import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const getProvince = () => {
  const reqUrl = `${Config.zmcqLink}/api/region/province`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {}));
};

const getCityByProvinceId = (provinceId) => {
  const reqUrl = `${Config.zmcqLink}/api/region/city`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {}), { provinceId });
};

const getCountyByCityId = (cityId) => {
  const reqUrl = `${Config.zmcqLink}/api/region/county`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), {}), { cityId });
};

export default {
  getProvince,
  getCityByProvinceId,
  getCountyByCityId,
};