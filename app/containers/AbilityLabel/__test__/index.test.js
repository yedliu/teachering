import React from 'react';
import Table from '../Components/table';
import { mount  } from 'enzyme';
const setup = () => {
  const wrapper = mount(<Table></Table>);
  return {
    wrapper
  };
};


describe('Table', () => {
  const { wrapper } = setup();
  it('Table Component should be render', () => {
    expect(wrapper.find('Table').exists());
  });
});

