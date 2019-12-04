## 一对一测评课推荐内容配置

*对“一对一测评课推荐内容”的图片进行配置的页面，只对内容的图片进行配置*

### 使用接口：
|api|说明|参数|方法|
|--|--|--|--|
|`${Config.zmtrlink}/api/grade/findNonPreschoolGrades`|获取过滤掉所有学前的年级，最低从一年级开始| |POST|
|`${Config.zmtrlink}/api/subject/findSubjectByGradeDictCode/${gradeDictCode}`|根据年级获取对应学科，过滤掉所有竞赛学科和钢琴陪练|gradeDictCode|POST|
|`${Config.zmtrlink}/api/testLessonRecommendedContentEndpoint/findByGradeAndSubject`|根据年级和科目查找相关的测评课推荐内容|`{gradeDictCode: string, subjectDictCode: string }`|POST|
|`${Config.zmtrlink}/api/testLessonRecommendedContentEndpoint/uploadPcPicture?id=${reportId}`|上传PC版本图片|<file, id>FormData|POST|
|`${Config.zmtrlink}/api/testLessonRecommendedContentEndpoint/uploadH5Picture?id=${reportId}`|上传H5版本图片|<file, id>FormData|POST|
|`${Config.zmtrlink}/api/testLessonRecommendedContentEndpoint/reuploadPcPicture?id=${reportId}`|更新PC版本图片|<file, id>FormData|POST|
|`${Config.zmtrlink}/api/testLessonRecommendedContentEndpoint/reuploadH5Picture?id=${reportId}`|更新H5版本图片|<file, id>FormData|POST|


### 组件
#### FormSelect
*查询表单组件*
```jsx
// 使用如下
<FormSelect
  gradeList={gradeList}
  selectedGradeId={selectedGradeId}
  subjectList={subjectList}
  selectedSubjectId={selectedSubjectId}
  changeFormData={this.changeFormData}
></FormSelect>

// 数据类型
gradeList: Array<{ gradeDictCode: string | number, gradeName: string }>;
selectedGradeId: string;
subjectList: Array<{ subjectDictCode: string | number, subjectName: string }>;
selectedSubjectId: string;
changeFormData: (params: <selectedGradeId?: string, selectedSubjectId?: string>, type: string) => void
```

#### DataTable
*数据表格*
```jsx
<DataTable
   dataList={moduleList}
   loading={loading}
   tableScrollY={tableScrollY}
   previewImg={this.previewImg}
   preUploadImg={this.preUploadImg}
   finishUpload={this.finishUpload}
 />

 //
 moduleList: Array<{ id:number, moduleName: string, pcPictureUrl: string, h5PictureUrl: string }>;
 loading: boolean;
tableScrollY: number;
previewImg: (imgview: <type: string, url: string, id: number>) => void;
preUploadImg: (imgview: <type: string, url: string, id: number>) => void;
finishUpload: (imgUrl: string | undefined) => void;
```