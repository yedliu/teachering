## 题目管理

### 业务理解

这里是所有题目的来源，在这里可以对题目进行增删改查。
增的入口在新增题目，
查的话就是可以根据界面筛选处各个条件去查询，
最左边是知识点，因为每个题目属于几个知识点，所以根据知识点查题目是业务最高需求，其他的都是一些附带条件。
删在题目列表菜单中，分为为编辑题目标签，编辑题目，
改编题目是业务要求的对一道题目重新生成一模一样的复制品。后端接口知识根据有没有id决定去新建题目还是修改题目，所以只要不传题目id即可

### 技术实现

左边是用了 antd 的**Tree组件**，相关文档可参考 [https://2x.ant.design/components/tree-cn/]。
新建题目中用了**富文本框**，部署在服务器上。
题目展示用了我们自己的组件**zmexamda** 项目地址[http://zmgitlab1.zmlearn.com/guantao.wu/zm-examda]。
其中题目展示比较麻烦的是对于公式的展示，我们是用的**katex**的插件，还额外定义了自定义的标签，具体可以查看题目展示的时候调用的一些转换方法。

#### 选题

从试卷管理的组卷进行编辑或者组题目的时候其实跳到的是已入库题目管理界面，数据通过 **react-router** 的 state 传输

```javascript
  toQuestionManagement(bool, item) {
    const { paperProperty } = this.props;
    const reqUrl = `${Config.trlink_qb}/api/examPaper/action/findExamPaperContentOutputDTOList`;
    request(reqUrl, Object.assign({}, geturloptions()), {
      epId: item.id,
    }).then(res => {
      if (res.code == 0) {
        item.examPaperContentOutputDTOList = res.data;
        browserHistory.push({
          pathname: '/tr/questionmanagement',
          state: {
            editMode: bool ? 'edit' : 'preview', // 表示是预览还是编辑
            paperContent: item,
            groupPaper: true,
            isPublish: paperProperty.get('submitFlag'), // 表示是发布了的还是存在草稿箱的
            from: '/tr/papermanagement'
          },
        });
      } else {
        message.error('查询失败');
      }
    });
  }
```

接收的时候在 componentDidMount 处理。

#### 模板与题型 | templateTypes

- 1 复合题
- 2 选择题
- 3 填空题
- 4 简答题
- 5 分类题
- 6 配对题
- 7 选词填空
- 8 主观选择题


### 技术难点

目前这块界面UI有待加强，现在筛选项太多，导致题目加载很有限，甚至不能看到一道完整的较长的题目。
题目录入目前是采用弹窗形式 Modal，这样子在其他界面调用的时候是以组件的形式；
但其实更好的是用一个单独的路由去做，因为组题目这个功能相对独立，不依赖其他数据，最多就是传入一个题目的id，
成为一个编辑的页面。
另一方面，我们这个组题目组件可能会被其他端应用，那样采用项目内部的组件并不适用。

### ApiList

#### 题库 | 加密查询所有（获取题目） | encrypt

POST | question-endpoint | /api/question/encrypt

```bash
/app/api/qb-cloud/question-endpoint/index.js
```

```bash
https://chat-gateway.zmlearn.com/zhangmen-client-qb/api/question/encrypt（加密接口）
```

入参

```json
{
  "pageIndex":1,
  "pageSize":20,
  "orderByFieldStr":"updatedTime,quoteCount", // 排序字段
  "orderByDirectionStr":"ASC,DESC", // 升序为 ASC，降序为 DESC
  "templateTypes":2, // 限制了模板为选择题
  "subjectId":1, // 学科
  "phaseId":1 // 学段
}
```

#### 保存题目 | question

POST | exam-paper-endpoint | api/examPaper/action/findAssembleExamPaper

```bash
/app/api/qb-cloud/exam-paper-end-point/index.js
```

```bash
https://qb-test.zmlearn.com/api/question/saveQuestion
```

入参

```json
{
  "submitFlag":true, // 是否是草稿箱
  "sort":1, // 排序(0:按照修改时间顺序排列;1:按照修改时间倒序排列;2:按照引用次数顺序排;3:按照引用次数倒序排) ,
  "pageSize":10, // 每页条数
  "pageIndex":1 // 页码
}

```

返回值

```json
{
  "code": "0",
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "size": 10,
    "startRow": 1,
    "endRow": 10,
    "total": 20258,
    "pages": 2026,
    "list": [], // 试卷列表
    "prePage": 0,
    "nextPage": 2,
    "isFirstPage": true,
    "isLastPage": false,
    "hasPreviousPage": false,
    "hasNextPage": true,
    "navigatePages": 8,
    "navigatepageNums": [1,2,3,4,5,6,7,8],
    "navigateFirstPage": 1,
    "navigateLastPage": 8,
    "firstPage": 1,
    "lastPage": 8
  }
}
```

```json
{
      "list": [
      {
        "id": 65048,
        "name": "人教版七年级数学下册《二元一次方程组》单元测评",
        "typeId": 2,
        "typeName": null,
        "businessCardId": null,
        "examTypeId": -1, // 卷型
        "examTypeName": null, // 卷型名称
        "subjectId": 2, // 课程
        "subjectName": null,
        "gradeId": 7, // 年级
        "gradeName": null,
        "termId": 2, // 学期
        "termName": null,
        "year": 2018,
        "averageScore": null,
        "quoteCount": 904,
        "storageTime": null,
        "questionAmount": 20, // 题目数量
        "unRecommondQuestionNum": null, // 未推荐的题目数量
        "createdUser": 1000888483,
        "createUserName": "彭荣荣",
        "createdTime": 1530088004000,
        "updatedTime": 1557400495000,
        "updatedUser": 1007968346,
        "updatedUserName": null,
        "state": null,
        "provinceId": -1, //  省
        "provinceName": null,
        "cityId": -1, // 市
        "cityName": null,
        "countyId": -1, // 县
        "countyName": null,
        "picUrlList": null, // 图片URL列表
        "examPaperContentOutputDTOList": null, // 试卷内容
        "tagUserId1": -1,
        "tagUserName1": null,
        "tagUserId2": -1,
        "tagUserName2": null,
        "fileUrl": null, // 试卷源文件url
        "editionId": 41, // 版本
        "tag1SubmitFlag": null, // 贴标签人1号是否提交
        "tag2SubmitFlag": null,
        "cutUserId": null, // 切割人
        "cutUserName": null,
        "auditCutUserId": null, // 切割审核人
        "auditCutUserName": null,
        "entryUserId": null, // 录入人
        "entryUserName": null,
        "auditEntryUserId": null, // 录入审核人
        "auditEntryUserName": null,
        "auditTagUserId": null, // 贴标签审核人
        "auditTagUserName": null,
        "cutTime": null,
        "auditCutTime": null,
        "entryTime": null,
        "auditEntryTime": null,
        "tag1Time": null,
        "tag2Time": null,
        "auditTagTime": null,
        "cutReceiveTime": null,
        "entryReceiveTime": null,
        "tagReceiveTime1": null,
        "tagReceiveTime2": null,
        "finalAuditUserId": null,
        "finalAuditUserName": null,
        "wrongFlag": false,
        "difficulty": 3, // 难度
        "cutPassFlag": false,
        "entryPassFlag": false,
        "phaseId": 2, // 学段
        "purpose": 1, // 用途
        "courseContentName": "三元一次方程组的解法", // 课程内容名称
        "examPaperTextbook": { // 试卷教材内容
          "id": 5723,
          "epId": 65048,
          "teachingEditionId": 42,
          "teachingEditionName": "人教版",
          "textbookId": null, // 教材
          "textbookName": null,
          "createTime": 1548397387000,
          "createUser": 1000888483,
          "updateTime": null,
          "updateUser": null,
          "deleted": false
        },
        "examPaperCourseContent": {
          "id": 9462,
          "epId": 65048,
          "editionId": 41,
          "editionName": "人教版",
          "courseContentId": 29259, // 课程系统id（树形最末级）
          "courseContentName": "三元一次方程组的解法", // 课程内容名称
          "createTime": 1548397387000,
          "createUser": 1000888483,
          "updateTime": null,
          "updateUser": null,
          "deleted": false
        },
        "examPaperLongPicUrlOutputDTOList": null,
        "evaluationTarget": -1, // 测评对象（选项1学生、2教师、3家长）
        "evaluationPurpose": -1, // 测评用途（选项1校企合作、2师生配型测试、3分班测试、4阶段性测试、5其他）
        "source": 1, // 试卷来源（1掌门原创、2教育资源）
        "onlineFlag": 2, // 上下架状态(1:未上架,2:上架)
        "rateList": null, // 试卷分级信息
        "epBu": -1, // 适用BU（选项1:小班课、2:一对一）
        "totalScore": 0.00,
        "browseCount": 759, // 浏览数量
        "minScore": 0.00, // 试卷最低分
        "kgNumber": null, // 客观题数量
        "zgNumber": null, // 主观题数量
        "epPdfAnswerUrl": null, // 试卷带答案pdf路径
        "epPdfNoAnswerUrl": null // 试卷不带答案pdf路径
      }
    ],
}
```

#### 试卷 | 组卷(保存试卷) | assembleExamPaper

POST | exam-paper-endpoint | /api/examPaper/action/assembleExamPaper

```bash
app/api/qb-cloud/exam-paper-end-point/index.js
```

```bash
https://test-chat-gateway.zmlearn.com/zhangmen-client-qb/api/examPaper/action/assembleExamPaper
```

入参
是否为草稿箱只要传字段 submitFlag 的 bool 值即可

```json
{
  "entryExamPaperContentInputDTOList":[ // [试卷内容相关接口传入参数
    {
      "name":"单选题",
      "serialNumber":1, // 编号
      "entryExamPaperQuesInputDTOList": // 录入试卷题目相关接口传入参数
      [
        {
          "questionId":119956, // 题目 ID
          "serialNumber":1, // 序号
          "score":5 // 题目对应到试卷的分值
        },
        {
          "questionId":119958,
          "serialNumber":2,
          "score":5
        },
        {
          "questionId":2463716,
          "serialNumber":3,
          "score":5
        },
        {
          "questionId":2410585,
          "serialNumber":4,
          "score":5
        },
        {
          "questionId":3088332,
          "serialNumber":5,
          "score":5
        },
        {
          "questionId":3088343,
          "serialNumber":6,
          "score":5
        },
        {
          "questionId":3097212,
          "serialNumber":7,
          "score":5
        },
        {
          "questionId":3097218,
          "serialNumber":8,
          "score":5
        },
        {
          "questionId":3097221,
          "serialNumber":9,
          "score":5
        },
        {
          "questionId":3087917,
          "serialNumber":10,
          "score":5
        },
        {
          "questionId":3087918,
          "serialNumber":11,
          "score":5
        },
        {
          "questionId":3087919,
          "serialNumber":12,
          "score":5
        },
        {
          "questionId":3158935,
          "serialNumber":13,
          "score":5
        },
        {
          "questionId":3158902,
          "serialNumber":14,
          "score":5
        },
        {
          "questionId":3158836,
          "serialNumber":15,
          "score":5
        },
        {
          "questionId":3087826,
          "serialNumber":16,
          "score":5
        },
        {
          "questionId":3087831,
          "serialNumber":17,
          "score":5
        },
        {
          "questionId":3158760,
          "serialNumber":18,
          "score":5
        },
        {
          "questionId":2154704,
          "serialNumber":19,
          "score":5
        },
        {
          "questionId":2154720,
          "serialNumber":20,
          "score":5
        }
      ]
  }],
  "paperTypeId":-1,
  "systemValue":{ // 课程内容
    "label":"选修3旅游地理复习",
    "value":"24077"
  },
  "evaluationPurpose":-1, // 测评用途（选项1校企合作、2师生配型测试、3分班测试、4阶段性测试、5其他）
  "evaluationTarget":-1, // 测评对象（选项1学生、2教师、3家长）
  "countyId":null, // 区（县）
  "epId":135706, // 试卷ID
  "cityId":null, // 市
  "termId":2, // 学期
  "subjectId":9, // 学科
  "showTeachingList":-1,
  "editionId":"77", // 版本
  "editionName":"人教版",
  "teachingEditionId":"", // 教材版本
  "gradeId":11, // 年级ID
  "examTypeId":-1, // 卷型
  "typeId":3, // 试卷类型
  "epName":"高二春季旅游旅游地理测评【人教版】", // 试卷名称
  "versionValue":null, // 教材内容
  "source":1, // 试卷来源（1掌门原创、2教育资源）
  "difficulty":3, // 难度
  "year":2018, // 年份
  "purpose":1, // 用途
  "epBu":-1, // 适用BU（选项1:小班课、2:一对一）
  "onlineFlag":2, // 上下架状态(1:未上架,2:上架) ,
  "submitFlag":true, // 是否提交
  "questionAmount":20 // 题数
}
```

返回值

```json
{
  "code":"0",
  "message":"",
  "data":null
}

```

#### 查询市 | 查询省 | province

共 31 个省

- 3 北京
- 4 上海
- 5 天津
- 6 重庆
- 13 黑龙江
- 14 吉林
- 15 辽宁
- 16 山东
- 17 山西
- 18 陕西
- 19 河北
- 20 河南
- 21 湖北
- 22 湖南
- 23 海南
- 24 江苏
- 25 江西
- 26 广东
- 27 广西
- 28 云南
- 29 贵州
- 30 四川
- 31 内蒙古
- 32 宁夏
- 33 甘肃
- 34 青海
- 35 西藏
- 36 新疆
- 37 安徽
- 38 浙江
- 39 福建

POST | region-endpoint | /api/region/province

```bash
app/api/qb-cloud/region-end-point/index.js
```

```bash
https://chat-gateway.zmlearn.com/zhangmen-client-qb/api/region/province
```

无入参

#### 年级接口 | 查询所有 | findAll

POST | grade-endpoint | /api/grade/findAll

```bash
app/api/tr-cloud/grade-endpoint/index.js
```

#### 获取试卷相关题目接口

```bash
https://test-chat-gateway.zmlearn.com/zhangmen-client-qb/api/examPaper/action/findExamPaperContentOutputDTOList
```
