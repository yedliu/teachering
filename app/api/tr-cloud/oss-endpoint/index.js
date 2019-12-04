import OSS from 'ali-oss';
import Config from 'utils/config';
import request, { postjsontokenoptions } from 'utils/request';
import hash from 'hash.js';
const ossUser = {
  bucket: 'zm-chat-slides',
  funcPoint: 'test-lesson-recommended-content',
  source: 'zm-tk'
};

const getAliossAccess = () => {
  const requestURL = `${Config.zmtrlink}/api/oss/getOssTempAccount`;
  return request(requestURL, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(ossUser) })).then((res) => res.data);
};

export const uploadFileToAliOSS = async (file, keepName) => {
  if (!file) {
    console.error('file 不存在！');
    return;
  }
  return getAliossAccess().then(data => {
    if (!data) {
      console.error('没有ali-oss的权限');
      return false;
    }

    const { accessKeyId, accessKeySecret, securityToken, folderPath } = data;
    console.table(data);
    console.log(file);

    const client  = new OSS({
      // region: 'oss-cn-shanghai',
      accessKeyId,
      accessKeySecret,
      bucket: ossUser.bucket,
      stsToken: securityToken
    });
    let hashCode = hash.sha256().update(Number(new Date()) + file.name).digest('hex');
    const filePath = `${folderPath}/${hashCode}${file.name.replace(/^.*(\.\w+)$/, '$1')}`;
    const tempRes = client.put(filePath, file).then((res) => {
      const zmres = res;
      zmres.url = (res.url || '').replace(/https?.+\.com\//, 'https://image.zmlearn.com');
      // console.log('tempRes', zmres);
      return zmres;
    });
    return tempRes;
  });
};

export default {
  uploadFileToAliOSS,
};
