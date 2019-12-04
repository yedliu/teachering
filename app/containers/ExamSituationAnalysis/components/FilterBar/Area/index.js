import React from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';
const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  background: #eee;
`;
const Province = styled.div`
  width: 100%;
   border-bottom: 1px dashed #999;
   margin-bottom: 10px;
`;
const City = styled.div`
  width:100%;
`;
const Btn = styled.div`
  padding: 3px 10px;
  margin: 0 20px 5px 20px;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 5px;
  background: ${props => { return props.active ? '#108ee9' : '' }};
  color: ${props => { return props.active ? '#fff' : '' }};
  cursor: pointer;
`;
class Area extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProvinceId: -1,
      currentCityId: -1
    };
  }
  selectItem=(type, value) => {
    const { selectProvince, selectCity } = this.props;
    if (value) {
      this.setState({ [type]: value.id });
      if (type === 'currentProvinceId') {
        selectProvince(value.id);
        this.setState({ currentCityId: -1 });
      } else if (type === 'currentCityId') {
        selectCity(value.id);
      }
    }
  }
  render() {
    const { province, city, onClear, data } = this.props;
    return (
      <Wrapper>
        <Province>
          {
            province ? province.map(item => {
              return <Btn key={item.id} active={data.province === item.id} onClick={() => { this.selectItem('currentProvinceId', item) }}>{item.name}</Btn>;
            }) : null
          }
        </Province>
        <City>
          {
            city ? city.map(item => {
              return <Btn key={item.id} active={data.city === item.id} onClick={() => { this.selectItem('currentCityId', item) }}>{item.name}</Btn>;
            }) : null
          }
        </City>
        <div style={{ textAlign: 'right' }}>
          <Icon type="close-circle-o" style={{ cursor: 'pointer' }} onClick={() => {
            this.setState({ 'currentProvinceId': -1, 'currentCityId': -1 });
            onClear();
          }}
            title="清空省市"
          />
        </div>
      </Wrapper>
    );
  }
}
export default Area;
