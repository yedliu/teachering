import React from 'react';
import Slider from './Slider';
import Header from './Header';
import Content from './Content';
import Search from './Search';
import QuestionBasket from './QuestionBasket';
import { Warpper, ContentWrapper, Main } from './style';

const QuestionPicker = ({
  moduleName,
  title,
  onClose,
  sliderTips,
  sliderSeleteData,
  sliderTreeData,
  sliderSeleteValue,
  selectChange,
  treeChange,
  treeSelectedKeys,
  searchConfig,
  onChange,
  onSearch,
  questionList,
  sortData,
  onSortChange,
  ChooseAllQuestion,
  onPageChange,
  total,
  pageSize = 20,
  pageIndex = 1,
  showAnswer,
  pushBasket,
  basket,
}) => {
  const basketIds = basket.map(el => el.id);
  return (
    <Warpper>
      <Header moduleName={moduleName} title={title} onClose={onClose} />
      <ContentWrapper>
        <Slider
          tips={sliderTips}
          selectData={sliderSeleteData}
          selectChange={selectChange}
          selectValue={sliderSeleteValue}
          treeData={sliderTreeData}
          selectedKeys={treeSelectedKeys}
          treeChange={treeChange}
        />
        <Main>
          <Search data={searchConfig} onChange={onChange} onSearch={onSearch} />
          <Content
            data={questionList}
            total={total}
            style={{ flex: 1, overflow: 'auto' }}
            showAnswer={showAnswer}
            pushBasket={pushBasket}
            basketIds={basketIds}
          />
        </Main>
        <QuestionBasket />
      </ContentWrapper>
    </Warpper>
  );
};

export default QuestionPicker;
