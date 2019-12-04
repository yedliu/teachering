/*
* 极验验证码初始化
* */
import 'lib/gt'; // 极验验证码第三方库
import Config from 'utils/config';
import request, { geturloptions } from 'utils/request';

const requestTimeOut = 10 * 1000;

// 获取验证配置
const getVerifyConfig = () => {
  const reqUrl = `${Config.trlink_qb}/api/geetest`;
  return request(reqUrl, Object.assign({ _timeout: requestTimeOut }, geturloptions()));
};

export const gtInit = () => new Promise((resolve, reject) => {
  getVerifyConfig().then((res) => {
    if (!res.data) return reject();
    const data = res.data;
    window.initGeetest({
      gt: data.gt,
      challenge: data.challenge,
      offline: !data.success, // 表示用户后台检测极验服务器是否宕机
      new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
      product: 'bind', // 产品形式，包括：float，popup
      width: '300px'
    }, (captchaObj) => {
      resolve(captchaObj);
    });
  });
});
