import React from 'react';
import { isAuthorised } from 'components/CommonFn';

class PermissionComp extends React.PureComponent {
  render() {
    const { permission, children } = this.props;
    if (isAuthorised(permission)) {
      return children;
    } else {
      return null;
    }
  }
}

export default PermissionComp;
