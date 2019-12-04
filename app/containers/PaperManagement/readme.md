## 试卷管理

### 业务理解

这个界面是所有试卷的来源，（试卷上传那个菜单其实最终都是以题目的形式入库，不是一个概念）；
这里的试卷被用于客户端老师布置试卷，以及其他各个需要用到试卷的地方。
分为草稿箱和已发布试卷。已发布试卷不能变成草稿箱。
试卷有上下架功能，只有上架试卷才会被展示到客户端的老师界面。

### 技术实现

试卷的相关属性都是和试卷类型相关的，不同的试卷类型有不同的试卷属性，
试卷类型是通过接口获取，数据结构如下：
 
```
data: [
  {
    deleted: false
    extra: "subjectId,gradeId,year,evaluationTarget,evaluationPurpose,epBu"
    groupCode: "QB_EXAM_PAPER_TYPE"
    groupName: "试卷类型"
    id: 134
    itemCode: "20"
    itemName: "心理测试"
    orderNum: 20
    parentId: 0
  }
]
```

“**extra**” 字段就是该试卷类型需要的试卷属性。

当然有些属性是每个试卷类型都有的
1.上下架
2.试卷名称
后续的试卷编辑和新增都是跳到题库管理界面；

界面跳转时，关于试卷的属性信息是从当前页面带过去的，
题目数据是重新获取接口获取的（因为获取题目比较耗时，所以是具体点到某一张试卷再获取题目）

### 技术难点

筛选和新增试卷时候，字段都是动态加载的，对应的，校验的时候也是动态的，但是有些字段不是必须的，
也和试卷类型相关，业务比较复杂，校验逻辑没有单独抽离出来。
如之前提到的，跳到已入库题库管理界面的数据是通过 router 的 state 传输，数据交互比较复杂，
所以之后最好把数据提出来。

### ApiList

#### 数据字典 | 按照分组查询一级字典 | queryNodesByGroup

POST | sys-dict-endpoint | /api/sysDict/queryNodesByGroup

```bash
/app/api/qb-cloud/sys-dict-end-point/queryNodesByGroup.js
```

```bash
https://test-chat-gateway.zmlearn.com/zhangmen-client-qb/api/sysDict/queryNodesByGroup
```

详见 /文件/work/zm/教研后台/mock/api/sysDict/queryNodesByGroup/readme.md

##### 试卷测评对象

- 1 学生
- 2 教师
- 3 家长

入参

```json
{
  "groupCode": "QB_EXAM_PAPER_TARGET" // 试卷测评对象(1学生2教师3家长)
}
```

##### 试卷测评用途

- 1 校企合作
- 2 师生配型测试
- 3 分班测试
- 4 阶段性测试
- 5 其他

入参

```json
{
  "groupCode": "QB_EXAM_PAPER_PURPOSE" // 试卷测评用途
}
```

##### 试卷适用BU

- 1 小班课
- 2 一对一

入参

```json
{
  "groupCode": "QB_EXAM_PAPER_BU" // 试卷适用BU
}
```

##### 试卷类型

- 1 同步测试
- 2 单元测试
- 3 专题试卷
- 4 月考试卷
- 5 开学考试
- 6 期中考试
- 7 期末考试
- 8 水平会考
- 9 竞赛测试
- 10 高考模拟
- 11 高考真题
- 12 自主招生
- 13 中考模拟
- 14 中考真题
- 16 重点自测
- 17 随堂测试
- 18 学考
- 19 选考
- 20 心理测试
- 21 小升初

```json
{
  "groupCode": "QB_EXAM_PAPER_TYPE_v1" // 试卷类型
}
```

##### 卷型

- 1 课标Ⅰ卷
- 2 全国Ⅰ卷
- 3 全国Ⅱ卷
- 4 北京卷
- 5 上海卷
- 6 江苏卷
- 7 预赛
- 8 复赛
- 9 决赛
- 10 全国Ⅲ卷
- 11 天津卷
- 12 海南卷
- 13 浙江卷
- 14 北京卷数学（理科）
- 15 北京卷数学（文科）
- 16 全国Ⅰ卷数学（理科）
- 17 全国Ⅰ卷数学（文科）
- 18 全国Ⅱ卷数学（理科）
- 19 全国Ⅱ卷数学（文科）
- 20 全国Ⅲ卷数学（理科）
- 21 全国Ⅲ卷数学（文科）
- 22 天津卷数学（理科）
- 23 天津卷数学（文科）
- 24 优等生课程

入参

```json
{
  "groupCode": "QB_EXAM_TYPE" // 卷型
}
```

#### 试卷 | 查询所有未完成的组卷 | findAssembleExamPaper

POST | exam-paper-endpoint | api/examPaper/action/findAssembleExamPaper

```bash
/app/api/qb-cloud/exam-paper-end-point/index.js
```

```bash
https://test-chat-gateway.zmlearn.com/zhangmen-client-qb/api/examPaper/action/findAssembleExamPaper
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
