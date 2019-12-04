const headerAndLeftNav = ['appHeader', 'LeftContainer'];

const routes = (option = {}) => {
  const routes = [
    {
      name: 'userPermission',
      path: '/tr/userPermission',
      component: () => import('containers/HomePage/SubHomePage'),
      // permission: ['zm_child_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // (正式)用户管理
      name: 'officialPersonnel',
      path: '/tr/officialpersonnel',
      reducer: () => import('containers/OfficialPersonnel/reducer'),
      sagas: () => import('containers/OfficialPersonnel/sagas'),
      component: () => import('containers/OfficialPersonnel'),
      permission: ['official_staff_management'],
      prevModules: [...headerAndLeftNav]
    },
    {
      // 角色权限配置
      name: 'rolesManage',
      path: '/tr/rolesmanage',
      reducer: () => import('containers/RolesManage/reducer'),
      sagas: () => import('containers/RolesManage/sagas'),
      component: () => import('containers/RolesManage'),
      permission: ['role_permission_management'],
      prevModules: [...headerAndLeftNav]
    }
  ];
  return routes.map(el => ({ ...el, ...option }));
};
export default routes({ type: 'UserPermission' });
