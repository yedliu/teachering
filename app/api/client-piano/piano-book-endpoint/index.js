import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';
import { browserHistory } from 'react-router';
import { message } from 'antd';

// 上传压缩文件
const uploadZipPianoBook = ({ formData, uploadProgress }) => {
  const reqUrl = `${Config.zmPianoUpload}/uploadZipPianoBook`;

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', reqUrl);
    xhr.upload.addEventListener('progress', uploadProgress, false);
    xhr.addEventListener('load', e => {
      let repos = e.target.responseText && JSON.parse(e.target.responseText);
      if (repos && repos.message.indexOf('未登录') > -1) {
        message.error(repos.message || '身份验证失败，请重新登录', 2);
        AppLocalStorage.setIsLogin(false);
        browserHistory.replace('/');
        // window.location.reload();
        reject('TokenFailure');
      }
      resolve(repos);
    });
    xhr.addEventListener('error', e => {
      reject(e);
    });
    xhr.setRequestHeader('accessToken', `${AppLocalStorage.getOauthToken()}`);
    xhr.send(formData);
  });
};


const createPianoBook = (params) => {
  const reqUrl = `${Config.zmPianoLink}/pianoBook/createBook`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const uploadRotateImg = (params) => {
  // const reqUrl = 'http://192.168.6.42:8080/api/pianoLibraryUpload/rotateImage';
  const reqUrl = `${Config.zmPianoUpload}/rotateImage`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const rotatePianoImg = (params) => {
  const reqUrl = `${Config.zmPianoLink}/pianoPicture/rotatePianoPicture`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const pageSearch = (params) => {
  const reqUrl = `${Config.zmPianoLink}/pianoBook/pageSearch`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const toppingOneBook = (params) => {
  const reqUrl = `${Config.zmPianoLink}/pianoBook/toppingOneBook`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  uploadZipPianoBook,
  createPianoBook,
  uploadRotateImg,
  rotatePianoImg,
  pageSearch,
  toppingOneBook,
};