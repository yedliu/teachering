## 数据字典 | 按照分组查询一级字典

POST | sys-dict-endpoint | /api/sysDict/queryNodesByGroup

```bash
/app/api/qb-cloud/sys-dict-end-point/queryNodesByGroup.js
```

```bash
https://test-chat-gateway.zmlearn.com/zhangmen-client-qb/api/sysDict/queryNodesByGroup
```

### 试卷测评对象

- 1 学生
- 2 教师
- 3 家长

入参

```json
{
  "groupCode": "QB_EXAM_PAPER_TARGET" // 试卷测评对象(1学生2教师3家长)
}
```

返回值

```json
{
  "code":"0",
  "message":"操作成功",
  "data":[
    {
      "id":129,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TARGET",
      "groupName":"试卷测评对象",
      "itemCode":"1",
      "itemName":"学生",
      "orderNum":1,
      "deleted":false,
      "extra":null
    },
    {
      "id":130,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TARGET",
      "groupName":"试卷测评对象",
      "itemCode":"2",
      "itemName":"教师",
      "orderNum":2,
      "deleted":false,
      "extra":null
    },
    {
      "id":131,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TARGET",
      "groupName":"试卷测评对象",
      "itemCode":"3",
      "itemName":"家长",
      "orderNum":3,
      "deleted":false,
      "extra":null
    }]
}
```

### 试卷测评用途

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

返回值

```json
{
  "code":"0",
  "message":"操作成功",
  "data":[
    {
      "id":132,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_PURPOSE",
      "groupName":"试卷测评用途",
      "itemCode":"1",
      "itemName":"校企合作",
      "orderNum":1,
      "deleted":false,
      "extra":null
    },
    {
      "id":133,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_PURPOSE",
      "groupName":"试卷测评用途",
      "itemCode":"2",
      "itemName":"师生配型测试",
      "orderNum":2,
      "deleted":false,
      "extra":null
    },
    {
      "id":134,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_PURPOSE",
      "groupName":"试卷测评用途",
      "itemCode":"3",
      "itemName":"分班测试",
      "orderNum":3,
      "deleted":false,
      "extra":null
    },
    {
      "id":135,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_PURPOSE",
      "groupName":"试卷测评用途",
      "itemCode":"4",
      "itemName":"阶段性测试",
      "orderNum":4,
      "deleted":false,
      "extra":null
    },
    {
      "id":136,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_PURPOSE",
      "groupName":"试卷测评用途",
      "itemCode":"5",
      "itemName":"其他",
      "orderNum":5,
      "deleted":false,
      "extra":null
    }]
}

```

### 试卷适用BU

- 1 小班课
- 2 一对一

入参

```json
{
  "groupCode": "QB_EXAM_PAPER_BU" // 试卷适用BU
}
```

返回值

```json
{
  "code":"0",
  "message":"操作成功",
  "data":[
    {
      "id":137,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_BU",
      "groupName":"试卷适用BU",
      "itemCode":"1",
      "itemName":"小班课",
      "orderNum":1,
      "deleted":false,
      "extra":null
    },
    {
      "id":138,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_BU",
      "groupName":"试卷适用BU",
      "itemCode":"2",
      "itemName":"一对一",
      "orderNum":2,
      "deleted":false,
      "extra":null
    }]
}

```

### 试卷类型

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

```json
{
  "code":"0",
  "message":"操作成功",
  "data":[
    {
      "id":309,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"1",
      "itemName":"同步测试",
      "orderNum":1,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':0},{'k':'cityId','r':0,'s':0},{'k':'countyId','r':0,'s':0},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":310,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"2",
      "itemName":"单元测试",
      "orderNum":2,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':0},{'k':'cityId','r':0,'s':0},{'k':'countyId','r':0,'s':0},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":311,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"3",
      "itemName":"专题试卷",
      "orderNum":3,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':0,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":312,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"4",
      "itemName":"月考试卷",
      "orderNum":4,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":313,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"5",
      "itemName":"开学考试",
      "orderNum":5,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":314,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"6",
      "itemName":"期中考试",
      "orderNum":6,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":315,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"7",
      "itemName":"期末考试",
      "orderNum":7,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":316,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"8",
      "itemName":"水平会考",
      "orderNum":8,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':0},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":317,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"9",
      "itemName":"竞赛测试",
      "orderNum":9,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':0,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':0,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":318,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"10",
      "itemName":"高考模拟",
      "orderNum":10,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':0,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':1},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":319,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"11",
      "itemName":"高考真题",
      "orderNum":11,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':0,'s':0},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':1},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":320,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"12",
      "itemName":"自主招生",
      "orderNum":12,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':0,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':0,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':1,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":321,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"13",
      "itemName":"中考模拟",
      "orderNum":13,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':0,'s':0},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':0,'s':1},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":322,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"14",
      "itemName":"中考真题",
      "orderNum":14,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':0,'s':0},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':0,'s':1},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":323,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"21",
      "itemName":"小升初",
      "orderNum":15,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':0,'s':0},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':0,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':[2]},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":324,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"16",
      "itemName":"重点自测",
      "orderNum":16,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':0,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':0,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":325,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"17",
      "itemName":"随堂测试",
      "orderNum":17,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':1},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':0,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':0,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":326,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"18",
      "itemName":"学考",
      "orderNum":18,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':0},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':0,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":327,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"19",
      "itemName":"选考",
      "orderNum":19,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':0},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':1},{'k':'cityId','r':0,'s':1},{'k':'countyId','r':0,'s':1},{'k':'teachingEditionId','r':0,'s':1},{'k':'examTypeId','r':0,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1}]"
    },
    {
      "id":328,
      "parentId":0,
      "groupCode":"QB_EXAM_PAPER_TYPE_v1",
      "groupName":"试卷类型",
      "itemCode":"20",
      "itemName":"心理测试",
      "orderNum":20,
      "deleted":false,
      "extra":"[{'k':'name','r':1,'s':[1]},{'k':'epName','r':1,'s':[2]},{'k':'subjectId','r':1,'s':1},{'k':'gradeId','r':1,'s':1},{'k':'termId','r':1,'s':0},{'k':'year','r':1,'s':1},{'k':'difficulty','r':1,'s':[2]},{'k':'provinceId','r':1,'s':0},{'k':'cityId','r':0,'s':0},{'k':'countyId','r':0,'s':0},{'k':'teachingEditionId','r':0,'s':0},{'k':'examTypeId','r':0,'s':0},{'k':'businessCardId','r':0,'s':1},{'k':'editionId','r':0,'s':0},{'k':'onlineFlag','r':1,'s':[2]},{'k':'source','r':1,'s':1},{'k':'purpose','r':1,'s':1},{'k':'evaluationTarget','r':1,'s':[2]},{'k':'evaluationPurpose','r':1,'s':[2]},{'k':'epBu','r':1,'s':[2]}]"
    }]
}

```


### 卷型

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

返回值

```json
{
  "code":"0",
  "message":"操作成功",
  "data":[
    {
      "id":21,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"1",
      "itemName":"课标Ⅰ卷",
      "orderNum":1,
      "deleted":false,
      "extra":null
    },
    {
      "id":22,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"2",
      "itemName":"全国Ⅰ卷",
      "orderNum":2,
      "deleted":false,
      "extra":null
    },
    {
      "id":23,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"3",
      "itemName":"全国Ⅱ卷",
      "orderNum":3,
      "deleted":false,
      "extra":null
    },
    {
      "id":24,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"4",
      "itemName":"北京卷",
      "orderNum":4,
      "deleted":false,
      "extra":null
    },
    {
      "id":25,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"5",
      "itemName":"上海卷",
      "orderNum":5,
      "deleted":false,
      "extra":null
    },
    {
      "id":26,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"6",
      "itemName":"江苏卷",
      "orderNum":6,
      "deleted":false,
      "extra":null
    },
    {
      "id":27,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"7",
      "itemName":"预赛",
      "orderNum":7,
      "deleted":false,
      "extra":null
    },
    {
      "id":28,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"8",
      "itemName":"复赛",
      "orderNum":8,
      "deleted":false,
      "extra":null
    },
    {
      "id":29,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"9",
      "itemName":"决赛",
      "orderNum":9,
      "deleted":false,
      "extra":null
    },
    {
      "id":30,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"10",
      "itemName":"全国Ⅲ卷",
      "orderNum":10,
      "deleted":false,
      "extra":null
    },
    {
      "id":31,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"11",
      "itemName":"天津卷",
      "orderNum":11,
      "deleted":false,
      "extra":null
    },
    {
      "id":32,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"12",
      "itemName":"海南卷",
      "orderNum":12,
      "deleted":false,
      "extra":null
    },
    {
      "id":33,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"13",
      "itemName":"浙江卷",
      "orderNum":13,
      "deleted":false,
      "extra":null
    },
    {
      "id":34,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"14",
      "itemName":"北京卷数学（理科）",
      "orderNum":14,
      "deleted":false,
      "extra":null
    },
    {
      "id":35,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"15",
      "itemName":"北京卷数学（文科）",
      "orderNum":15,
      "deleted":false,
      "extra":null
    },
    {
      "id":36,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"16",
      "itemName":"全国Ⅰ卷数学（理科）",
      "orderNum":16,
      "deleted":false,
      "extra":null
    },
    {
      "id":37,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"17",
      "itemName":"全国Ⅰ卷数学（文科）",
      "orderNum":17,
      "deleted":false,
      "extra":null
    },
    {
      "id":38,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"18",
      "itemName":"全国Ⅱ卷数学（理科）",
      "orderNum":18,
      "deleted":false,
      "extra":null
    },
    {
      "id":39,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"19",
      "itemName":"全国Ⅱ卷数学（文科）",
      "orderNum":19,
      "deleted":false,
      "extra":null
    },
    {
      "id":40,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"20",
      "itemName":"全国Ⅲ卷数学（理科）",
      "orderNum":20,
      "deleted":false,
      "extra":null
    },
    {
      "id":41,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"21",
      "itemName":"全国Ⅲ卷数学（文科）",
      "orderNum":21,
      "deleted":false,
      "extra":null
    },
    {
      "id":42,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"22",
      "itemName":"天津卷数学（理科）",
      "orderNum":22,
      "deleted":false,
      "extra":null
    },
    {
      "id":43,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"23",
      "itemName":"天津卷数学（文科）",
      "orderNum":23,
      "deleted":false,
      "extra":null
    },
    {
      "id":44,
      "parentId":0,
      "groupCode":"QB_EXAM_TYPE",
      "groupName":"卷型",
      "itemCode":"24",
      "itemName":"优等生课程",
      "orderNum":24,
      "deleted":false,
      "extra":null
    }]
}
```

