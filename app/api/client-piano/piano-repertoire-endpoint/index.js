import request, { postjsontokenoptions } from 'utils/request';
import Config from 'utils/config';

const createRepertoires = (params) => {
  const reqUrl = `${Config.zmPianoLink}/pianoRepertoire/createRepertoires`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const batchRemove = (params) => {
  const reqUrl = `${Config.zmPianoLink}/pianoRepertoire/batchDelete`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

const batchMove = (params) => {
  const reqUrl = `${Config.zmPianoLink}/pianoRepertoire/batchMoveToPianoBook`;
  return request(reqUrl, Object.assign({}, postjsontokenoptions(), { body: JSON.stringify(params) }));
};

export default {
  createRepertoires,
  batchRemove,
  batchMove
};