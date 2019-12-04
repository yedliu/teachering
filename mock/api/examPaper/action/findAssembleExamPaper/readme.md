## 试卷 | 查询所有未完成的组卷

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
