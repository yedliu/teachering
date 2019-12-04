# 埋点

跟大数据对接，前端直接把数据发送给大数据部门，

## 文档

埋点数据传入格式：http://confluence.zmops.cc/pages/viewpage.action?pageId=9044805
埋点测试工具：http://confluence.zmops.cc/pages/viewpage.action?pageId=9050766

## 优化搜索功能的埋点

根据大数据需要的格式要求，定义 topic: item_search, test_item_search（测试）
正服 url: http://user-behavior-log.zmlearn.com/log/item_search
测服 url: http://user-behavior-log.zmlearn.com/log/test_item_search

JIRA: [TK-402](http://jira.zmops.cc/browse/TK-402)
课件新增题目时通过关键字搜索出来的题目与实际想要的结果差异比较大，会出现需要翻好几页才能找到用户所需要的题目的情况，
为此对“用户通过搜索选题成功”的行为进行埋点。

发送出去的数据格式如下：

```js
{
    "starttime": 1520322277, // 选题成功后，点击确定的时间
    "user_id": "123", // 用户 ID
    "user_name": "abc", // 用户名
    "pageNum": 3, // 当前第几页
    "pages": 78, // 总页数
    "size": 10, // 当前页返回数据的条数
    "pickedQuestionId": 373338, // 当前选中题目的 ID
    "keyword": "a" // 查询题目的“关键字”
}
```
