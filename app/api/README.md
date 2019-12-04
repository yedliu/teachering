###开发前必须了解
  1. 请严格按照公司swagger api文档编写此目录文件
  2. 按项目划分 各项目swagger地址
    [老]
      qb: [Link]http://qb-test.zmlearn.com:8080/swagger-ui.html
      tr: [Link]http://tr-test.zmlearn.com:8080/swagger-ui.html
      homework: [Link]http://homework-test.zmlearn.com:8080/swagger-ui.html
    [新]
      qb: [Link]http://10.80.63.108:8086/swagger-ui.html
      tr: [Link]http://10.80.220.157:8086/swagger-ui.html#!/
  3. 目前公司后端项目迁移，新项目api请写在[xxx-cloud]中

###使用规则（建议使用第三种方法await）
  1. *第一种用法*
  ```javascript
    import examApi from 'api/qb/exam-type-controller';
    examApi.getExamType().then((data) => {
      if (data.code == 0) {
        message('成功');
      } else {
        message('失败');
      }
    })
  ```

  2. *第二种用法*
  ```javascript
    import examApi from 'api/qb/exam-type-controller';
    import util from 'api/util';

    // 获取卷型 请使用对象形式传参
    const examFetch = {
      fetch: examApi.getExamType,
      cb: (data) => {
        this.setState({ examTypeList: data });
      },
      name: '卷型',
    };
    util.fetchData(examFetch);
    // 具体参数说明详见api/util.js
  ```

  3. *第三种用法（await）*
  ```javascript
    import examApi from 'api/qb/exam-type-controller';
    import util from 'api/util';
    // 1.单个await
    const data = await gradeApi.getGradeData();
    // 2.多个await（继发）
    const data = await gradeApi.getGradeData();
    const data2 = await region.getProvince();
    // 3.多个await（并发）
    const fetch1 = gradeApi.getGradeData();
    const fetch2 = region.getProvince();
    const data = await fetch1;
    const data2 = await fetch2;
    // 4.多个await（并发2）
    const res = await Promise.all([gradeApi.getGradeData(), region.getProvince()]);
    // 5.异常处理
    const [err, data] = await util.to(gradeApi.getGradeData());
    if (err) {
      throw new Error('获取年级失败', err);
    }
  ```
