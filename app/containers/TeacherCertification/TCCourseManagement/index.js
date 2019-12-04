import React from 'react';
import Header from './Header';
import ListView, { ListViewItem } from 'components/ListView/index';
import { message, Modal, Spin } from 'antd';
import * as server from './server';
import _ from 'lodash';



export default class TCCourseManagement extends React.Component {
  state = {
    modules: [], // 模块列表
    moduleId: void 0, // 选中的模块
    loading: false,
    stateList: [{ id: 0, name: '上架' }, { id: 1, name: '编辑中' }],
    updateId: '', // 需要更新的章节
    phaseList: [],
    phaseCode: void 0,
    levelOneList: [],
    levelTwoList: [],
    levelThreeList: [],
    isAdd: false,
    selectedLevelOne: {},
    selectedLevelTwo: {},
    selectedLevelThree: {},
    isEdit: false,
    currentItem: {}
  };
  componentDidMount() {
    this.findModuleList();
  }
  levels = ['levelOneList', 'levelTwoList', 'levelThreeList']
  selected = ['selectedLevelOne', 'selectedLevelTwo', 'selectedLevelThree']
  currentLevel=null
  currentIndex=-1
  timer=null
  // 模块发生变化
  handleModuleChange = moduleId => {
    this.setState({ moduleId }, () => {
      this.handleSearch();
    });
  };



  // 获取模块以及科目
  findModuleList = async () => {
    await server.findModuleList().then(modules => {
      if (modules.length > 0) {
        const moduleId = modules[0].id;
        this.setState(
          {
            modules,
            moduleId,
          }
        );
      }
    });
    await server.getHeaderFilter().then(res => {
      if (!res) return;
      let phaseList = res.phaseList;
      if (phaseList.length > 0) this.setState({ phaseList, phaseCode: phaseList[0].id });
    });
    const { moduleId, phaseCode } = this.state;
    this.getKnowledgeData({ moduleId, phaseCode, parentId: 0 }, 1);
  };

  // 学段
  handlePhaseChange = (data) => {
    this.setState({ phaseCode: data }, () => {
      this.handleSearch();
    });
  }
  // 获取知识点
  getKnowledgeData = async (params, level, noLoop) => {
    this.setState({ loading: true });
    await server.getKnowledgeList(params).then(res => {
      this.setState({ [this.levels[level - 1]]: res, loading: false });
      if (level === 3 || noLoop) {
        return;
      }
      if (!res[0]) {
        this.clearList(level);
        this.clearSelected(level); // 只能清下级
        return;
      }
      if (res[0].hasChild) {
        this.setState({ [this.selected[level - 1]]: res[0] });
        this.getKnowledgeData({ ...params, parentId: res[0].id }, level + 1);
      } else {
        this.clearList(level);
        this.clearSelected(level);
      }
    });
  }
  // 清空列表
  clearList =(level) => {
    this.setState({ [this.levels[level]]: [] });
    if (level < 3) {
      this.clearList(level + 1);
    }
  }
  // 新增
  handleAdd = (level) => {
    if (!this.canDo(true)) {
      return;
    }
    let parent = {};
    if (level > 1) {
      parent = this.state[this.selected[level - 2]];
    }
    if (level > 1 && !parent.id) {
      message.warning('请先选择父级知识点');
      return;
    }
    this.setState({ isAdd: true });
    this.currentLevel = level;
    let list = this.state[this.levels[level - 1]];
    const { moduleId, phaseCode } = this.state;
    let parentId = (level === 1 ? 0 : parent.id);
    list.push({ name: '', editable: true, moduleId, phaseCode, parentId  });
    this.setState({ [this.levels[level - 1]]: list });
  }
  // 搜索
  handleSearch=() => {
    const { moduleId, phaseCode } = this.state;
    this.setState({ isEdit: false, isAdd: false });
    this.getKnowledgeData({ moduleId, phaseCode, parentId: 0 }, 1);
  }
  // 保存
  saveItem= (index, target, level) => {
    let item = this.state[target][index];
    if (item.name.trim() === '') {
      message.warning('名称不能为空', 0.5);
      return;
    }
    let parent = {};
    if (level > 1) {
      parent = this.state[this.selected[level - 2]];
    }
    let parentId = (level === 1 ? 0 : parent.id);
    this.setState({ loading: true });
    if (this.state.isAdd) {
      server.addKnowledge({
        moduleId: item.moduleId,
        phaseCode: item.phaseCode,
        name: item.name.trim(),
        parentId: item.parentId,
        state: 1
      }).then(async res => {
        this.setState({ loading: false });
        if (res) {
          if (level > 1) {
            let parentKey = this.levels[level - 2];
            let parentList = this.state[parentKey];
            parentList = parentList.map(item => {
              if (item.id === parentId) {
                item.hasChild = true;
                return item;
              } else {
                return item;
              }
            });
            this.setState({ parentKey: parentList });
          }
          await this.getKnowledgeData({ moduleId: item.moduleId, phaseCode: item.phaseCode, parentId }, level, true);
          this.setState({ isAdd: false });
        }
      });
    } else if (this.state.isEdit) {
      server.editKnowledge({
        id: item.id,
        name: item.name.trim(),
      }).then(async res => {
        this.setState({ loading: false });
        if (res) {
          await this.getKnowledgeData({ moduleId: item.moduleId, phaseCode: item.phaseCode, parentId }, level, true);
          this.setState({ isEdit: false });
        }
      });
    }
  }
  // 取消
  cancelItem=(index, target, level) => {
    let list = this.state[target];
    if (this.state.isAdd) {
      list.splice(index, 1);
    } else if (this.state.isEdit) {
      list[index].editable = false;
      list[index].name = this.state.currentItem.name;
    }
    this.setState({ [target]: list, isEdit: false, isAdd: false, currentItem: {}});
  }
  // input onchange
  handleItemChange=(index, e, target) => {
    let str = e.target.value;
    if (str.length > 50) {
      if (!this.showMessage) {
        this.showMessage = true;
        message.warning('最多50字', 1, () => {
          this.showMessage = false;
        });
      }
      return;
    }
    let list = this.state[target];
    list[index].name = str;
    this.setState({ [target]: list });
  }
  // 鼠标移入移出
  handleMouseOver=(index, target, level, type) => {
    if (!this.canDo(false)) return;
    let list = _.cloneDeep(this.state[target]);
    list = list.map(item => {
      item.showToolBar = false;
      return item;
    });
    if (!list[index]) return;
    list[index].showToolBar = (type === 1 ? true : false);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ [target]: list });
    }, 50);
  }
  // 编辑
  handleEdit=(index, target, level) => {
    if (!this.canDo(true)) return;
    let list = this.state[target];
    list[index].editable = true;
    list[index].showToolBar = false;
    this.setState({ [target]: list, isEdit: true, currentItem: { ...list[index] }});
  }
  // 删除
  handleDelete=(index, target, level) => {
    if (!this.canDo(true)) return;
    let item = this.state[target][index];
    Modal.confirm({
      title: '',
      content: `是否确认删除该知识点`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        server.delKnowledge({ id: item.id }).then(res => {
          if (res) {
            message.success(`删除${item.name}成功`);
            let list = this.state[target];
            list.splice(index, 1);
            this.setState({ [target]: list });
            this.clearList(level);
            this.clearSelected(level);
          }
        });
      }
    });
  }
  // 点击
  handleClick = (index, target, level) => {
    if (!this.canDo(false)) {
      return;
    }
    let item = this.state[target][index];
    if (!item) return;
    this.setState({ [this.selected[level - 1]]: item });
    if (!item.hasChild) {
      this.clearList(level);
      this.clearSelected(level + 1);
    } else {
      this.getKnowledgeData({ moduleId: item.moduleId, phaseCode: item.phaseCode, parentId: item.id }, level + 1);
    }

  }
  // 拖拽开始
  onDragStart=(index, target, level, e) => {
    if (!this.canDo()) return;
    e.stopPropagation();
    e.dataTransfer.setData('text', JSON.stringify({ level, index }));
  }
  // 松开
  onDrop=(index, target, level, e) => {
    if (!this.canDo(false)) {
      return;
    }
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text'));
    if (level !== data.level) {
      console.log('不同层级不能换位置');
      return;
    }
    let list = this.state[target];
    let temp = list[index];
    list[index] = list[data.index];
    list[data.index] = temp;
    let idList = list.map(item => item.id);
    server.sortKnowledge({ idList }).then(() => {
      this.setState({ [target]: list });
    });
  }
  // 拖拽结束
  onDragOver=(index, target, level, e) => {
    if (!this.canDo(false)) {
      return;
    }
    e.preventDefault();
  }
  // 判断是否可操作
  canDo=(show) => {
    if (this.state.isAdd || this.state.isEdit) {
      if (show && !this.showActionMessage) {
        this.showActionMessage = true;
        this.showActionMessage && message.warning('请完成之前的操作', 1, () => {
          this.showActionMessage = false;
        });
      }
      return false;
    } else {
      return true;
    }
  }
  // 清已选
  clearSelected=(level) => {
    this.setState({ [this.selected[level - 1]]: {}});
    if (level < 3) {
      this.clearSelected(level + 1);
    }
  }
  // 知识点
  renderKnowledge = (list, target, level) => {
    return list.map((item, index) => {
      let style = { borderBottom: '1px solid #F0F0F0' };
      if (this.state[this.selected[level - 1]].id === item.id) {
        style.backgroundColor = 'rgb(245, 247, 249)';
      }
      return <ListViewItem
        style={style}
        key={index}
        name={item.name}
        editable={item.editable}
        save={() => { this.saveItem(index, target, level) }}
        cancel={() => { this.cancelItem(index, target, level) }}
        onChange={(e) => { this.handleItemChange(index, e, target) }}
        onClick={() => { this.handleClick(index, target, level) }}
        toolBarVisible={item.showToolBar}
        onMouseOver={() => { this.handleMouseOver(index, target, level, 1) }}
        onMouseLeave={() => { this.handleMouseOver(index, target, level) }}
        goToUpdate={(e) => {
          e.stopPropagation();
          this.handleEdit(index, target, level);
        }}
        goToDelete={() => { this.handleDelete(index, target, level) }}
        draggable={!this.state.isEdit && !this.state.isAdd}
        noPopconfirm
        onDragStart={e => this.onDragStart(index, target, level, e)}
        onDrop={e => this.onDrop(index, target, level, e)}
        onDragOver={e => this.onDragOver(index, target, level, e)}
      />;
    });
  };
  render() {
    const {
      modules,
      moduleId,
      phaseList,
      phaseCode,
      levelOneList,
      levelTwoList,
      levelThreeList,
      loading
    } = this.state;
    return (
      <div style={{ background: '#fff', padding: 20 }}>
        <Header
          modules={modules}
          moduleId={moduleId}
          onModuleChange={this.handleModuleChange}
          onSearch={this.handleSearch}
          phases={phaseList}
          phaseId={phaseCode}
          onPhaseChange={this.handlePhaseChange}
        />
        <Spin spinning={loading}>
          <ListView
            title="1级知识点"
            onFooterBtnClick={() => { this.handleAdd(1) }}
          >
            {
              this.renderKnowledge(levelOneList, 'levelOneList', 1)
            }
          </ListView>
          <ListView
            title="2级知识点"
            onFooterBtnClick={() => { this.handleAdd(2) }}
          >
            {
              this.renderKnowledge(levelTwoList, 'levelTwoList', 2)
            }
          </ListView>
          <ListView
            title="3级知识点"
            onFooterBtnClick={() => { this.handleAdd(3) }}
          >
            {
              this.renderKnowledge(levelThreeList, 'levelThreeList', 3)
            }
          </ListView>
        </Spin>
      </div>
    );
  }
}
