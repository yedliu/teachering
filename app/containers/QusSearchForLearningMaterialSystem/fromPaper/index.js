import React from 'react';
import * as styles from './indexStyle';
import SelectList from './selectList';
import PaperList from './paperList';
const {
  RootWrapper,
} = styles;

class QueryPaper extends React.Component {
  componentDidMount() {
    const { getData } = this.props;
    if (getData) getData();
  }
  selectChange = (type, value) => {
    const { selectChange } = this.props;
    if (selectChange) selectChange('paper', type, value);
  }
  render() {
    const { formData, formDataParams } = this.props;
    return (
      <RootWrapper>
        <SelectList
          listData={formData}
          paramsData={formDataParams}
          selectedData={formDataParams}
          selectChange={this.selectChange}
        />
        <PaperList
          listData={formData}
          paramsData={formDataParams}
          selectChange={this.selectChange}
        />
      </RootWrapper>
    );
  }
}

export default QueryPaper;