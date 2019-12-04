import AppLocalStorage from 'utils/localStorage';
import roleApi from 'api/tr-cloud/role-endpoint';

const polyfill = () => {
  // eslint-disable-next-line
  Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
      value => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason })
    );
  };
};

const appFunc = () => {
  // 更新角色权限
  try {
    const id = AppLocalStorage.getUserInfo().roleList[0].id;
    if (id) {
      roleApi.getOne(id).then(res => {
        if (Number(res.code) === 0) {
          const permissions = res.data.permissionOutputDTOList.map(e => e.code);
          if (JSON.stringify(permissions) !== JSON.stringify(AppLocalStorage.getPermissions())) {
            // alert('修改权限了')
            AppLocalStorage.setPermissions(permissions);
            window.location.reload();
          }
        }
      });
    }
  } catch (error) {
  }
  polyfill();
};

export default appFunc;