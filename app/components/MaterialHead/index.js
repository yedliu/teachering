/**
*
* MaterialHead
*
*/

import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Button, Input } from 'antd';
import styled from 'styled-components';

const ListWrapper = styled.ul `
  width: 100%;
  min-height: 10%;
  font-size:14px;
  color:"#333"
  border: 1px solid #ddd;
  padding: 10px 20px;
  li{
    border-bottom: 1px solid #ddd;
    padding-top: 8px;
    padding-bottom: 8px;
    &:last-child{
      border-bottom: 0;
    }
    div.item{
      display: inline-flex;
      margin-right: 15px;
      height: auto;
      line-height: 22px;
      flex-wrap: wrap;
    }
    div.label{
      display: table;
      margin-right: 10px;
      margin-left: 15px;
    }
    div.list{
       margin-left: 10px;
       margin-bottom: 1px;
      .listitem{
        float: left;
        line-height: 20px;
        height: auto;
        padding: 0 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-right: 8px;
        cursor: pointer;
        word-break: break-all;
        word-wrap: break-word;
        white-space: pre-wrap;
        &.hover:hover,&.active{
          color: #fff;
          background-color: #108ee9;
        }
      }
    }
  }
`;

const MaterialHead = (props) => {
  const headList = props.headList.toJS();
  const checkList = props.checkList.toJS();
  const valueList = [];
  const uploadPermission = props.uploadPermission;
  Object.keys(checkList).forEach((item) => {
    valueList.push(checkList[item].id);
  });
  return (
    <ListWrapper>
      {
        headList.map((value, idx) =>
         (<li key={idx}>
           {
                      value.map((value2, idx2) =>
                        (
                          <div className="item" style={value2.style} key={idx2}>
                            {value2.label && <div className="label">{value2.label}：</div>}
                            {
                            value2.list.map((value3, idx3) =>
                              (
                                <div className="list" key={idx3}>
                                  {value2.type === 'text' &&
                                  <div className={`listitem ${value2.hover ? 'hover' : ''} ${valueList.indexOf(value3.id || value3[value2.listKey]) >= 0 ? 'active' : ''}`} onClick={() => { value2.click && props[value2.click] && props[value2.click](value3, idx + 1, idx3); }}>{value3.name || value3[value2.listValue]}</div>}
                                  {value2.type === 'search' &&
                                  <div style={{ display: 'inline-flex' }}>
                                    <Input placeholder={value3.placeholder} value={value3.value} style={{ float: 'left', borderRadius: 0 }} onChange={(e) => { value2.change && props[value2.change] && props[value2.change](e.target.value); }} />
                                    <Button type="primary" style={{ borderRadius: 0 }} onClick={() => { value2.click && props[value2.click] && props[value2.click](); }}>搜索</Button>
                                  </div>}
                                  {uploadPermission && value2.type === 'button' &&
                                  <Button type="primary" style={{ borderRadius: 0 }} onClick={() => { value2.click && props[value2.click] && props[value2.click](); }}>{value3.name}</Button>}
                                </div>
                              )
                            )
                          }
                          </div>
                      )

                    )
                  }
         </li>)

              )
            }
    </ListWrapper>
  );
};

MaterialHead.propTypes = {
  headList: PropTypes.instanceOf(Immutable.List),
  checkList: PropTypes.instanceOf(Immutable.Map),
};

export default MaterialHead;
