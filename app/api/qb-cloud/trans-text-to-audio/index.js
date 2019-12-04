import Config from 'utils/config';
import request, { postjsontokenoptions } from 'utils/request';


const getAudioUrl = (params = {}) => {
  const requestURL = `${Config.zmcqLink}/api/common/transTextToAudio`;
  return request(
    requestURL,
    Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }),
    // true
    ).then(res => {
      if (res.code !== '0') {
        throw new Error(res.message);
      }
      return res.data;
    })
    .catch(err => ({ message: `${err} 系统请求错误` }));
};

export default getAudioUrl;
