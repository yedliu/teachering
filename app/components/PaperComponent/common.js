import { paperTypeList } from "utils/immutableEnum";

export const getPaperFields = (typeId) => {
  return typeId > 0 ? paperTypeList.toJS().find(item => item.id == +typeId).paperFields : [];
} 

// 判断该试卷类型下是否有某个字段
// needFields从外面传入 缓存
export const isFieldInclude = (typeId, key, needFields = []) => {
  if (typeId > 0) {
    return needFields.includes(key);
  } else {
    return true;
  }
}