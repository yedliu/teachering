import React, { PropTypes, Children } from 'react';
import immutable from 'immutable';
import { toString, toNumber } from 'components/CommonFn';
import { isFunction } from 'util';
import getData from './server';
import { FlexRowCenter } from '../FlexBox';
import QuestionSearchItem, { defaultItem } from './QuestionSearchItem';

const fetchBack = {
  province: {
    isFetching: false,
    data: [],
  },
  city: {
    isFetching: false,
    data: [],
  },
  county: {
    isFetching: false,
    data: [],
  },
};

class Area extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.selectSearchQuestionParams = this.selectSearchQuestionParams.bind(this);
    this.getDataList = this.getDataList.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
    this.state = {
      province: { },
      city: { },
      county: { },
      provinceList: [],
      cityList: [],
      countyList: [],
    };
  }
  componentDidMount() {
    const { dataList = {}, noFetch, searchDate } = this.props;
    if ((dataList.province && dataList.province.length > 0) || noFetch) {
      setTimeout(() => {
        const backDataList = [defaultItem('province')];
        fetchBack.province.data = backDataList;
        this.setState({ provinceList: backDataList.concat(dataList), province: defaultItem('province') });
      }, 20);
    } else {
      if (fetchBack.province.data.length > 1 && fetchBack.province.isFetching) return;
      setTimeout(() => {
        this.getDataList('province', {});
      }, 0);
    }
    if (searchDate.city.provinceId > 0) {
      setTimeout(() => {
        this.getDataList('city', searchDate.city);
      }, 50);
    }
    if (searchDate.city.provinceId && searchDate.county.cityId > 0) {
      setTimeout(() => {
        this.getDataList('county', searchDate.county);
      }, 100);
    }
  }
  getDataList(type, searchDate) {
    // if (['city', 'county'].includes(type) && searchDate[type] <= 0) return;
    // console.log(type, searchDate, 'getDataList');
    if (Object.keys(searchDate).length > 0 && Object.keys(searchDate).some((key) => searchDate[key] <= 0)) return;
    fetchBack[type].isFetching = true;
    if (isFunction(getData[type])) {
      getData[type](searchDate).then((res) => {
        // console.log(res, 'res');
        let backDataList = [];
        if (res.data && res.data.length > 0) {
          backDataList = backDataList.concat(res.data);
          fetchBack[type].data = backDataList;
        }
        const newState = {};
        newState[`${type}List`] = backDataList;
        newState[type] = defaultItem(type);
        this.setState(newState);
        fetchBack[type].isFetching = false;
        // if (type === 'province') this.getDataList('city', { provinceId: backDataList[0].id });
      });
    }
  }
  selectSearchQuestionParams(selected, type, state) {
    this.props.changeSelect(selected, type, state);
  }
  changeSelect(selected, type) {
    // console.log(selected, type, 'changeSelect');
    const state = Object.assign({}, this.state);
    state[type] = selected;
    if (type === 'province') {
      state.city = { id: -1, name: '市' };
      state.cityList = [];
      state.county = { id: -1, name: '县' };
      state.countyList = [];
    } else if (type === 'city') {
      state.county = { id: -1, name: '区/县' };
      state.countyList = [];
    }
    this.setState(state, () => {
      // console.log(this.state);
      if (type === 'province') {
        this.getDataList('city', { provinceId: selected.id });
      } else if (type === 'city') {
        this.getDataList('county', { cityId: selected.id });
      }
      // this.selectSearchQuestionParams(selected, type, state);
      this.selectSearchQuestionParams(selected, type);
      // cb();
    });
  }
  render() {
    const selectType = this.props.selectType;
    const { required } = this.props;
    const { province, city, county, provinceList, cityList, countyList } = this.state;
    return (<FlexRowCenter>
      <QuestionSearchItem
        deviSelect={required}
        type="province"
        dataList={provinceList}
        changeSelect={this.changeSelect}
        selectType={selectType.province || province}
        noFetch
      ></QuestionSearchItem>
      <QuestionSearchItem
        type="city"
        dataList={cityList}
        changeSelect={this.changeSelect}
        selectType={selectType.city || city}
        searchDate={{ provinceId: province.id }}
        noFetch
      ></QuestionSearchItem>
      <QuestionSearchItem
        type="county"
        dataList={countyList}
        changeSelect={this.changeSelect}
        selectType={selectType.county || county}
        searchDate={{ cityId: city.id }}
        noFetch
      ></QuestionSearchItem>
    </FlexRowCenter>);
  }
}

Area.propTypes = {
  selectType: PropTypes.object,
  dataList: PropTypes.object,
  changeSelect: PropTypes.func.isRequired,
  // type: PropTypes.string.isRequired,
  searchDate: PropTypes.object,
  noFetch: PropTypes.bool,
};

export default Area;
