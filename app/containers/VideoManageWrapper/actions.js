/*
 *
 * VideoManageWrapper actions
 *
 */

import {
  DEFAULT_ACTION,
  SET_SEARCHPANELOPEN_ACTION,
  CHANGE_SEARCHPANELCONTENT_ACTION,
  SET_VIDEOOPERATEMODAL_OPEN,
  GET_VIODERECORDLIST_ACTION,
  SET_SEARCHFIEIDSITEM_ACTION,
  SET_VIDEOBRLONGTYPE_ACTION,
  SET_TREEDRIECTIONOPEN_ACTION,
  GET_TREEDIRECTION_ACTION,
  SET_TREEDIRECTIONDATA_ACTION,
  SET_TREERIGHTCLICKITEM_ACTION,
  SET_VIDEOLISTS_ACTION,
  SET_VIDEOTOTALCOUNT_ACTION,
  SET_CURRENTPAGENUMBER_ACTION,
  SET_LOADINGSTATE_ACTION,
  SET_SEARCHITEMSINIT_ACTION,
  SET_BATCHUPVIDEO_ACTION,
  SET_SELECTUPVIDEOITEMS_ACTION,
  SET_BATCHDOWNVIDEO_ACTION,
  SET_BATCHDELETEVIDEO_ACTION,
  SET_CREATEDIRECTION_ACTION,
  SET_DELETEDIRECTION_ACTION,
  SET_SELECTDIRECTIONINFO_ACTION,
  SET_SETWRAPPEROPEN_ACTION,
  SET_FRISTDIRECTIONITEM_ACTION,
  GET_FIRSTDIRECTIONITEM_ACTION,
  SET_VIDEOCOVERCONTENT_ACTION,
  SET_VIDEOCOVERURL_ACTION,
  SET_VIDEOCOVER_ACTION,
  SET_VIDEOCOVERINFO_ACTION,
  SET_SELECTOPERATEVIDEOITEM_ACTION,
  SET_CHANGEOPERATEVIDEOVALUE_ACTION,
  SET_CHANGESELECTDIRECTIONID_ACTION,
  SET_SECONDDIRECTIONITEM_ACTION,
  SET_THIRDDIRECTIONITEM_ACTION,
  SUBMIT_OPERATEVIDEO_ACTION,
  SET_SEARCHBYSETEDITEMS_ACTION,
  SET_SEARCHBYSETITEMSINIT_ACTION,
  SET_TREERIGHTMENUOPEN_ACTION,
  SET_TREERIGHTMENUTYPE_ACTION,
  SET_RENAMESELECTTREEITEM_ACTION,
  SET_RENAMEDIRECTION_ACTION,
  SET_ADDDIRECTIONINFO_ACTION,
  SET_REMOVEDIRECTION_ACTION,
  SET_DRAGDIRECTIONITEM_ACTION,
  SET_DROPDIRECTIONITEM_ACTION,
  SET_SECONDDIRECTIONINIT_ACTION,
  SET_THIRDDIRECTIONINIT_ACTION,
  SET_SELECTROTETREEITEM_ACTION,
  SET_RESETADDDIRECTIONINFO_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function setSearchPanelOpenAction(bol) {
  return {
    type: SET_SEARCHPANELOPEN_ACTION,
    bol,
  };
}
export function changeSearchPanelAction(idx) {
  return {
    type: CHANGE_SEARCHPANELCONTENT_ACTION,
    idx,
  };
}
export function setVideoOperateModalOpen(bol) {
  return {
    type: SET_VIDEOOPERATEMODAL_OPEN,
    bol,
  };
}
export function getVideoRecordListAction() {
  return {
    type: GET_VIODERECORDLIST_ACTION,
  };
}
//修改的position
export function setSearchFieldItemsAction(item) {
  return {
    type: SET_SEARCHFIEIDSITEM_ACTION,
    item
  };
}
export function setVideoBelongTypeAction(num) {
  return {
    type: SET_VIDEOBRLONGTYPE_ACTION,
    num,
  };
}
export function setTreeDirectionModalOpen(bol) {
  return {
    type: SET_TREEDRIECTIONOPEN_ACTION,
    bol,
  };
}
export function getTreeDirectionAction() {
  return {
    type: GET_TREEDIRECTION_ACTION,
  };
}
export function setTreeDirectionDataAction(item) {
  return {
    type: SET_TREEDIRECTIONDATA_ACTION,
    item,
  };
}
export function setTreeRightClickItemAction(item) {
  return {
    type: SET_TREERIGHTCLICKITEM_ACTION,
    item,
  };
}
export function setVideoListAction(item) {
  return {
    type: SET_VIDEOLISTS_ACTION,
    item,
  };
}
export function setVideoTotalCountAction(num) {
  return {
    type: SET_VIDEOTOTALCOUNT_ACTION,
    num,
  };
}
export function setCurrentPageNumberAction(num) {
  return {
    type: SET_CURRENTPAGENUMBER_ACTION,
    num,
  };
}
export function setLoadingStateAction(bol) {
  return {
    type: SET_LOADINGSTATE_ACTION,
    bol,
  };
}
export function setSearchItemsInitAction(item) {
  return {
    type: SET_SEARCHITEMSINIT_ACTION,
    item,
  };
}
export function setBatchUpVideoAction() {
  return {
    type: SET_BATCHUPVIDEO_ACTION,
  };
}

export function setSelectUpVideoItemsAction(ids) {
  return {
    type: SET_SELECTUPVIDEOITEMS_ACTION,
    ids,
  };
}
export function setBatchDownVideoAction() {
  return {
    type: SET_BATCHDOWNVIDEO_ACTION,
  };
}
export function setBatchDeleteVideoAction() {
  return {
    type: SET_BATCHDELETEVIDEO_ACTION,
  };
}
export function setCreateDirectionAction() {
  return {
    type: SET_CREATEDIRECTION_ACTION,
  };
}

export function setDeleteDirectionAction() {
  return {
    type: SET_DELETEDIRECTION_ACTION,
  };
}
export function setSelectDirectionAction(info) {
  return {
    type: SET_SELECTDIRECTIONINFO_ACTION,
    info,
  };
}
export function setSetWrapperOpenAction(bol) {
  return {
    type: SET_SETWRAPPEROPEN_ACTION,
    bol,
  };
}
export function setFirstDirectionItem(item) {
  return {
    type: SET_FRISTDIRECTIONITEM_ACTION,
    item,
  };
}
export function getFirstDirectionItemAction() {
  return {
    type: GET_FIRSTDIRECTIONITEM_ACTION,
  };
}
export function setVideoCoverOpenAction(bol) {
  return {
    type: SET_VIDEOCOVERCONTENT_ACTION,
    bol,
  };
}
export function setVideoCoverUrlAction(val) {
  return {
    type: SET_VIDEOCOVERURL_ACTION,
    val,
  };
}
export function setVideoCoverAction() {
  return {
    type: SET_VIDEOCOVER_ACTION,
  };
}
export function setVideoCoverInfoAction(field,value) {
  return {
    type: SET_VIDEOCOVERINFO_ACTION,
    field,
    value
  };
}
export function setSelectOperateVideoItemAction(item) {
  return {
    type: SET_SELECTOPERATEVIDEOITEM_ACTION,
    item,
  };
}
export function setChangOperateVideoValueAction(field,value) {
  return {
    type: SET_CHANGEOPERATEVIDEOVALUE_ACTION,
    field,
    value,
  };
}
export function setChangeSelectDirectionIdAction(item) {
  return {
    type: SET_CHANGESELECTDIRECTIONID_ACTION,
   item
  };
}
export function setSecondDirectionItemAction(item) {
  return {
    type: SET_SECONDDIRECTIONITEM_ACTION,
    item
  };
}
export function setThirdDirectionItemAction(item) {
  return {
    type: SET_THIRDDIRECTIONITEM_ACTION,
    item
  };
}
export function submitOperateVideoAction() {
  return {
    type: SUBMIT_OPERATEVIDEO_ACTION,
  };
}
//修改position1
export function setSearchBySetItems(item) {
  return {
    type: SET_SEARCHBYSETEDITEMS_ACTION,
    item
  };
}
export function setSearchBySetItemInit(item) {
  return {
    type: SET_SEARCHBYSETITEMSINIT_ACTION,
    item
  };
}
export function setTreeRightMenuOpen(bol) {
  return {
    type: SET_TREERIGHTMENUOPEN_ACTION,
    bol
  };
}
export function setTreeRightMenuTypeAction(val) {
  return {
    type: SET_TREERIGHTMENUTYPE_ACTION,
    val
  };
}
export function setRenameSelectTreeItem(val) {
  return {
    type: SET_RENAMESELECTTREEITEM_ACTION,
    val
  };
}
export function setRenameDirectionAction() {
  return {
    type: SET_RENAMEDIRECTION_ACTION,
  };
}
export function setAddDirectionInfo(field,value) {
  return {
    type: SET_ADDDIRECTIONINFO_ACTION,
    field,
    value
  };
}
export function setRemoveDirectionAction() {
  return {
    type: SET_REMOVEDIRECTION_ACTION,
  };
}
export function setDragDirectionItemAction(item) {
  return {
    type: SET_DRAGDIRECTIONITEM_ACTION,
    item,
  };
}
export function setDropDirectionItem(item) {
  return {
    type: SET_DROPDIRECTIONITEM_ACTION,
    item,
  };
}
export function setSecondDirectionInit(item) {
  return {
    type: SET_SECONDDIRECTIONINIT_ACTION,
    item,
  };
}
export function setThirdDirectionInit(item) {
  return {
    type: SET_THIRDDIRECTIONINIT_ACTION,
    item,
  };
}
export function setSelectRoteTreeItem(item) {
  return {
    type: SET_SELECTROTETREEITEM_ACTION,
    item,
  };
}
export function setResetAddDirectionInfoAction(item) {
  return {
    type: SET_RESETADDDIRECTIONINFO_ACTION,
    item,
  };
}

