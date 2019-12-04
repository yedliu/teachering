import React from 'react';
import { mount } from 'enzyme';
import ModuleTitle from '../MouleTitle';

const _mount = props => mount(<ModuleTitle {...props} />);

describe('components', () => {
  describe('ModuleTitle', () => {
    const props = {
      children: <div className="module-title-children">ModuleTitle</div>,
      required: true,
      errorMessage: '这是错误信息',
      message: '这是 message',
    };

    const mountDom = _mount(props);
    it('测试 ModuleTitle 组件样式', () => {
      expect(mountDom.find('span').length).toBe(3);
      expect(mountDom.find('span').at(0).text()).toBe('*');
      expect(mountDom.find('span').at(2).text()).toBe('这是错误信息');
      expect(mountDom.find('.module-title-children').length).toBe(1);
    });
  });
});
