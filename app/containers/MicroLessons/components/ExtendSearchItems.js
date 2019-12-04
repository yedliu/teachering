import { ExtendWrapper } from '../style';
import React from 'react';
import { Search } from 'zm-tr-ace';
const SearchItem = Search.SearchItem;
import {  Checkbox  } from 'antd';
const CheckboxGroup = Checkbox.Group;
function extendSearchItems({ grades, editions, onChange, gradeIds, editionIds  }) {
  return (
    <div>
      <SearchItem config={{ label: '年级', width: '100%', labelWidth: 50, }}>
        <ExtendWrapper>
          <CheckboxGroup  options={grades} onChange={(checkedValue) => { onChange('gradeIds', checkedValue) }} value={gradeIds} />
        </ExtendWrapper>
      </SearchItem>
      <SearchItem config={{ label: '版本', width: '100%', labelWidth: 50, }}>
        <ExtendWrapper>
          <CheckboxGroup  options={editions} onChange={(checkedValue) => { onChange('editionIds', checkedValue) }} value={editionIds} />
        </ExtendWrapper>
      </SearchItem>
    </div>
  );
}

export default extendSearchItems;
