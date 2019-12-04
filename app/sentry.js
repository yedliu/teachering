/**
 * sentry
 * 参考：https://docs.sentry.io/clients/javascript/config/
 **/
import localStorage from './utils/localStorage';
import { getHost } from  './utils/config';

class Sentry {
  constructor(options = {}) {
    this.init = this.init.bind(this);
    this.initSentry = this.initSentry.bind(this);
    this.shouldSendErrorMessage = this.shouldSendErrorMessage.bind(this);
    this.shouldSendCallback = this.shouldSendCallback.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
    this.clearStack = this.clearStack.bind(this);
    this.loadResourceError = this.loadResourceError.bind(this);

    this.resourceErrorStack = []; // 存储资源错误的数组。
    const dsn = 'https://466a510ecbf4460c8bc8878cdaf1abe6@log-sentry.zmlearn.com/84';
    const sampleRate = 50; // 采样率，默认50，[0,100]
    const environment = getHost();
    const defaultOptions = {
      config: {
        sampleRate, // 采样率
        environment, // 环境标签
        shouldSendCallback: this.shouldSendCallback, // 请求之前的回调
        maxBreadcrumbs: 20, // default 100
      },
      dsn, // 项目 dsn
      timing: 5000, // 资源请求超过指定时长后上报【ms】,默认 1000, v1.2.2 版本及以后支持
      interval: 10000
    };
    this.options = { ...defaultOptions, options };
  }

  /**
   * @description 初始化，添加脚本到 html 中
   * @return {void}
   */
  init() {
    try {
      const RavenJs = document.createElement('script');
      RavenJs.type = 'text/javascript';
      RavenJs.crossorigin = 'anonymous';
      RavenJs.src = 'https://statics-lib.zmlearn.com/raven.js/3.26.2/raven.min.js';
      RavenJs.onload = this.initSentry;
      document.body.appendChild(RavenJs);
    } catch (err) {
      console.error('Sentry 初始化失败：', err);
    }
  }

   /**
   * @description 初始化 Sentry 脚本
   * @return {void}
   */
  initSentry() {
    window.sentry = window.Raven;
    const { dsn, config } = this.options;
    window.sentry.config(dsn, config).install();

    const userId = localStorage.getUserId();
    this.setUserInfo(userId);
    this.clearStack();
    window.addEventListener && window.addEventListener('error', this.loadResourceError, true);
    if (window.performance && window.performance.getEntries) {
      this.getEntries();
    }
  }

   /**
   * @description 设置用户信息
   * @param {number} userId 用户 id
   * @return {void}
   */
  setUserInfo(userId) {
    // window.btoa 转换成 base64, IE10 以上支持
    const id = userId ? (window.btoa ? window.btoa(userId) : `${userId}`) : '未登录';
    if (window.sentry && typeof window.sentry.setUserContext === 'function') {
      window.sentry.setUserContext({ id });
    }
  }

  /**
   * @description 上报资源加载异常的错误
   * @return {void}
   */
  clearStack() {
    const errorStack = this.resourceErrorStack;
    if (window.sentry && errorStack.length > 0) {
      if (typeof window.sentry.captureException !== 'function') return;
      const error = errorStack.shift();
      window.sentry.captureException(error.msg, {
        extra: error.extra
      });
      this.clearStack();
    }
  }

  /**
   * @description 资源加载异常的方法，css/js 等
   * @return {void}
   */
  loadResourceError(e) {
    if (e.target.localName && e.target.src) {
      const item = {
        msg: '[' + e.target.localName.toUpperCase() + ':ERROR] ' + e.target.src,
        extra: {
          resourceType: e.target.localName,
          resourceUrl: e.target.src,
          pageUrl: window.location.href,
          timeStamp: new Date().getTime()
        }
      };
      this.resourceErrorStack.push(item);
    }
    this.clearStack();
  }

   /**
   * @description 根据错误信息检测是否发送错误
   * @param {object} data sentry 中的对象
   * @return {void}
   */
  shouldSendCallback(data) {
    // 本地开发环境不发送错误
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
      return false;
    }
    const errValues = data.exception && data.exception.values;
    if (errValues && Array.isArray(errValues)) {
      const canSubmit = errValues.some((el) => {
        const result = this.shouldSendErrorMessage(el.value);
        return result;
      });
      return canSubmit;
    }
    return false;
  }

   /**
   * @description 过滤不需要的错误信息
   * @return {boolean}
   */
  shouldSendErrorMessage(message) {
    const startByFile = /^file:\/\/\//;
    // 过滤 file:/// 开头的错误
    if (startByFile.test(message)) {
      return false;
    }
    return true;
  }

   /**
   * @description 获取 window.performance.getEntries 中的请求，检测请求是否超时
   * @return {void}
   */
  getEntries() {
    const entries = window.performance.getEntries();
    let index = this.startIndex || 0;
    const length = entries.length;
    while (index < length) {
      this.sendTimeoutError(entries[index]);
      index += 1;
      if (index === length) {
        this.startIndex = index;
      }
    }
    setTimeout(() => {
      this.getEntries();
    }, this.options.interval);
  }

   /**
   * @description 检测请求是否超时，超时则发送超时错误
   * @return {void}
   */
  sendTimeoutError(item) {
    if (item.duration > this.options.timing) {
      setTimeout(function st() {
        const duration = Math.floor(item.duration);
        window.sentry && window.sentry.captureException('[请求时长:' + duration + 'ms] ' + item.name, {
          extra: {
            requestDuration: duration + 'ms',
            resourceType: item.initiatorType,
            pageUrl: window.location.href,
            timeStamp: new Date().getTime()
          },
          level: duration > 5000 ? 'warning' : 'info'
        });
      }, 0);
    }
  }
}

const sentry = new Sentry();

export default sentry;
