/* eslint-disable complexity */
/**
*
* QuestionSearchData
*
*/

import React, { PropTypes } from 'react';
import { Button, Input, Icon } from 'antd';

import { FlexRowCenter } from 'components/FlexBox';
import QuestionSearchItem, { selectList } from './QuestionSearchItem';
import { onlineFlagTypes } from 'utils/immutableEnum';
import { filterCartoonForGroupPaper } from 'utils/templateMapper';
import Area from './area';
import getData from './server';

import {
  Wrapper,
  TextValue,
} from './style';

const selectTypeList = selectList.map((item) => item.type);
const defaultStyle = { flexWrap: 'wrap', width: 800 };
const specialTypeList = ['area', 'input', 'search', 'customizeBtnWidthSearch', 'customizeBtn', 'id'];

class QuestionSearchData extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeSelect = this.changeSelect.bind(this);
    this.getDataList = this.getDataList.bind(this);
    this.renderSpecial = this.renderSpecial.bind(this);
    this.renderSearchAbout = this.renderSearchAbout.bind(this);
    const selectType = props.selectType || {};
    // id、input 初始值改为从 props 中获取
    const id = selectType.id || '';
    const input = selectType.input || '';
    this.state = {
      id,
      input,
      onlineFlag: onlineFlagTypes.toJS()
    };
  }
  componentDidMount() {
    const { whoseShow = [] } = this.props;
    const list = whoseShow.filter((it) => selectTypeList.includes(it) && !specialTypeList.includes(it)) || [];
    this.getDataList(list);
  }
  // 解决动态加载不同的筛选条件
  componentWillReceiveProps(nextProps) {
    const { whoseShow } = this.props;
    // console.log(nextProps, 'nextProps');
    if (whoseShow !== nextProps.whoseShow) {
      this.getDataList(nextProps.whoseShow.filter((it) => !whoseShow.includes(it) && !specialTypeList.includes(it)) || []);
    }
  }

  /**
   * 初始化时遍历获取各项数据
   * @param {*} list 可以获取数据的单项筛选的类型列表
   */
  getDataList(list) {
    const { noFetch = {}, dataList = {}, searchDate = {}, backDataList, source } = this.props;
    list.forEach((it) => {
      const newState = {};
      if (noFetch[it]) {
        newState[it] = dataList[it];
        this.setState(newState);
      } else {
        if (it === 'onlineFlag') return;
        if (getData[it]) {
          getData[it](searchDate[it] || {}).then((res) => {
            if (it === 'questionType') {
              // 以下模块过滤听力题型
              const filterListenList = ['LargeClassHomeWork', 'QuestionSearch', 'QusSearchForLearningMaterialSystem', 'SchoolHomeWork', 'StandHomeWork', 'TestHomeWork'];
              if (filterListenList.includes(source) || /\/iframe\/question-picker/.test(location.pathname)) {
                newState[it] = filterCartoonForGroupPaper(res.data || []);
              } else {
                newState[it] = res.data;
              }
            } else {
              newState[it] = res.data;
            }
            this.setState(newState, () => {
              if (backDataList) backDataList(it, res.data);
            });
          });
        }
      }
    });
  }
  changeSelect(value, type) {
    const { changeSelect } = this.props;
    const newState = {};
    if (['id', 'input', 'search'].includes(type)) {
      newState[type] = value;
    }
    this.setState(newState, () => {
      if (changeSelect) changeSelect(value, type);
    });
    // cb();
  }
  // eslint-disable-next-line complexity
  renderSpecial(itemType, index) {
    const { searchStyle = {}, changeSelect, searchDate = {}, selectType = {}, deviSelect = [], whoseShow } = this.props;
    const { id = '', input = '' } = this.state;
    let res = '';
    switch (itemType) {
      case 'area':
        res = (<Area
          key={index}
          changeSelect={this.changeSelect}
          required={deviSelect.includes('area')}
          itemStyle={searchStyle.item || {}}
          searchDate={{ city: searchDate.city || {}, county: searchDate.county || {}}}
          selectType={{ province: selectType.province, city: selectType.city, county: selectType.county }}
        />);
        break;
      case 'input':
        res = (<Wrapper key={index}>
          <TextValue style={{ minWidth: 68 || '' }}>{deviSelect.includes('input') ? <span style={{ color: 'red' }}>*</span> : ''}<span>{searchDate.inputName || '关键字'}：</span></TextValue>
          <Input
            onKeyDown={(e) => {
              if (e.keyCode === 13) this.changeSelect('click', 'search');
            }}
            suffix={input.length > 0 ? (<Icon
              type="close-circle" onClick={(e) => {
                if (changeSelect) this.changeSelect('', 'input');
              }}
            />) : null}
            value={input}
            onChange={(e) => this.changeSelect(e.target.value, 'input')}
            placeholder={searchDate.placeholder || '请输入...'}
          />
        </Wrapper>);
        break;
      case 'id':
        res = (<Wrapper key={index}>
          <TextValue style={{ minWidth: 68 || '' }}>{deviSelect.includes('id') ? <span style={{ color: 'red' }}>*</span> : ''}<span>{searchDate.id || 'id'}：</span></TextValue>
          <Input
            type="number"
            suffix={id > 0 ? (<Icon
              type="close-circle" onClick={(e) => {
                if (changeSelect) this.changeSelect('', 'id');
              }}
            />) : null}
            value={id}
            onChange={(e) => this.changeSelect(e.target.value, 'id')}
            placeholder={searchDate.id || '题目id'}
          />
        </Wrapper>);
        break;
      case 'search':
        res = (<Wrapper key={index} style={{ justifyContent: 'center' }}>
          <Button type="primary" onClick={() => changeSelect('click', 'search')}>查询</Button>
          {whoseShow.includes('customizeBtnWidthSearch') ? <Button style={{ marginLeft: 10 }} type="primary" onClick={() => changeSelect('click', 'customizeBtnWidthSearch')}>{searchDate.customizeBtnWidthSearch || 'customize'}</Button> : ''}
        </Wrapper>);
        break;
      case 'customizeBtn':
        res = (<Wrapper key={index} style={{ justifyContent: 'center' }}>
          <Button type="primary" onClick={() => changeSelect('click', 'customizeBtn')}>{searchDate.customizeBtn || 'customizeBtn'}</Button>
        </Wrapper>);
        break;
      default:
        break;
    }
    return res;
  }
  renderSearchAbout() {
    const { whoseShow, changeSelect, searchDate, deviSelect = [] } = this.props;
    let res = '';
    if (whoseShow.includes('search') && whoseShow.includes('input')) {
      res = (<FlexRowCenter style={{ width: '100%', maxWidth: 500, minWidth: 200 }}>
        <Wrapper style={{ marginRight: 55 }}>
          <TextValue style={{ minWidth: 68 || '' }}>{deviSelect.includes('input') ? <span style={{ color: 'red' }}>*</span> : ''}<span>{searchDate.inputName || '关键字'}：</span></TextValue>
          <Input style={{ width: 'auto' }} onChange={(e) => this.changeSelect(e.target.value, 'input')} placeholder={searchDate.placeholder || '请输入...'}></Input>
        </Wrapper>
        <Button type="primary" onClick={() => {
          console.log('click查询');
          changeSelect('click', 'search');
        }}>查询</Button>
        {whoseShow.includes('customBtn') ? <Button type="primary" onClick={() => changeSelect('click', 'customBtn')}>{searchDate.customBtnText || 'customBtn'}</Button> : ''}
      </FlexRowCenter>);
    } else if (whoseShow.includes('search')) {
      res = <Button type="primary" onClick={() => changeSelect('click', 'search')}>查询</Button>;
    } else if (whoseShow.includes('input')) {
      res = (<Wrapper>
        <TextValue style={{ minWidth: 68 || '' }}>{deviSelect.includes('input') ? <span style={{ color: 'red' }}>*</span> : ''}<span>{searchDate.inputName || '关键字'}：</span></TextValue>
        <Input style={{ width: 'auto' }} onChange={(e) => this.changeSelect(e.target.value, 'input')} placeholder={searchDate.placeholder || '请输入...'}></Input>
      </Wrapper>);
    } else if (whoseShow.includes('customBtn')) {
      res = <Button type="primary" onClick={() => changeSelect('click', 'customBtn')}>{searchDate.customBtnText || 'customBtn'}</Button>;
    }
    return res;
  }
  render() {
    const { whoseShow = [], dataList = {}, searchStyle = {}, noFetch = {}, selectType = {}, deviSelect = [] } = this.props;
    const list = whoseShow.filter((it) => selectTypeList.includes(it) || it === 'area') || [];
    // console.log('题型', dataList);
    return (<FlexRowCenter style={Object.assign(defaultStyle, searchStyle.wrapper || {})}>
      {list.map((it, index) => {
        if (specialTypeList.includes(it)) {
          return this.renderSpecial(it, index);
        }
        return (<QuestionSearchItem
          key={index}
          type={it}
          changeSelect={this.changeSelect}
          dataList={noFetch[it] ? dataList[it] : this.state[it]} // 题型
          // searchDate={searchDate[it] || {}}
          selectType={selectType[it]}
          itemStyle={searchStyle.item || {}}
          deviSelect={deviSelect.includes(it)}
        // noFetch={noFetch[it]}
        ></QuestionSearchItem>);
      })}
      {this.props.children}
      {/* {this.renderSearchAbout()} */}
      {/* {whoseShow.includes('search') ? <Button type="primary" onClick={() => changeSelect('click', 'search')}>查询</Button> : ''} */}
    </FlexRowCenter>);
  }
}

/* eslint-disable */
QuestionSearchData.propTypes = {
  // whoseShow,searchDate,noFetch,dataList,selectType 都通过 key 来设置。
  whoseShow: PropTypes.array.isRequired,  // 当前显示哪些下拉框
  searchDate: PropTypes.object,  // 查询用的参数  searchData.inputName 和 searchData.placeholder 都是给搜索框用的
  searchStyle: PropTypes.object,  // 输入框的样式
  noFetch: PropTypes.object,  // 哪些是不需要请求数据，完全由外部传入
  dataList: PropTypes.object,  // 传入的数据列表，要想生效必须在 noFetch 中有传入对应的项
  selectType: PropTypes.object,  // 当前选中的项
  changeSelect: PropTypes.func.isRequired,  // 下拉框切换时的回调
  deviSelect: PropTypes.array,  // 必选的有哪些
  backDataList: PropTypes.func,  // 返回获取到的数据
  source: PropTypes.string,   // 引用位置
};

export default QuestionSearchData;
