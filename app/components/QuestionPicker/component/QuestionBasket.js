import React from 'react';
import { Icon } from 'antd';
import { BusketWrapper, BusketContent, BusketTitle } from './style';

class Busket extends React.Component {
  state = {
    visible: null,
  };

  toggleVisible = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  getData = data => {
    const newData = {};
    data.forEach(el => {
      if (newData[el.typeId]) {
        newData[el.typeId].count += 1;
      } else {
        newData[el.typeId] = {
          name: el.questionType,
          count: 1,
          typeId: el.typeId,
        };
      }
    });
    return Object.values(newData);
  };

  render() {
    const { data = [], clearQuestionByTypeId, handleClickFooter, disabled } = this.props;
    const { visible } = this.state;
    const newData = this.getData(data);
    return (
      <BusketWrapper>
        <div
          className={`base ${visible == null ? '' : visible ? 'show' : 'hide'}`}
        >
          <BusketTitle onClick={this.toggleVisible}>
            <p>试题篮</p>
            <span>{data.length}</span>
            <Icon type={visible ? 'double-right' : 'double-left'} />
          </BusketTitle>
          <BusketContent>
            <div className="busket-question-count">
              {newData.map((el, index) => (
                <div className="question-count-item" key={index}>
                  <span>{el.name}</span>
                  <span>{el.count}</span>
                  <a
                    href="#"
                    onClick={() => { clearQuestionByTypeId(el.typeId) }}
                  >
                    清除
                  </a>
                </div>
              ))}
            </div>
            <button
              disabled={disabled}
              className="busket-content-footer"
              style={{ color: `${disabled ? '#999' : '#108ee9'}` }}
              onClick={handleClickFooter}
            >
              前往编辑试卷信息
            </button>
          </BusketContent>
        </div>
      </BusketWrapper>
    );
  }
}

export default Busket;
