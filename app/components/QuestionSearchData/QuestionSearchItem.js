import React, { PropTypes } from 'react';
// import immutable from 'immutable';
import { Select } from 'antd';
import { toString, toNumber } from 'components/CommonFn';
import {
  Wrapper,
  TextValue,
} from './style';
// import getData from './server';
export const selectList = [{
  type: 'grade',
  name: '年级',
}, {
  type: 'year',
  name: '年份',
}, {
  type: 'subject',
  name: '学科',
}, {
  type: 'term',
  name: '学期',
}, {
  type: 'edition',
  name: '版本',
}, {
  type: 'province',
  name: '省',
}, {
  type: 'city',
  name: '市',
}, {
  type: 'county',
  name: '县',
}, {
  type: 'paperType',
  name: '试卷类型',
  minWidth: 78,
}, {
  type: 'examType',
  name: '卷型',
}, {
  type: 'difficulty',
  name: '难度',
}, {
  type: 'questionType',
  name: '题型',
}, {
  type: 'source',
  name: '题目来源',
  minWidth: 78,
}, {
  type: 'distinction',
  name: '区分度',
  minWidth: 60,
}, {
  type: 'comprehensiveDegree',
  name: '综合度',
  minWidth: 68,
}, {
  type: 'rating',
  name: '题目评级',
  minWidth: 78,
}, {
  type: 'scene',
  name: '使用场景',
  minWidth: 78,
}, {
  type: 'businessCard',
  name: '试卷名片',
  minWidth: 78,
}, {
  type: 'input',
  name: '关键字',
  minWidth: 68,
}, {
  type: 'search',
  name: '搜索',
}, {
  type: 'purpose',
  name: '用途'
}, {
  type: 'examPaperSource',
  name: '试卷来源',
  minWidth: 78,
}, {
  type: 'id',
  name: '试卷id',
}, {
  type: 'customizeBtnWidthSearch',
  name: '搜索伴生自定义'
}, {
  type: 'customizeBtn',
  name: '自定义',
}, {
  type: 'onlineFlag',
  name: '上架状态',
  minWidth: 78,
}, {
  type: 'evaluationTarget',
  name: '测评对象',
  minWidth: 78,
}, {
  type: 'evaluationPurpose',
  name: '测评用途',
  minWidth: 78,
}, {
  type: 'epBu',
  name: '适用BU',
  minWidth: 78,
}, {
  type: 'knowledgeType',
  name: '知识点类型',
  minWidth: 90,
}];

const Option = Select.Option;
// const fetchBack = {};
export const defaultItem = (type) => {
  let res = { id: -1, name: '全部' };
  return res;
};
// for (let i = 0; i < selectList.length; i += 1) {
//   fetchBack[selectList[i].type] = {
//     isFetching: false,
//     data: [defaultItem(selectList[i].type)],
//   };
// }


class QuestionSearchItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.selectSearchQuestionParams = this.selectSearchQuestionParams.bind(this);
    this.getDataList = this.getDataList.bind(this);
    this.state = {
      dataList: [defaultItem()],
      selectType: defaultItem(),
    };
  }
  componentDidMount() {
    // const { dataList = [], type, noFetch } = this.props;
    // if ((dataList && dataList.length > 0) || noFetch) {  // 检测 nofetch 是否未自定义传入数据
    //   setTimeout(() => {
    //     const backDataList = [defaultItem(type)];
    //     fetchBack[type].data = backDataList;
    //     this.setState({ dataList: backDataList.concat(dataList), selectType: defaultItem(type) });
    //   }, 20);
    // } else { // 没有传入 list，则组件自己获取
    //   if (fetchBack[type].data.length > 1 && fetchBack[type].isFetching) return;  // 已经缓存过或正在请求中的则不调用请求
    //   this.getDataList();
    // }
    // if (type === 'year') {
    //   console.log('componentDidMount');
    // }
  }
  /**
   * 发请求获取 dataList
   */
  getDataList() {
    // const { type, searchDate = {} } = this.props;
    // fetchBack[type].isFetching = true;
    // if (isFunc(getData[type])) {
    //   getData[type](searchDate).then((res) => {
    //     let backDataList = [defaultItem(type)];
    //     if (res.data && res.data.length > 0) {
    //       backDataList = backDataList.concat(res.data);
    //     }
    //     fetchBack[type].data = backDataList;
    //     this.setState({ dataList: backDataList, selectType: defaultItem(type) });
    //     fetchBack[type].isFetching = false;
    //   });
    // }
  }
  selectSearchQuestionParams(value, type, typeList) {
    const { changeSelect } = this.props;
    if (changeSelect) {
      const selected = { id: toNumber(value.key), name: value.label };
      changeSelect(selected, type);
      // this.props.changeSelect(selected, type, () => {
      //   this.setState({ selectType: selected });
      // });
    }
  }
  render() {
    // selectType.withoutAll 不需要增加全部选项
    const { selectType, type, dataList, deviSelect } = this.props;
    const selectItem = selectType || this.state.selectType;
    const typeItem = selectList.find((item) => item.type === type);
    let realDataList = dataList ? dataList.slice() : [];
    if (type === 'province') {
      realDataList = [{ id: 0, name: '全国' }].concat(realDataList);
    }

    realDataList = (selectType.withoutAll ? [] : [defaultItem(type)]).concat(realDataList);
    return (<Wrapper>
      <TextValue style={{ minWidth: typeItem.minWidth || '' }}>{deviSelect ? <span style={{ color: 'red' }}>*</span> : ''}<span>{typeItem.name}：</span></TextValue>
      <Select
        disabled={selectType.disabled}
        style={{ width: 120, marginRight: 10 }}
        labelInValue
        value={{ key: toString(selectItem.id) || '' }}
        onChange={(value) => this.selectSearchQuestionParams(value, type, `${type}List`)}
       >
        {realDataList.filter((item) => item).map(
          (item) =>
            <Option key={toString(item.id) || ''} value={toString(item.id)} disabled={selectType.disabledOptions && selectType.disabledOptions.includes(toString(item.id))}>{item.name}</Option>
        )}
      </Select>
    </Wrapper>);
  }
}

/* eslint-disable */
QuestionSearchItem.propTypes = {
  selectType: PropTypes.object,
  dataList: PropTypes.array,
  changeSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  // searchDate: PropTypes.object,
  // noFetch: PropTypes.bool,
  itemStyle: PropTypes.object,
  deviSelect: PropTypes.bool,
};

export default QuestionSearchItem;
