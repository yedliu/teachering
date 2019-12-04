import request, { postjsonoptions, getloginjsonoptions } from 'utils/request';
import Config from 'utils/config';

// 获取密匙
const applyPublicKey = (params) => {
  const reqUrl = `${Config.zmcLogin}/api/oauth/tr/applyPublicKey`;
  return request(reqUrl, Object.assign({}, postjsonoptions(), {}));
};

// 登录
const login = (params) => {
  const reqUrl = `${Config.zmcLogin}/api/oauth/tr/loginEncrypt`;
  return request(reqUrl, Object.assign({}, postjsonoptions(), { body: JSON.stringify(params) }));
};

// 获取用户信息
const getInfo = (accessToken) => {
  const reqUrl = `${Config.zmtrlink}/api/user/getInfo`;
  return request(reqUrl, Object.assign({}, getloginjsonoptions(accessToken), {}));
};

export default {
  applyPublicKey,
  login,
  getInfo,
};
