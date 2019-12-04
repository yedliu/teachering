import { createSelector } from 'reselect';

/**
 * Direct selector to the videoManageWrapper state domain
 */
const selectVideoManageWrapperDomain = () => (state) => state.get('videoManageWrapper');

/**
 * Other specific selectors
 */


/**
 * Default selector used by VideoManageWrapper
 */

const makeSelectVideoManageWrapper = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.toJS()
);
const makeSearchPanelOpen = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('searchPanelOpen')
);
const makeSearchPanelContentIndex = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('searchPanelContentIndex')
);
const makeVideoOperateModalOpen = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('videoOperateModalOpen')
);
const makeSearchItemsValue = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('searchItems')
);
const makeVideoBelongTypeValue = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('belongType')
);
const makeTreeDirectionModalOPen = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('treeDirectionModalOpen')
);
const makeTreeDirectionData = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('directionData')
);
const makeTreeRightClickItem = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('treeRightClickItem')
);
const makeVideoListValue = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('videoList')
);
const makeVideoTotalCountValue = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('videoTotal')
);
const makeCurrentPageIndex = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('currentPageIndex')
);
const makeLoadingStateValue = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('loading')
);
const makeSelectUpVideoIdsValue = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('upVideoIds')
);
const makeSelectDirectionInfo = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('selectDirectionInfo')
);
const makeSetWrapperOpenValue = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('setWrapperOpen')
);
const makeFirstDirectionItem = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('firstDirectionItem')
);
const makeVideoCoverOpenAction = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('videoCover')
);
const makeVideoCoverUrlValue = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('coverUrl')
);
const makeSetCoverInfoValue = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('setCoverInfo')
);
const makeSelectedOperateVideoItem = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('selectedOperateVideo')
);
const makeChangeSelectDirectionId = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('changeSelectDirectionId')
);
const makeSecondDirectionItem = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('secondDirectionItem')
);
const makeThirdDirectionItem = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('thirdDirectionItem')
);
const makeSearchBySetItems = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('searchBySetItem')
);
const makeTreeRightMenuOpen = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('treeRightMenuOpen')
);
const makeTreeRightMenuType = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('treeRightMenuType')
);
const makeAddDirectionInfo = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('addDirectionInfo')
);
const makeDragDirectionItem = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('dragItem')
);
const makeDropDirectionItem = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('dropItem')
);
const makeSelectRoteTreeItem = () => createSelector(
  selectVideoManageWrapperDomain(),
  (substate) => substate.get('selectRoteItem')
);

export default makeSelectVideoManageWrapper;
export {
  selectVideoManageWrapperDomain,
  makeSearchPanelOpen,
  makeSearchPanelContentIndex,
  makeVideoOperateModalOpen,
  makeSearchItemsValue,
  makeVideoBelongTypeValue,
  makeTreeDirectionModalOPen,
  makeTreeDirectionData,
  makeTreeRightClickItem,
  makeVideoListValue,
  makeVideoTotalCountValue,
  makeCurrentPageIndex,
  makeLoadingStateValue,
  makeSelectUpVideoIdsValue,
  makeSelectDirectionInfo,
  makeSetWrapperOpenValue,
  makeFirstDirectionItem,
  makeVideoCoverOpenAction,
  makeVideoCoverUrlValue,
  makeSetCoverInfoValue,
  makeSelectedOperateVideoItem,
  makeChangeSelectDirectionId,
  makeSecondDirectionItem,
  makeThirdDirectionItem,
  makeSearchBySetItems,
  makeTreeRightMenuOpen,
  makeTreeRightMenuType,
  makeAddDirectionInfo,
  makeDragDirectionItem,
  makeDropDirectionItem,
  makeSelectRoteTreeItem,
};
