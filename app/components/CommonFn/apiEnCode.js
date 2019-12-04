// import { isObject } from 'lodash';
import { encryption, decryption } from 'zm-tk-ace/utils';
/**
 * 生成 AESkey
 * @param {number} min 最小长度
 * @param {number} max 最大长度
 * @returns {string} AESkey
 */
// function randomRange(min, max) {
//   let returnStr = '';
//   const range = (max ? Math.round(Math.random() * (max - min)) + min : min);
//   const charStr = 'abcdefghijklmnopqrstuvwxyz0123456789';
//   for (let i = 0; i < range; i += 1) {
//     const index = Math.round(Math.random() * (charStr.length - 1));
//     returnStr += charStr.substring(index, index + 1);
//   }
//   return returnStr;
// }
/**
 * 进行 AES 加密
 * @param {*} word 需要加密的字符串
 * @param {*} key 密钥
 */
// function Encrypt(word, key) {
//   const iCryptoJS = window.CryptoJS;
//   if (iCryptoJS) {
//     const ikey = iCryptoJS.enc.Utf8.parse(key);
//     const srcs = iCryptoJS.enc.Utf8.parse(word);
//     const encrypted = iCryptoJS.AES.encrypt(srcs, ikey, { mode: iCryptoJS.mode.ECB, padding: iCryptoJS.pad.Pkcs7 });
//     return encrypted.toString();
//   }
//   alert('系统异常，请刷新后重试');
//   return '';
// }
/**
 * AES 解密
 * @param {*} word 需要进行解密的字符串
 * @param {*} key 密钥
 */
// function Decrypt(word, key) {
//   const iCryptoJS = window.CryptoJS;
//   if (iCryptoJS) {
//     const ikey = iCryptoJS.enc.Utf8.parse(key);
//     const decrypt = iCryptoJS.AES.decrypt(word, ikey, { mode: iCryptoJS.mode.ECB, padding: iCryptoJS.pad.Pkcs7 });
//     return iCryptoJS.enc.Utf8.stringify(decrypt).toString();
//   }
//   alert('系统异常，请刷新后重试');
//   return '';
// }
// const RSADo = {
//   modulus: '980d6ceba3cd305a6b6e3681c7596161975cdf7e7f154eae09dc1f9457dd49f7aee47fcd7b6f46570bbeaaa8a3eae5cdf2118458449ca49d9fc78461ec2c972742c8b803e7608efbce5f4f6864920a9d456847b8c8197eb642d18781ba63782771854eb55e75d85fc3a0e3e9fdae2ff98d4014423553ab26e0a6d08172731793',
//   publicExponent: '10001',
// };

const DesKey = window.RSAKey;
const rsa = new DesKey();

/**
 * 参数加密
 * @param {string|{}} params 需要加密的参数
 * @param {*} type 所给参数类型 json 或 Object，默认Object
 * @returns {{param1:string,param2:string}} newParams
 */
// export const encryption = (params, type) => {
//   console.log(params, 'params');
//   if (rsa) {
//     const paramsString = isObject(params) ? JSON.stringify(params) : params;
//     const key = randomRange(16, 16);
//     const encryptAes = Encrypt(paramsString, key);
//
//     rsa.setPublic(RSADo.modulus, RSADo.publicExponent);
//     const encryptStr = rsa.encrypt(key);
//     const newParams = {
//       param1: encryptAes,
//       param2: encryptStr,
//     };
//     return type === 'json' ? JSON.stringify(newParams) : newParams;
//   }
//   alert('系统异常，请刷新后再次尝试');
// };

/**
 * 字符串加密
 * @param {*} string 需要加密的字符串
 * @param {*} publicKey 公钥
 * @returns {string} encryptStr
 */
export const encryString = (string, publicKey) => {
  if (rsa) {
    rsa.setPublic(publicKey);
    const encryptStr = rsa.encrypt(string);
    return encryptStr;
  }
  alert('系统异常，请刷新后再次尝试');
};

/**
 * 数据解密
 * @param {{code:string,message:string,data:any[]}} res 需要解密的接口返回数据
 */
// export const decryption = (res = '') => {
//   if (rsa) {
//     let cryptData = res;
//     let resData = null;
//     const isRepos = isObject(res) && res.data;
//     if (isRepos) {
//       if (res.code === 7) return cryptData;
//       cryptData = res.data;
//       const data = JSON.parse(cryptData || '');
//       const Aeskey = rsa.decryptByPub(data.param2);
//       const dataContent = JSON.parse(Decrypt(data.param1, Aeskey) || '') || null;
//       resData = Object.assign(res, { data: dataContent });
//     } else if (typeof res === 'string') {
//       const data = JSON.parse(cryptData || '');
//       const Aeskey = rsa.decryptByPub(data.param2);
//       resData = JSON.parse(Decrypt(data.param1, Aeskey) || '') || null;
//     }
//     console.log(resData, 'resData');
//     return resData;
//   }
//   alert('系统异常，请刷新后再次尝试');
// };

export { encryption, decryption };
