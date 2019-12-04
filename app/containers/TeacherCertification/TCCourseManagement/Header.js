import React from 'react';
import { Select, Button } from 'antd';

const Option = Select.Option;

const Header = ({
  modules,
  phases,
  moduleId,
  phaseId,
  onModuleChange: handleModuleChange,
  onPhaseChange: handlePhaseChange,
  onSearch: handleSearch,
}) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <span>模块：</span>
      <Select
        value={moduleId ? `${moduleId}` : void 0}
        style={{ width: 120, marginRight: 5 }}
        onChange={handleModuleChange}
      >
        {modules.map(el => (
          <Option key={el.id} value={`${el.id}`}>
            {el.name}
          </Option>
        ))}
      </Select>
      <span>学段：</span>
      <Select
        value={phaseId ? `${phaseId}` : void 0}
        onChange={handlePhaseChange}
        style={{ width: 120, marginRight: 5 }}
      >
        {phases.map(el => (
          <Option key={el.id} value={`${el.id}`}>
            {el.name}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={handleSearch} style={{ marginRight: 10 }}>
        查询
      </Button>
    </div>
  );
};

export default Header;
