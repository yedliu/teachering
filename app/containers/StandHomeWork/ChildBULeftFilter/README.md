###业务说明：
少儿BU标准作业管理左侧的筛选栏，根据年级，学科，课程体系筛选课程。这里显示所有的课程体系（包含不上架的）

###index.js

参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
subjectGradeData | 课程年级数据 | Array | -
treeData | 树形结构数据 | Array | -
currentCourse | 当前课程体系 | Array | -
getChildBUCourseSystem | 获取课程体系 | Func | -
getChildBUCourses | 获取课程 | Func | -
handlerSelectCourse | 处理点击树节点，根据输入的节点数据获取作业列表数据 | Func | -
selectTree | 已选的节点（用来控制默认选择的节点）| Object | -
parentSelectChange | 处理左侧select组件的change事件,主要用来同步prviewSelectObj| Func | -
selectedParams | 传入已选的筛选条件 | Func | -
childSelectChange | 处理select组件的change事件，根据条件获取作业列表 | Func | -

#### TestHomeworkSlider.js
根据学科年级获取少儿测评课课程
参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
subjectList | 学科数据 | Array | -
gradeList | 年级数据 | Array | -
courseSystemList | 测评课课程列表 | Array | -
subjectDictCode | 选中的学科 ID | String | -
gradeDictCode | 选中的年级 ID | String | -
courseSystemId | 选中的测评课ID | Number | -
handleSubjectChange | 选中的学科发生变化 | Func | -
handleGradeChange | 选中的年级发生变化 | Func | -
handleCourseClick | 选中的测评课课程变化 | Func | -
loading | 是否是加载中 | Boolean | -
