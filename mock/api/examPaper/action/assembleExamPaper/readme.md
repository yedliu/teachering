## 试卷 | 组卷(保存试卷)

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
