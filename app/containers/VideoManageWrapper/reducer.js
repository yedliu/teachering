/*
 *
 * VideoManageWrapper reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_SEARCHPANELOPEN_ACTION,
  CHANGE_SEARCHPANELCONTENT_ACTION,
  SET_VIDEOOPERATEMODAL_OPEN,
  SET_SEARCHFIEIDSITEM_ACTION,
  SET_VIDEOBRLONGTYPE_ACTION,
  SET_TREEDRIECTIONOPEN_ACTION,
  SET_TREEDIRECTIONDATA_ACTION,
  SET_TREERIGHTCLICKITEM_ACTION,
  SET_VIDEOLISTS_ACTION,
  SET_VIDEOTOTALCOUNT_ACTION,
  SET_CURRENTPAGENUMBER_ACTION,
  SET_LOADINGSTATE_ACTION,
  SET_SEARCHITEMSINIT_ACTION,
  SET_SELECTUPVIDEOITEMS_ACTION,
  SET_SELECTDIRECTIONINFO_ACTION,
  SET_SETWRAPPEROPEN_ACTION,
  SET_FRISTDIRECTIONITEM_ACTION,
  SET_VIDEOCOVERCONTENT_ACTION,
  SET_VIDEOCOVERURL_ACTION,
  SET_VIDEOCOVERINFO_ACTION,
  SET_SELECTOPERATEVIDEOITEM_ACTION,
  SET_CHANGEOPERATEVIDEOVALUE_ACTION,
  SET_CHANGESELECTDIRECTIONID_ACTION,
  SET_SECONDDIRECTIONITEM_ACTION,
  SET_THIRDDIRECTIONITEM_ACTION,
  SET_SEARCHBYSETEDITEMS_ACTION,
  SET_SEARCHBYSETITEMSINIT_ACTION,
  SET_TREERIGHTMENUOPEN_ACTION,
  SET_TREERIGHTMENUTYPE_ACTION,
  SET_RENAMESELECTTREEITEM_ACTION,
  SET_ADDDIRECTIONINFO_ACTION,
  SET_DRAGDIRECTIONITEM_ACTION,
  SET_DROPDIRECTIONITEM_ACTION,
  SET_SECONDDIRECTIONINIT_ACTION,
  SET_THIRDDIRECTIONINIT_ACTION,
  SET_SELECTROTETREEITEM_ACTION,
  SET_RESETADDDIRECTIONINFO_ACTION,
} from './constants';

const initialState = fromJS({
  searchPanelOpen:false,
  searchPanelContentIndex:0,
  videoOperateModalOpen:false,
  searchItems:{},
  belongType:1,
  treeDirectionModalOpen:false,
  directionData:[],
  treeRightClickItem:{},
  videoList:[],
  videoTotal:0,
  currentPageIndex:1,
  loading:false,
  upVideoIds:[],
  selectDirectionInfo:{},
  setWrapperOpen:false,
  firstDirectionItem:[],
  secondDirectionItem:[],
  thirdDirectionItem:[],
  videoCover:false,
  coverUrl:'',
  setCoverInfo:{},
  selectedOperateVideo:{},
  changeSelectDirectionId:{label:'一级目录',id:0},
  searchBySetItem:{},
  treeRightMenuOpen:false,
  treeRightMenuType:'',
  addDirectionInfo:{},
  dragItem:{},
  dropItem:{},
  selectRoteItem:[],
});

function videoManageWrapperReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_SEARCHPANELOPEN_ACTION:
      return state.set('searchPanelOpen',action.bol);
    case CHANGE_SEARCHPANELCONTENT_ACTION:
      return state.set('searchPanelContentIndex',action.idx);
    case SET_VIDEOOPERATEMODAL_OPEN:
      return state.set('videoOperateModalOpen',action.bol);
    case SET_SEARCHFIEIDSITEM_ACTION:
      // return state.set('searchItems',state.get('searchItems').setIn([action.field],action.value));
      return state.set('searchItems',action.item);
    case SET_VIDEOBRLONGTYPE_ACTION:
      return state.set('belongType',action.num);
    case SET_TREEDRIECTIONOPEN_ACTION:
      return state.set('treeDirectionModalOpen',action.bol);
    case SET_TREEDIRECTIONDATA_ACTION:
      return state.set('directionData',action.item);
    case SET_TREERIGHTCLICKITEM_ACTION:
      return state.set('treeRightClickItem',action.item);
    case SET_VIDEOLISTS_ACTION:
      return state.set('videoList',action.item);
    case SET_VIDEOTOTALCOUNT_ACTION:
      return state.set('videoTotal',action.num);
    case SET_CURRENTPAGENUMBER_ACTION:
      return state.set('currentPageIndex',action.num);
    case SET_LOADINGSTATE_ACTION:
      return state.set('loading',action.bol);
    case SET_SEARCHITEMSINIT_ACTION:
      return state.set('searchItems',action.item);
    case SET_SELECTUPVIDEOITEMS_ACTION:
      return state.set('upVideoIds',action.ids);
    case SET_SELECTDIRECTIONINFO_ACTION:
      return state.set('selectDirectionInfo',action.info);
    case SET_SETWRAPPEROPEN_ACTION:
      return state.set('setWrapperOpen',action.bol);
    case SET_FRISTDIRECTIONITEM_ACTION:
      return state.set('firstDirectionItem',action.item);
    case SET_VIDEOCOVERCONTENT_ACTION:
      return state.set('videoCover',action.bol);
    case SET_VIDEOCOVERURL_ACTION:
      return state.set('coverUrl',action.val);
    case SET_VIDEOCOVERINFO_ACTION:
      return state.set('setCoverInfo',state.get('setCoverInfo').set(action.field,action.value));
    case SET_SELECTOPERATEVIDEOITEM_ACTION:
      return state.set('selectedOperateVideo',action.item);
    case SET_CHANGEOPERATEVIDEOVALUE_ACTION:
      return state.set('selectedOperateVideo',state.get('selectedOperateVideo').set(action.field,action.value));
    case SET_CHANGESELECTDIRECTIONID_ACTION:
      return state.set('changeSelectDirectionId',action.item);
    case SET_SECONDDIRECTIONITEM_ACTION:
      return state.set('secondDirectionItem',action.item);
    case SET_THIRDDIRECTIONITEM_ACTION:
      return state.set('thirdDirectionItem',action.item);
    case SET_SEARCHBYSETEDITEMS_ACTION:
      //return state.set('searchBySetItem',state.get('searchBySetItem').set(action.field,action.value));
      return state.set('searchBySetItem',action.item);
    case SET_SEARCHBYSETITEMSINIT_ACTION:
      return state.set('searchBySetItem',action.item);
    case SET_TREERIGHTMENUOPEN_ACTION:
      return state.set('treeRightMenuOpen',action.bol);
    case SET_TREERIGHTMENUTYPE_ACTION:
      return state.set('treeRightMenuType',action.val);
    case SET_RENAMESELECTTREEITEM_ACTION:
      return state.set('treeRightClickItem',state.get('treeRightClickItem').set('name',action.val));
    case SET_ADDDIRECTIONINFO_ACTION:
      return state.set('addDirectionInfo',state.get('addDirectionInfo').set(action.field,action.value));
    case SET_DRAGDIRECTIONITEM_ACTION:
      return state.set('dragItem',action.item);
    case SET_DROPDIRECTIONITEM_ACTION:
      return state.set('dropItem',action.item);
    case SET_SECONDDIRECTIONINIT_ACTION:
      return state.set('secondDirectionItem',action.item);
    case SET_THIRDDIRECTIONINIT_ACTION:
      return state.set('thirdDirectionItem',action.item);
    case SET_SELECTROTETREEITEM_ACTION:
      const index = state.get('selectRoteItem').indexOf(action.item);
      return state.set('selectRoteItem',index >= 0 ? state.get('selectRoteItem').delete(index) :state.get('selectRoteItem').push(action.item));
    case SET_RESETADDDIRECTIONINFO_ACTION:
      return state.set('addDirectionInfo',action.item);
    default:
      return state;
  }
}

export default videoManageWrapperReducer;
