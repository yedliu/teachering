/*
 * 首页
 */

import React from 'react';
import styled from 'styled-components';
import AppLocalStorage from 'utils/localStorage';
import { browserHistory } from 'react-router';
import { trModules } from 'lib/menu/contants';
import menuJson from 'lib/menu/menu.json';
import Item from './ItemModule';
import Header from './Header';
import { checkMenuJson } from '../../router/utils';

const routesObj = JSON.parse(JSON.stringify(menuJson));

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background:rgba(250,250,250);
  display: flex;
  flex-direction: column;
  .entry {
    flex: 1;
    display: flex;
    padding: 40px 90px 0 120px;
    flex-wrap: wrap;
    align-content: flex-start;
  }
`;

const Footer = styled.footer`
  height: 98px;
  background: #fff;
  line-height: 98px;
  text-align: center;
  color: #333;
`;

export default class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    const showModules = this.getModulesByUserPermissions(routesObj);
    this.state = { showModules };
  }

  componentDidMount() {
    this.getMenuConfig();
  }

  /**
   * @description 获取 menuConfig
   * @return {void}
   */
  getMenuConfig() {
    // 如果全局变量有就不会再次获取
    if (window.MenuConfig) {
      const showModules = this.getModulesByUserPermissions(window.MenuConfig);
      this.setState({ showModules });
      return;
    }

    fetch(`${location.origin}/zm-front-config/menu.json?${Number(new Date())}`)
      .then(res => {
        let contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        }
        throw new Error('本地环境无法获取到在线menu.json');
      })
      .then(data => {
        try {
          checkMenuJson(data); // 检查线上环境 menu.json 配置
        } catch (error) {
          console.log(error);
        }
        const showModules = this.getModulesByUserPermissions(data);
        this.setState({ showModules });
      });
  }

  /**
   * @description 获取当前用户有权限的模块
   * @param {object} menuJson menuConfig 数据
   * @return {array} 用户有权限的模块
   */
  getModulesByUserPermissions = (menuJson) => {
    const userPermissions = AppLocalStorage.getPermissions();
    /**
     * @description 查询用户是否有当前模块的权限
     * @param {array} module 每个 BU 中的模块
     * @return {bool}
     */
    const hasPermissions = (module) => {
      if (!Array.isArray(module)) return false;

      return module.some(item => {
        const permission = item.permission;
        if (typeof permission === 'string') {
          if (userPermissions.includes(permission)) return true;
        }
        if (Array.isArray(permission)) {
          for (let item of permission) {
            if (userPermissions.includes(item)) return true;
          }
        }
        // 继续寻找下级菜单
        return hasPermissions(item.sub);
      });
    };

    const modules = [];
    Object.keys(menuJson).forEach(key => {
      if (hasPermissions(menuJson[key])) {
        modules.push(key);
      }
    });
    return modules;
  }

  handleClick = (path) => {
    browserHistory.push(path);
  }

  render() {
    const { showModules } = this.state;
    const modules = trModules.filter(module => showModules.includes(module.key));
    return (
      <Wrapper>
        <Header />
        <ul className="entry">
          {modules.map(el => (
            <Item
              key={el.key}
              title={el.title}
              icon={el.icon}
              onClick={() => { this.handleClick(el.to) }}
            />
          ))}
        </ul>
        <Footer>
          Copyright 2014深圳掌门人教育咨询有限公司（粤ICP备14081481号）
        </Footer>
      </Wrapper>
    );
  }
}
