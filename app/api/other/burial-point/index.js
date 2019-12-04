import {
    postjsonburialoptions,
    checkStatus
} from 'utils/request';
import Config from 'utils/config';


const reqBurial = (params) => {
    const reqUrl = `${Config.burialPointUrl}`;
    return request(reqUrl, Object.assign({}, postjsonburialoptions(), {
        body: JSON.stringify(params)
    }));
};

/**
 * fetch 请求
 * @params url  接口地址
 * @params options(Object) fetch 请求的配置
 * 。params(Object) 指定请求头的信息
 * 。body(Number) 指定request body 的信息
 */
function request(url, options) {
    return new Promise((resolve, reject) => {
        const params = options;
        return fetch(url, params)
                .then((res) => checkStatus(res, url))
                .catch(err => reject(err));
    });
}

export default reqBurial;
