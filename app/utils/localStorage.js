/* eslint-disable no-confusing-arrow */
export const AppLocalStorage = {
  getUserInfo: () => localStorage.getItem('zm-teaching-research-userInfo') ? JSON.parse(localStorage.getItem('zm-teaching-research-userInfo')) : false,
  getIsLogin: () => localStorage.getItem('zm-teaching-research-isLogin') ? JSON.parse(localStorage.getItem('zm-teaching-research-isLogin')) : false,
  getTocken: () => localStorage.getItem('zm-teaching-research-oauthToken') || 'TokenIsNull',
  setUserInfo: (data) => localStorage.setItem('zm-teaching-research-userInfo', JSON.stringify(data)),
  setIsLogin: (data) => localStorage.setItem('zm-teaching-research-isLogin', data),
  // setTocken: (data) => localStorage.setItem('zm-teaching-research-tocken', data ? JSON.stringify(data) : ''),
  setAccessTocken: (data) => localStorage.setItem('accessToken', data),
  setRefreshTocken: (data) => localStorage.setItem('refreshToken', data),
  // removeTocken: () => localStorage.removeItem('zm-teaching-research-tocken'),
  removeUserInfo: () => localStorage.removeItem('zm-teaching-research-userInfo'),
  removeIsLogin: () => localStorage.removeItem('zm-teaching-research-isLogin'),
  getMobile: () => AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().mobile : '',
  getPassWord: () => AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().password : '',
  getUserName: () => AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().name : '',
  getUserId: () => AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().id : -1,
  removePassWord: () => {
    if (AppLocalStorage.getUserInfo()) {
      const data = AppLocalStorage.getUserInfo();
      data.password = '';
      AppLocalStorage.setUserInfo(JSON.stringify(data));
    }
  },
  setPermissions: (data) => localStorage.setItem('permissions', JSON.stringify(data)),
  getPermissions: () => JSON.parse(localStorage.getItem('permissions')) || [],
  setOauthToken: (data) => localStorage.setItem('zm-teaching-research-oauthToken', data),
  getOauthToken: () => localStorage.getItem('zm-teaching-research-oauthToken') || '',
  setBoardShowPaste: (bool) => localStorage.setItem('boardShowPaste', bool), // 设置粘贴板状态
  getBoardShowPaste: () => localStorage.getItem('boardShowPaste'),
  setBoardPasteContent: (data) => localStorage.setItem('boardPasteContent', data), // 设置粘贴板内容
  getBoardPasteContent: () => localStorage.getItem('boardPasteContent'),
  setBoardColor: (hex) => localStorage.setItem('boardColor', hex), // 设置粘贴板颜色
  getBoardColor: () => localStorage.getItem('boardColor'),
  setPaperData: (data) => localStorage.setItem('paperData', JSON.stringify(data)), // 设置试卷内容（试卷管理跳题目管理）
  getPaperData: () => localStorage.getItem('paperData') ? JSON.parse(localStorage.getItem('paperData')) : {}, // 设置书卷内容（试卷管理跳题目管理）
  getBuModule: () => localStorage.getItem('BU_MODULE_TYPE'),
  setBuModule: (buModule) => {
    localStorage.setItem('BU_MODULE_TYPE', `${buModule}`);
  },
};

export default AppLocalStorage;