// 获取需要渲染的字段
export const getPaperFields = (pageType = 1) => {
  const cache = {}; // 缓存数据
  return (typeId, paperTypeList, key = 'extra') => {
    if (cache[typeId]) return cache[typeId];
    const paperItem = paperTypeList.find(item => `${item.itemCode}` === `${typeId}`);
    const extra = JSON.parse(
      (paperItem ? paperItem[key] : '[]').replace(/'/g, '"')
    );
    const fields = extra
      .filter(el => {
        return Array.isArray(el.s) ? el.s.includes(pageType) : Number(el.s) === 1;
      })
      .map(el => el.k);
    cache[typeId] = fields;
    return fields;
  };
};

// 获取必填字段
export const getRequired = () => {
  const cache = {}; // 缓存数据
  return (typeId, paperTypeList, key = 'extra') => {
    if (cache[typeId]) return cache[typeId];
    const paperItem = paperTypeList.find(item => `${item.itemCode}` === `${typeId}`);
    const extra = JSON.parse(
      (paperItem ? paperItem[key] : '[]').replace(/'/g, '"')
    );
    const rules = {};
    extra.forEach(element => {
      rules[element.k] = Number(element.r) === 1;
    });
    cache[typeId] = rules;
    return rules;
  };
};
