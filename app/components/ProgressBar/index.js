import React from 'react';
import ProgressBar from './ProgressBar';

const noNeedProcess = []; // 不需要进度条的
function withProgressBar(WrappedComponent) {
  class AppWithProgressBar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        progress: -1,
        loadedRoutes: props.location && [props.location.pathname],
      };
      this.updateProgress = this.updateProgress.bind(this);
    }

    componentWillMount() {
      // 为了处理加载过的界面不再显示进度条
      const { router } = this.props;
      this.unsubscribeHistory = router && router.listenBefore((location) => {
        if (location && this.state.loadedRoutes.indexOf(location.pathname) === -1) {
          const currentLocation = router.getCurrentLocation();
          if (noNeedProcess.indexOf(currentLocation.pathname) > -1) {
            this.updateProgress(100);
            return;
          }
          this.updateProgress(1);
        }
      });
    }

    componentWillUpdate(nextProps, nextState) {
      const { loadedRoutes, progress } = this.state;
      const { pathname } = nextProps.location;
      // 更新组件不加载进度条.
      if (loadedRoutes.indexOf(pathname) === -1 && progress !== -1 && nextState.progress < 100) {
        this.updateProgress(100);
        this.setState({
          loadedRoutes: loadedRoutes.concat([pathname]),
        });
      }
    }

    componentWillUnmount() {
      // Unset unsubscribeHistory since it won't be garbage-collected.
      this.unsubscribeHistory = null;
    }

    updateProgress(progress) {
      this.setState({ progress });
    }

    render() {
      return (
        <div>
          <ProgressBar percent={this.state.progress} updateProgress={this.updateProgress} />
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }
  return AppWithProgressBar;
}

export default withProgressBar;
