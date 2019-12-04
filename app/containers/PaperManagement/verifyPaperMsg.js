const passString = (str) => str.replace(/\s/g, '');

export const verifyData = (data, needFields) => {
  console.log('校验data', data)
  const res = { pass: true, msg: '' };
  if (!passString(data[0].value)) {
    res.pass = false;
    res.msg = '试卷名未填写或包含空格';
    return res;
  }
  data.slice(1).some((item) => {
    const needValidate = needFields ? needFields.includes(item.type) : true;
    const isProvince = item.type == 'provinceId';
    if (item.flag && (isProvince ? item.value < 0 : item.value <= 0) && needValidate) {
      res.pass = false;
      res.msg = `请选择${item.name}`;
      return true;
    }
  });
  return res;
};
