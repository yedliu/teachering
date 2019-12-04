## 题目纠错

https://test-chat-gateway.zmlearn.com/zhangmen-client-qb/api/questionCorrention/findHandle

入参：

```json
{
  "pageIndex":1,
  "pageSize":20,
  "correctionType":"6",
  "subjectId":19,
  "phaseId":1,
  "sourceModule":"3",
  "handleUserName":"lulu",
  "beginTime":"2019-08-05T16:00:00.000Z", // 开始时间
  "endTime":"2019-08-23T15:59:59.000Z", // 结束时间
  "adoptStats":"3"
}
```

https://test-chat-gateway.zmlearn.com/zhangmen-client-qb/api/questionCorrention/findUnhandle

## 试卷纠错

https://test-chat-gateway.zmlearn.com/zhangmen-client-qb/api/questionCorrention/examPaperCorrention

入参：

```json
  {
    "pageIndex":1,
    "pageSize":20,
    "examPaperId":2334 // 试卷ID
  }
```
