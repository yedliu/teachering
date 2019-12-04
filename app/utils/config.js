// 接口配置对象
const hostConfig = {};

// 通过命令来决定环境
const setConfig = (window.resetConfig = (type) => {
  if (type === 'prod') {
    hostConfig.trlink = 'https://tr.zmlearn.com';
    hostConfig.oldBase = 'https://fs.zmlearn.com';
    hostConfig.trlink_qb = 'https://qb.zmlearn.com';
    hostConfig.chaturl = 'https://chat.zmlearn.com';
    hostConfig.chat_doc = 'https://chat-doc.zmlearn.com';
    hostConfig.tklink = 'https://homework.zmlearn.com';
    hostConfig.zmlPath = 'https://zml.zmlearn.com';
    hostConfig.data = 'https://log.zmlearn.com';
    hostConfig.zchlink = 'https://chat-gateway.zmlearn.com/zhangmen-client-hw';  // 陆续替换掉 tklink
    hostConfig.RSA = 'https://chat-gateway.zmlearn.com';
    hostConfig.zmtrlink = 'https://chat-gateway.zmlearn.com/zhangmen-client-tr';
    hostConfig.zuulTr = 'https://chat-gateway.zmlearn.com/zuul/zhangmen-client-tr';
    hostConfig.studySys = 'https://chat-gateway.zmlearn.com/zhangmen-client-fileSystem';
    hostConfig.gamelink = 'https://test.hdkj.zmlearn.com/linkUrl/prod';
    hostConfig.zmcqLink = 'https://chat-gateway.zmlearn.com/zhangmen-client-qb';
    hostConfig.zmceLink = 'https://chat-gateway.zmlearn.com/zhangmen-client-exam';
    hostConfig.trCourseOrFeature = 'https://chat.zmlearn.com/gateway';
    hostConfig.zmPianoLink = 'https://chat-gateway.zmlearn.com/zhangmen-client-piano';
    hostConfig.zmPianoUpload = 'https://upload.zmlearn.com/api/pianoLibraryUpload';
    hostConfig.dataViewPath = 'https://statistic-client.zmlearn.com/coursewareHfive';
    hostConfig.burialPointUrl = 'https://user-behavior-log.zmlearn.com/log/item_search';
    hostConfig.zmcLogin = 'https://chat.zmlearn.com/gateway/zmc-login';
    // 学生端测评报告地址
    hostConfig.mobileLink = 'https://mobile.zmlearn.com';
    hostConfig.tqbLink = 'https://chat-gateway.zmlearn.com/zmc-tk-tqb'; // 教资题库
    hostConfig.childH5 = 'https://zmkids-h5.zmpeiyou.com/kids-pad'; // 少儿H5
  } else if (type === 'uat') {
    hostConfig.trlink = 'https://tr.uat.zmops.cc';
    hostConfig.oldBase = 'https://fs.uat.zmops.cc';
    hostConfig.trlink_qb = 'https://qb.uat.zmops.cc';
    hostConfig.chaturl = 'https://chat.uat.zmops.cc';
    hostConfig.chat_doc = 'https://chat-doc.uat.zmops.cc';
    hostConfig.tklink = 'https://homework.uat.zmops.cc';
    hostConfig.zmlPath = 'https://zml.uat.zmops.cc';
    hostConfig.data = 'https://log-test.zmlearn.com';
    hostConfig.zchlink = 'https://client-gateway.uat.zmops.cc/zhangmen-client-hw';  // 陆续替换掉 tklink
    hostConfig.RSA = 'https://client-gateway.uat.zmops.cc';
    hostConfig.zmtrlink = 'https://client-gateway.uat.zmops.cc/zhangmen-client-tr';
    hostConfig.zuulTr = 'https://client-gateway.uat.zmops.cc/zuul/zhangmen-client-tr';
    hostConfig.studySys = 'https://client-gateway.uat.zmops.cc/zhangmen-client-fileSystem';
    hostConfig.gamelink = 'https://test.hdkj.zmlearn.com/linkUrl/uat';
    hostConfig.zmcqLink = 'https://client-gateway.uat.zmops.cc/zhangmen-client-qb';
    hostConfig.zmceLink = 'https://client-gateway.uat.zmops.cc/zhangmen-client-exam';
    hostConfig.trCourseOrFeature = 'https://chat.uat.zmops.cc/gateway';
    hostConfig.zmPianoLink = 'https://client-gateway.uat.zmops.cc/zhangmen-client-piano';
    hostConfig.zmPianoUpload = 'https://upload.uat.zmops.cc/api/pianoLibraryUpload';
    hostConfig.dataViewPath = 'https://statistic-client.uat.zmops.cc/coursewareHfive';
    hostConfig.burialPointUrl = 'http://172.31.118.7:8080/log/item_search';
    hostConfig.zmcLogin = 'https://chat.uat.zmops.cc/gateway/zmc-login';
    // 学生端测评报告地址
    hostConfig.mobileLink = 'https://mobile.uat.zmops.cc';
    hostConfig.tqbLink = 'https://client-gateway.uat.zmops.cc/zmc-tk-tqb'; // 教资题库
    hostConfig.childH5 = ' https://zmkids-h5.uat.zmops.cc/kids-pad'; // 少儿H5
  } else if (type === 'test') {
    hostConfig.trlink = 'https://tr-test.zmlearn.com';
    hostConfig.oldBase = 'https://fs-test.zmlearn.com';
    hostConfig.trlink_qb = 'https://qb-test.zmlearn.com';
    hostConfig.chaturl = 'https://x-chat-test.zmlearn.com';
    hostConfig.chat_doc = 'https://x-chat-doc-test.zmlearn.com';
    hostConfig.tklink = 'https://homework-test.zmlearn.com';
    hostConfig.zmlPath = 'https://zml-test.zmlearn.com';
    hostConfig.data = 'https://log-test.zmlearn.com';
    hostConfig.zchlink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-hw';  // 陆续替换掉 tklink
    hostConfig.RSA = 'https://test-chat-gateway.zmlearn.com';
    hostConfig.zmtrlink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-tr';
    hostConfig.zuulTr = 'https://test-chat-gateway.zmlearn.com/zuul/zhangmen-client-tr';
    hostConfig.zmcqLink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-qb';
    hostConfig.studySys = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-fileSystem';
    hostConfig.gamelink = 'https://test.hdkj.zmlearn.com/linkUrl/test';
    hostConfig.zmceLink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-exam';
    hostConfig.trCourseOrFeature = 'https://x-chat-test.zmlearn.com/gateway';
    hostConfig.zmPianoLink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-piano';
    hostConfig.zmPianoUpload = 'https://upload-test.zmlearn.com/api/pianoLibraryUpload';
    hostConfig.dataViewPath = 'https://statistic-test.zmaxis.com/coursewareHfive';
    hostConfig.burialPointUrl = 'http://10.80.63.100:8080/log/test_item_search';
    hostConfig.zmcLogin = 'https://x-chat-test.zmlearn.com/gateway/zmc-login';
    // 学生端测评报告地址
    hostConfig.mobileLink = 'https://mobile-test.zmlearn.com';
    hostConfig.tqbLink = 'https://test-chat-gateway.zmlearn.com/zmc-tk-tqb'; // 教资题库
    hostConfig.childH5 = 'http://10.81.160.188'; // 少儿H5
  } else {
    hostConfig.trlink = 'https://tr-dev.zmlearn.com';
    hostConfig.oldBase = 'https://fs-dev.zmlearn.com';
    hostConfig.trlink_qb = 'https://qb-dev.zmlearn.com';
    hostConfig.chaturl = 'https://x-chat-dev.zmlearn.com';
    hostConfig.chat_doc = 'https://x-chat-doc-dev.zmlearn.com';
    hostConfig.tklink = 'https://homework-dev.zmlearn.com';
    hostConfig.zmlPath = 'https://zml-test.zmlearn.com';
    hostConfig.data = 'https://log-test.zmlearn.com';
    hostConfig.zchlink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-hw';  // 陆续替换掉 tklink, 暂未配置，先使用 test 环境
    hostConfig.RSA = 'https://test-chat-gateway.zmlearn.com';
    hostConfig.zmtrlink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-tr';
    hostConfig.zuulTr = 'https://test-chat-gateway.zmlearn.com/zuul/zhangmen-client-tr';
    hostConfig.studySys = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-fileSystem';
    hostConfig.gamelink = 'https://test.hdkj.zmlearn.com/linkUrl/test';
    hostConfig.zmcqLink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-qb';
    hostConfig.zmceLink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-exam';
    hostConfig.trCourseOrFeature = 'https://x-chat-test.zmlearn.com/gateway';
    hostConfig.zmPianoLink = 'https://test-chat-gateway.zmlearn.com/zhangmen-client-piano';
    hostConfig.zmPianoUpload = 'https://upload-test.zmlearn.com/api/pianoLibraryUpload';
    hostConfig.dataViewPath = 'https://statistic-test.zmaxis.com/coursewareHfive';
    hostConfig.burialPointUrl = 'http://10.80.63.100:8080/log/test_item_search';
    hostConfig.zmcLogin = 'https://x-chat-test.zmlearn.com/gateway/zmc-login';
    // 学生端测评报告地址
    hostConfig.mobileLink = 'https://mobile-test.zmlearn.com';
    hostConfig.tqbLink = 'https://test-chat-gateway.zmlearn.com/zmc-tk-tqb'; // 教资题库
    hostConfig.childH5 = 'http://10.81.160.188'; // 少儿H5
  }
});

/**
 * 每个环境对应的域名写在 HOSTS 里面
 */
const HOSTS = {
  prod: ['tr.zmlearn.com', 'portal-tr.zmlearn.com'],
  uat: ['tr.uat.zmops.cc', 'portal-tr.uat.zmops.cc'],
  test: ['tr-test.zmlearn.com', 'portal-tr-test.zmlearn.com'],
  dev: ['tr-dev.zmlearn.com']
};

/**
 * @desc 根据当前域名获取当前当前环境
 * @param {string} host 当前域名
 * @return {string} 当前环境
 */
const getEnvTypeByHost = (host) => {
  for (let key in HOSTS) {
    if (HOSTS[key] && HOSTS[key].includes(host)) return key;
  }
  return null;
};

/**
 * @desc 获取 localStorage 中的环境变量或者获取 process.env 的环境变量
 * @return {string} 当前环境
 */
const getEnvTypeByLocalStorageOrProcess = () => {
  return localStorage.getItem('devType') || process.env.ENV_TYPE;
};

/**
 * @desc 获取环境变量
 * @return {string} 环境变量
 */
const getHost = () => {
  const host = window.location.host;
  let env = getEnvTypeByHost(host);
  if (!env) {
    window.openMapRoutesH5 = localStorage.getItem('openMapRoutesH5') || false; // 开发环境，关闭跳转新路由
    env = getEnvTypeByLocalStorageOrProcess();
  }
  return env;
};

// 默认根据域名配置地址，可以通过 window.resetConfig 手动切换配置，用于打包后测试不同环境代码的执行结果
setConfig(getHost());

const Config = hostConfig;

export {
  Config,
  getHost
};

export default Config;
