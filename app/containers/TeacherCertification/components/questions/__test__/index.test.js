import React from 'react';
import { mount } from 'enzyme';
import Question from '../index';

// const _shallow = props => shallow(<Question {...props} />);
const _mount = props => mount(<Question {...props} />);

describe('components', () => {
  describe('Index', () => {
    const props = { questionType: 0 };

    const mountDom = _mount(props);
    it('测试 Index 组件默认展示的模块', () => {
      expect(mountDom.find('QuestionTitle').length).toBe(1);
      expect(mountDom.find('Options').length).toBe(1);
      expect(mountDom.find('Answer').length).toBe(1);
      expect(mountDom.find('Analysis').length).toBe(1);
    });
    it('测试 Index 组件辨析题展示的模块', () => {
      mountDom.setState({ questionType: 2 });
      expect(mountDom.find('QuestionTitle').length).toBe(1);
      expect(mountDom.find('ReferenceAnswer').length).toBe(1);
      expect(mountDom.find('Analysis').length).toBe(0);
    });
  });
});
