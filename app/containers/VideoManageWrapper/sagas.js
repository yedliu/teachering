// import { take, call, put, select } from 'redux-saga/effects';
import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { fromJS } from 'immutable';
import moment from 'moment';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, { geturloptions, deletejsonoptions, postjsonoptions, JsonToUrlParams, putjsonoptions } from 'utils/request';
import { Config } from 'utils/config';
import { message } from 'antd';
import { GET_VIODERECORDLIST_ACTION, GET_TREEDIRECTION_ACTION, SET_BATCHUPVIDEO_ACTION, SET_BATCHDOWNVIDEO_ACTION, SET_BATCHDELETEVIDEO_ACTION, SET_CREATEDIRECTION_ACTION,
  GET_FIRSTDIRECTIONITEM_ACTION, SET_VIDEOCOVER_ACTION, SUBMIT_OPERATEVIDEO_ACTION, SET_RENAMEDIRECTION_ACTION, SET_DELETEDIRECTION_ACTION, SET_REMOVEDIRECTION_ACTION} from './constants';
import { makeSearchItemsValue, makeVideoBelongTypeValue, makeCurrentPageIndex, makeSelectUpVideoIdsValue, makeSetCoverInfoValue, makeChangeSelectDirectionId, makeSelectedOperateVideoItem,
  makeSearchBySetItems, makeTreeRightClickItem, makeAddDirectionInfo, makeDragDirectionItem, makeDropDirectionItem } from './selectors';
import { setTreeDirectionDataAction, setVideoListAction, setVideoTotalCountAction, setLoadingStateAction, setFirstDirectionItem, setSelectUpVideoItemsAction,
  getVideoRecordListAction, setSecondDirectionItemAction, setThirdDirectionItemAction, setSetWrapperOpenAction, setTreeRightMenuOpen, getTreeDirectionAction,
  setResetAddDirectionInfoAction} from './actions';
// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}
export function* getVideoListData() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideo/pageFindLessonGoodVideo`;
  const SearchFormData = yield select(makeSearchItemsValue());
  const belongTo = yield select(makeVideoBelongTypeValue());
  const currentPage = yield select(makeCurrentPageIndex());
  const SearchBySetFormData = yield select(makeSearchBySetItems());
  const params = {belongType:belongTo,teacherName:'',lessonType:'',minWatchCount:'',maxWatchCount:'',beginLesTime:'',endLesTime:'',beginPutTime:'',
    endPutTime:'',phaseNames:'',subjectNames:'',pageIndex:currentPage,pageSize:25,state:'',firstLevelDirectoryId:'',secondLevelDirectoryId:'',
    thirdLevelDirectoryId:'',title:'',speaker:''};
  // const params = {
  //   belongType:belongTo,
  //   teacherName: SearchFormData.get('teacherName',''),
  //   lessonType:SearchFormData.get('lessonType',''),
  //   minWatchCount:SearchFormData.get('minWatchCount',''),
  //   maxWatchCount:SearchFormData.get('maxWatchCount',''),
  //   beginLesTime:SearchFormData.get('beginLesTime',''),
  //   endLesTime:SearchFormData.get('endLesTime','') ,
  //   beginPutTime:SearchFormData.get('beginPutTime',''),
  //   endPutTime:SearchFormData.get('endPutTime',''),
  //   phaseNames:SearchFormData.get('phaseNames',''),
  //   subjectNames:SearchFormData.get('subjectNames',''),
  //   pageIndex:currentPage,
  //   pageSize:8,
  //   state:SearchFormData.get('state') ? SearchFormData.get('state').count() ==2 ? '': SearchFormData.get('state').get(0) : '',
  //   firstLevelDirectoryId:SearchFormData.get('firstLevelDirectoryId',''),
  //   secondLevelDirectoryId:SearchFormData.get('secondLevelDirectoryId',''),
  //   thirdLevelDirectoryId: SearchFormData.get('thirdLevelDirectoryId',''),
  //   title:SearchFormData.get('title',''),
  //   speaker:SearchFormData.get('speaker','')
  // }
  const resultData = Object.assign({},params,SearchFormData.toJS(),SearchBySetFormData.toJS());
  console.log('resultData==',resultData);
  try{
    yield put(setLoadingStateAction(true));
    const repos = yield call(request, requestURL, Object.assign({}, geturloptions()),resultData);
    switch (repos.code.toString()){
      case '0':
        yield put(setVideoListAction(fromJS(repos.data.data ? repos.data.data : [])));
        yield put(setVideoTotalCountAction(repos.data.total ? repos.data.total : 0));
        yield put(setLoadingStateAction(false));
        break;
      default:
        yield put(setLoadingStateAction(false));
        break;
    }
  } catch (err){
    yield put(setLoadingStateAction(false));
  }

}
function* getDirectionTreeData (item,id){
  const requestURL = `${Config.trlink}/api/lessonGoodVideoDirectory/findByParentId`;
  const belongType = yield select(makeVideoBelongTypeValue());
  if(item.leafNode !== 1){
    try{
      const repos = yield call(request, requestURL, Object.assign({}, geturloptions()),{parentId:id,belongType});
      switch (repos.code.toString()){
        case '0':
          repos.data = repos.data ? repos.data : [];
          item.children = repos.data;
          if(item.children.length > 0){
            for (let i=0; i< item.children.length;i++){
              yield getDirectionTreeData(item.children[i],item.children[i].id)
            }
          }
          break;
        default:
          break;
      }
    } catch (err){

    }
  }

}
//获取目录
export function* getTreeDirectionActions() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideoDirectory/findByParentId`;
  const belongType = yield select(makeVideoBelongTypeValue());
  const RootTree = [{name:'根目录',id:0,level:0,parentId:0,type:0,count:0,children:[]}]
  try{
    const repos = yield call(request, requestURL, Object.assign({}, geturloptions()),{parentId:0,belongType});
    switch (repos.code.toString()){
      case '0':
        repos.data = repos.data ? repos.data : [];
        // yield put(setFirstDirectionItem( fromJS(repos.data)));
        for (let i=0;i< repos.data.length;i++){
          yield getDirectionTreeData(repos.data[i],repos.data[i].id)
        }
        RootTree[0].children = repos.data;
        yield put(setTreeDirectionDataAction(fromJS(RootTree)));
        break;
      default:
        break;
    }
  } catch (err){

  }

}
//上架视频
export function* setBatchUpVideoAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideo/up`;
  const selectVideoIds = yield select(makeSelectUpVideoIdsValue());
  const ids = selectVideoIds.toJS().join(',');
  try{
    const repos = yield call(request, requestURL, Object.assign({}, putjsonoptions()),{ids});
    switch (repos.code.toString()){
      case '0':
       console.log('success',repos)
        message.success('视频上架成功!',2);
        yield put(setSelectUpVideoItemsAction(fromJS([])));
        yield put(getVideoRecordListAction());
        break;
      default:
        message.error('视频上架失败!',2);
        break;
    }
  } catch (err){

  }

}
//下架视频
export function* setBatchDownVideoAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideo/down`;
  const selectVideoIds = yield select(makeSelectUpVideoIdsValue());
  const ids = selectVideoIds.toJS().join(',');

  try{
    const repos = yield call(request, requestURL, Object.assign({}, putjsonoptions()),{ids});
    switch (repos.code.toString()){
      case '0':
        console.log('success',repos)
        message.success('视频下架成功!',2);
        yield put(setSelectUpVideoItemsAction(fromJS([])));
        yield put(getVideoRecordListAction());
        break;
      default:
        message.error('视频下架失败!',2);
        break;
    }
  } catch (err){
    message.error('视频下架失败!',2);
  }

}
//删除视频
export function* setBatchDeleteVideoAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideo/delete`;
  const selectVideoIds = yield select(makeSelectUpVideoIdsValue());
  const ids = selectVideoIds.toJS().join(',');
  try{
    const repos = yield call(request, requestURL, Object.assign({}, deletejsonoptions()),{ids});
    switch (repos.code.toString()){
      case '0':
        message.success('删除成功!',2);
        yield put(setSelectUpVideoItemsAction(fromJS([])));
        yield put(getVideoRecordListAction());
        break;
      default:
        message.error('删除失败!',2);
        break;
    }
  } catch (err){
    message.error('删除失败!',2);
  }

}
//添加目录
export function* setCreateDirectionAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideoDirectory/create`;
  const selectItem = yield select(makeTreeRightClickItem());
  const belongTo = yield select(makeVideoBelongTypeValue());
  const AddInfo = yield select(makeAddDirectionInfo());
  const dto = {
    currentId:selectItem.get('id'),
    name:AddInfo.get('name'),
    operateType:AddInfo.get('option'),
    type:belongTo
  };
  try{
    const repos = yield call(request, requestURL, Object.assign({}, postjsonoptions(),{body:JSON.stringify(dto)}));
    switch (repos.code.toString()){
      case '0':
        message.success(repos.message,2);
        yield put(setTreeRightMenuOpen(false));
        yield put(setResetAddDirectionInfoAction(fromJS({})));
        yield put(getTreeDirectionAction());

        break;
      default:
        message.error('新建目录失败！',2)
        break;
    }
  } catch (err){
    message.error('新建目录失败！',2)
  }

}
//各级级目录
export function* getFirstDirectionItemAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideoDirectory/findByParentId`;
  const selectLevel = yield select(makeChangeSelectDirectionId());
  const belongType = yield select(makeVideoBelongTypeValue());
  console.log('sele>>',selectLevel.toJS())
  try{
    const repos = yield call(request, requestURL, Object.assign({}, geturloptions()),{parentId:selectLevel.get('id'),belongType});
    switch (repos.code.toString()){
      case '0':
        repos.data = repos.data ? repos.data : [];
        if(selectLevel.get('label') === '二级目录'){
          yield put(setSecondDirectionItemAction(fromJS(repos.data)));
          yield put(setThirdDirectionItemAction(fromJS([])));
        }else if(selectLevel.get('label') === '三级目录'){
          yield put(setThirdDirectionItemAction(fromJS(repos.data)));
        }else{
          yield put(setFirstDirectionItem(fromJS(repos.data)));
          yield put(setSecondDirectionItemAction(fromJS([])));
          yield put(setThirdDirectionItemAction(fromJS([])));
      }

        break;
      default:
        break;
    }
  } catch (err){

  }

}
//重命名目录
export function* setRenameDirectionAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideoDirectory/rename`;
  const selectItem = yield select(makeTreeRightClickItem());
  const dto = {
    id:selectItem.get('id'),
    name:selectItem.get('name')
  }
  try{
    const repos = yield call(request, requestURL, Object.assign({}, putjsonoptions()),dto);
    switch (repos.code.toString()){
      case '0':
        message.success(repos.message,2);
        yield put(setTreeRightMenuOpen(false));
        yield put(getTreeDirectionAction());
        break;
      default:
        message.error('重命名失败！',2)
        break;
    }
  } catch (err){
    message.error('重命名失败！',2)
  }

}
//删除目录
export function* setDeleteDirectionData() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideoDirectory/delete`;
  const selectItem = yield select(makeTreeRightClickItem());
  const id = selectItem.get('id');
  try{
    const repos = yield call(request, requestURL, Object.assign({}, deletejsonoptions()),{id});
    switch (repos.code.toString()){
      case '0':
        message.success(repos.message,2);
        yield put(setTreeRightMenuOpen(false));
        yield put(getTreeDirectionAction());
        break;
      case '1':
        message.error(repos.message,2);
        break;
      default:
        message.error('删除目录失败！',2)
        break;
    }
  } catch (err){
    message.error('删除目录失败！',2)
  }

}
//移动
export function* setRemoveDirectionAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideoDirectory/move`;
  const beforeId = yield select(makeDropDirectionItem());
  const currentId = yield select(makeDragDirectionItem());
  try{
    const repos = yield call(request, requestURL, Object.assign({}, putjsonoptions()),{beforeId:beforeId.get('id'),currentId:currentId.get('id')});
    switch (repos.code.toString()){
      case '0':
        message.success(repos.message,2);
        // yield put(setTreeRightMenuOpen(false));
        yield put(getTreeDirectionAction());
        break;
      default:
        message.error('移动失败！',2)
        break;
    }
  } catch (err){
    message.error('移动失败！',2)
  }

}
//设置video提交
export function* submitOperateVideoAction() {
  const requestURL = `${Config.trlink}/api/lessonGoodVideo/setting`;
 const operateInfo = yield select(makeSelectedOperateVideoItem());
  const tdo = {
    firstLevelDirectoryId: operateInfo.get('firstLevelDirectoryId'),
    secondLevelDirectoryId: operateInfo.get('secondLevelDirectoryId'),
    thirdLevelDirectoryId: operateInfo.get('thirdLevelDirectoryId'),
    id:operateInfo.get('id'),
    state:operateInfo.get('autoState'),
    speaker:operateInfo.get('speaker'),
    title: operateInfo.get('title')
  }
  try{
    const repos = yield call(request, requestURL, Object.assign({}, putjsonoptions(),{ body: JSON.stringify(tdo) }));
    switch (repos.code.toString()){
      case '0':
        message.success(repos.message,2);
        yield put(setSetWrapperOpenAction(false));
        yield put(getVideoRecordListAction());
        break;
      default:
        message.error('提交失败！',2);
        break;
    }
  } catch (err){
    message.error('提交失败！',2);
  }

}
//
//
export function* getVideoListSagas() {
  const watcher = yield takeLatest(GET_VIODERECORDLIST_ACTION, getVideoListData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getTreeDirectionSagas() {
  const watcher = yield takeLatest(GET_TREEDIRECTION_ACTION, getTreeDirectionActions);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setBatchUpVideoSagas() {
  const watcher = yield takeLatest(SET_BATCHUPVIDEO_ACTION, setBatchUpVideoAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setBatchDownVideoSagas() {
  const watcher = yield takeLatest(SET_BATCHDOWNVIDEO_ACTION, setBatchDownVideoAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setBatchDeleteVideoSagas() {
  const watcher = yield takeLatest(SET_BATCHDELETEVIDEO_ACTION, setBatchDeleteVideoAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setCreateDirectionSagas() {
  const watcher = yield takeLatest(SET_CREATEDIRECTION_ACTION, setCreateDirectionAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* getFirstDirectionItemSagas() {
  const watcher = yield takeLatest(GET_FIRSTDIRECTIONITEM_ACTION, getFirstDirectionItemAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* submitOperateVideoSagas() {
  const watcher = yield takeLatest(SUBMIT_OPERATEVIDEO_ACTION, submitOperateVideoAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setRenameDirectionSagas() {
  const watcher = yield takeLatest(SET_RENAMEDIRECTION_ACTION, setRenameDirectionAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setDeleteDirectionSagas() {
  const watcher = yield takeLatest(SET_DELETEDIRECTION_ACTION, setDeleteDirectionData);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
export function* setRemoveDirectionSagas() {
  const watcher = yield takeLatest(SET_REMOVEDIRECTION_ACTION, setRemoveDirectionAction);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
// All sagas to be loaded
export default [
  defaultSaga,
  getVideoListSagas,
  getTreeDirectionSagas,
  setBatchUpVideoSagas,
  setBatchDownVideoSagas,
  setBatchDeleteVideoSagas,
  setCreateDirectionSagas,
  getFirstDirectionItemSagas,
  submitOperateVideoSagas,
  setRenameDirectionSagas,
  setDeleteDirectionSagas,
  setRemoveDirectionSagas,
];
