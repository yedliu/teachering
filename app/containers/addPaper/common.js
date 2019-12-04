import { message } from 'antd';

export const saveValidate = (paperTypeList, params, key = 'extra') => {
  const typeId = params.typeId;
  if (typeId) {
    // 如果有试卷类型 那么要检测所需的 没有则检测所有的
    const paperItem = paperTypeList.find(item => item.itemCode === params.typeId);
    const needFields = paperItem && paperItem[key] ? paperItem[key].split(',') : [];
    // 试卷类型为月考不检测省份
    const index = needFields.indexOf('provinceId');
    if (Number(typeId) === 4 && index >= 0) {
      needFields.splice(index, 1);
    }
    for (let it in params) {
      if (needFields.includes(it) && !['editionId', 'teachingEditionId', 'businessCardId', 'cityId', 'countyId'].includes(it) && (!params[it].toString() || params[it] < 0)) {
        message.warning('请完善表单');
        return false;
      }
    }
  } else {
    message.warning('请选择试卷类型');
    return false;
  }
  console.log('最终params', params);
  return true;
};
