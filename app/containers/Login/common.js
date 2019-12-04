import JSEncrypt from 'jsencrypt';

export const encryptPublicKey = (publicKey, mobile, password) => {
  let encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey.replace(/[\r\n]/g, ''));
  let timestamp = new Date().getTime();
  let encrypted = encrypt.encrypt(`{mobile: '${mobile}',password: '${password}',timestamp: '${timestamp}'}`);
  let msg = encrypted;
  const encryptParams = {
    msg
  };
  return encryptParams;
};