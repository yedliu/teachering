import React, { Component } from 'react';
import SearchBar from '../components/search';
import PaperTable from '../components/paperTable';
import PaperPreview from '../components/paperPreview';
import PaperDetail from '../components/paperDetail';
import { typeOf } from 'components/CommonFn';
import _ from 'lodash';
import { message, Spin } from 'antd';
import { getSubjects, queryDict, getPaperList, getPaperDetail, onOffFlag, deletePaper, editPaper, addPaper } from './server';
export default class TCPaperManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreview: false, // 显示预览
      showPaperDetail: false, // 显示试卷详情
      itemsList: [
        { data: [], key: 'typeCode', label: '试卷类型' },
        { data: [], key: 'phaseCode', label: '学段' },
        { data: [], key: 'subjectCode', label: '科目' },
        { data: [], key: 'yearCode', label: '年份' },
        { data: [], key: 'onlineFlag', label: '状态' },
      ], // 表单数据
      searchParams: {
        pageIndex: 1,
        pageSize: 10,
      }, // 搜索条件
      paperList: {}, // 试卷列表
      currentPaperDetail: {}, // 当前试卷详情
      isEdit: true, // 是否编辑试卷
      questionTypes: [], // 题目类型数据
      loading: false // 菊花
    };
  }
  componentDidMount() {
    this.init();
  }

  /**
   * 按条件搜索试卷列表
   * @param params
   */
  search = (params = {}) => {
    let searchParams = this.state.searchParams;
    searchParams = Object.assign(searchParams, params);
    console.log(searchParams);
    this.setState({ searchParams }, () => {
      this.handleGetPaperList(searchParams);
    });
  };
  /**
   * 初始化，调个数据字典，调个列表数据
   */
  init = () => {
    const { searchParams } = this.state;
    // 获取筛选数据
    getSubjects().then(res => {
      console.log(res);
      if (res) {
        let subjects = res.map(item => {
          return item.columns;
        });
        subjects = subjects.flat();
        subjects.forEach(item => {
          item.itemCode = String(item.id);
          item.itemName = String(item.name);
        });
        this.setItemList('subjectCode', subjects);
      }
    });
    queryDict().then(res => {
      if (res) {
        for (let key in res) {
          if (key === 'QB_ONLINE_FLAG') {
            this.setItemList('onlineFlag', res[key]);
          } if (key === 'TS_QUESTION_TYPE') {
            this.setState({ questionTypes: res[key] });
          } else {
            let arr = key.split('_');
            let last = arr[arr.length - 1].toLowerCase();
            let targetKey = last + 'Code';
            this.setItemList(targetKey, res[key]);
          }
        }
      }
    });
    // 获取列表
    this.handleGetPaperList(searchParams);
  };
  /**
   * 根据搜索条件获取试卷列表并展示loading
   * @param searchParams
   */
  handleGetPaperList = (searchParams) => {
    this.setState({ loading: true });
    getPaperList(searchParams).then(res => {
      console.log(res);
      this.setState({ loading: false });
      if (res) {
        if (res.list.length === 0 && res.pageNum > 1) {
          this.handlePage({ current: res.pageNum - 1 });
        } else {
          this.setState({ paperList: res });
        }
      }
    });
  }
  /**
   * 设置itemList字段的方法
   * @param key
   * @param data
   */
  setItemList = (key, data = []) => {
    if (!key) {
      return;
    }
    let itemsList = this.state.itemsList;
    itemsList.forEach(item => {
      if (item.key === key) {
        item.data = data;
      }
    });
    this.setState({ itemsList });
  };
  /**
   * 根据id获取试卷详情并展示
   * @param id
   */
  editOnePaper = (id) => {
    getPaperDetail(id).then(res => {
      // console.log(JSON.stringify(res), typeOf(res));
      if (res && typeOf(res) === 'Object') {
        this.setState({ showPaperDetail: true, isEdit: true, currentPaperDetail: res });
      } else {
        message.warning('数据不存在');
      }
    });
  }
  /**
   * 这里模拟点击一下返回列表按钮
   */
  handleBackToList=() => {
    document.querySelector('.paperDetailSubmit').click();
  }
  /**
   * 处理上下架试卷
   * @param item
   */
  handleOnOff = (item) => {
    onOffFlag({ examPaperId: item.id }, item.onlineFlag).then(res => {
      if (res) {
        this.search();
      }
    });
  }
  /**
   * 处理删除试卷
   * @param id
   */
  handleDelete=(id) => {
    deletePaper(id).then((res) => {
      if (res === '0') {
        this.search();
      }
    });
  }
  /**
   * 处理翻页
   * @param page
   */
  handlePage=(page) => {
    let searchParams = {
      pageIndex: page.current,
    };
    this.search(searchParams);
  }
  /**
   * 点击增加试卷
   */
  add=() => {
    this.setState({ showPaperDetail: true, isEdit: false, currentPaperDetail: {}});
  }
  /**
   * 预览试卷
   * @param id
   */
  handlePreview=(id) => {
    getPaperDetail(id).then(res => {
      if (res && typeOf(res) === 'Object') {
        this.setState({ showPreview: true, currentPaperDetail: res  });
      } else {
        message.warning('数据不存在');
      }
    });
  }
  /**
   * 试卷详情里删除题目
   * @param id
   */
  handleDelSmall=(id) => {
    console.log(id);
    let currentPaperDetail = this.state.currentPaperDetail;
    currentPaperDetail.examPaperContentOutpuDtoList.forEach(item => {
      item.examPaperContentQuestionList.forEach((small, index) => {
        if (small.questionId === id) {
          item.examPaperContentQuestionList.splice(index, 1);
        }
      });
    });
    this.setState({ currentPaperDetail });
  }
  /**
   * 试卷详情里上移下移题目
   * @param id
   * @param type
   * @param bigId
   */
  handleOrderSmall=(id, type, bigId, bigIndex) => {
    let currentPaperDetail = _.cloneDeep(this.state.currentPaperDetail);
    let bigList = currentPaperDetail.examPaperContentOutpuDtoList;
    let smallList = [];
    if (bigId) {
      smallList = bigList.find(item => item.id === bigId).examPaperContentQuestionList;
    } else {
      smallList = bigList[bigIndex].examPaperContentQuestionList;
    }
    for (let i = 0; i < smallList.length; i++) {
      if (smallList[i].questionId === id) {
        if (type === 'up') {
          if (i > 0) {
            let temp = smallList[i];
            smallList[i] = smallList[i - 1];
            smallList[i - 1] = temp;
          } else {
            message.warning('已经第一位了');
          }
        }
        if (type === 'down') {
          if (i < smallList.length - 1) {
            let temp =  smallList[i];
            smallList[i] = smallList[i + 1];
            smallList[i + 1] = temp;
          } else {
            message.warning('已经最后一位了');
          }
        }
        break;
      }
    }
    this.setState({ currentPaperDetail });
  }
  /**
   * 试卷详情和预览里单个题目显示答案和解析
   * @param id
   * @param status
   */
  handleShowAnalysis=(id, status) => {
    console.log(id, status);
    let currentPaperDetail = this.state.currentPaperDetail;
    currentPaperDetail.examPaperContentOutpuDtoList.forEach(item => {
      item.examPaperContentQuestionList.forEach(small => {
        if (small.questionId === id) {
          small.showAnalysis = status;
        }
      });
    });
    this.setState({ currentPaperDetail });
  }
  /**
   * 关闭试卷预览
   */
  handleClosePreview=() => {
    this.setState({ showPreview: false });
  }
  /**
   * 展示所有题目的答案和解析
   * @param status
   */
  batchShowAnalysis=(status) => {
    let currentPaperDetail = this.state.currentPaperDetail;
    currentPaperDetail.examPaperContentOutpuDtoList.forEach(item => {
      item.examPaperContentQuestionList.forEach(small => {
        small.showAnalysis = status;
      });
    });
    this.setState({ currentPaperDetail });
  }
  /**
   * 试卷详情里删除大题
   * @param id,i
   */
  handleDeleteBig=(id, i) => {
    let currentPaperDetail = this.state.currentPaperDetail;
    if (id) {
      currentPaperDetail.examPaperContentOutpuDtoList.forEach((item, index) => {
        if (item.id === id) {
          currentPaperDetail.examPaperContentOutpuDtoList.splice(index, 1);
        }
      });
    } else {
      currentPaperDetail.examPaperContentOutpuDtoList.splice(i, 1);
    }
    this.setState({ currentPaperDetail });
  }
  /**
   * 试卷详情里设置分数
   * @param target 设置的对象
   * @param isBatch 是否批量设置
   * @param targetScore 设置的分数
   */
  handleSetScore=(target, isBatch, targetScore, i) => {
    console.log(i);
    let currentPaperDetail = this.state.currentPaperDetail;
    if (isBatch) {
      // 批量设置分数
      currentPaperDetail.examPaperContentOutpuDtoList.forEach((item, index) => {
        if (item.id === target && this.state.isEdit) {
          item.examPaperContentQuestionList.forEach(small => {
            small.score = targetScore;
          });
        } else {
          // debugger
          if (i === index) {
            item.examPaperContentQuestionList.forEach(small => {
              small.score = targetScore;
            });
          }
        }
      });
    } else {
      // 设置小题分数
      currentPaperDetail.examPaperContentOutpuDtoList.forEach(item => {
        item.examPaperContentQuestionList.forEach(small => {
          if (small.questionId === target) {
            small.score = targetScore;
          }
        });
      });
    }
    this.setState({ currentPaperDetail });
  }
  /**
   * 保存提交（包括新增和编辑）
   * @param values
   */
  handleSubmit=(values) => {
    console.log(values);
    let params = _.cloneDeep(values);
    let noZeroFlag = true;
    let noEmptyBigFlag = true;
    // 清洗数据
    let questionList = _.cloneDeep(this.state.currentPaperDetail).examPaperContentOutpuDtoList;
    if (!questionList) {
      message.warning('还没有题目');
      return;
    }
    questionList.forEach((item, index) => {
      item.serialNumber = index + 1;
      if (!item.examPaperContentQuestionList || item.examPaperContentQuestionList.length === 0) {
        noEmptyBigFlag = false;
      }
      item.examPaperContentQuestionList.forEach((small, i) => {
        delete small.showAnalysis;
        small.serialNumber = i;
        if (small.score <= 0) {
          noZeroFlag = false;
        }
      });
    });
    params.examPaperContentOutpuDtoList = questionList;
    // 检查有没有分数是0的题目
    if (!noZeroFlag) {
      message.warning('不能有为0分的题目');
      return;
    }
    // 检查空大题
    if (!noEmptyBigFlag) {
      message.warning('不能有空着的大题');
      return;
    }
    // 提交
    if (this.state.isEdit) {
      params.id = this.state.currentPaperDetail.id;
      editPaper(params).then(res => {
        // 保存成功关闭弹框返回试卷列表刷新试卷列表
        this.submitCb(res);
      });
    } else {
      addPaper(params).then(res => {
        this.submitCb(res);
      });
    }
  }
  /**
   * 保存提交的回调
   * @param code
   */
  submitCb=(code) => {
    if (code === '0') {
      this.setState({ showPaperDetail: false });
      this.search();
    }
  }
  /**
   * 试卷详情页的新增题目
   * @param smallQuestion
   */
  handleAddQuestion=(smallQuestion) => {
    const { currentPaperDetail, questionTypes } = this.state;
    if (!smallQuestion) {
      return;
    }
    let name = questionTypes.find(item => item.itemCode === String(smallQuestion.questionOutputDto.typeId)).itemName;
    if (currentPaperDetail.examPaperContentOutpuDtoList) {
      // 已有题目的情况
      let flag = false;
      currentPaperDetail.examPaperContentOutpuDtoList.forEach(item => {
        if (item.name === name) {
          flag = true;
          item.examPaperContentQuestionList.push(smallQuestion);
        }
      });
      if (!flag) {
        currentPaperDetail.examPaperContentOutpuDtoList.push({
          name,
          examPaperContentQuestionList: [smallQuestion]
        });
      }
      this.setState({ currentPaperDetail });
    } else {
      // 新增一题没有的情况
      let target = {
        examPaperContentOutpuDtoList: [{
          name,
          examPaperContentQuestionList: []
        }]
      };
      target.examPaperContentOutpuDtoList[0].examPaperContentQuestionList.push(smallQuestion);
      this.setState({ currentPaperDetail: target });
    }
  }
  /**
   * 编辑题目
   * @param question 题目数据
   * @param indexes 索引数据
   */
  handleEditSmall=(question, indexes) => {
    // currentPaperDetail:试卷详情
    // examPaperContentOutpuDtoList：大题列表
    // examPaperContentQuestionList: 小题列表
    let currentPaperDetail = this.state.currentPaperDetail;
    currentPaperDetail.examPaperContentOutpuDtoList[indexes.bigIndex].examPaperContentQuestionList[indexes.smallIndex] = question;
    this.setState({ currentPaperDetail });
  }
  render() {
    const { showPreview, showPaperDetail, itemsList, paperList, searchParams, isEdit, currentPaperDetail, questionTypes, loading } = this.state;
    const pagination = {
      pageSize: 10,
      current: searchParams.pageIndex,
      total: paperList.total,
    };
    return (
      <div style={{ position: 'relative', background: '#fff', padding: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <SearchBar itemsData={itemsList} onSearch={this.search} onAdd={this.add} />
        <p>
          <span>
            共有符合要求的试卷 <strong>{paperList.total || 0}</strong> 份
          </span>
        </p>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Spin spinning={loading} size="large">
            <PaperTable
              pagination={pagination}
              data={paperList.list || []}
              dict={itemsList}
              onEdit={this.editOnePaper}
              onHandleOnOff={this.handleOnOff}
              onDelete={this.handleDelete}
              onPage={this.handlePage}
              onPreview={this.handlePreview}
            />
          </Spin>
        </div>
        {showPreview ?
          <PaperPreview
            data={currentPaperDetail}
            dict={itemsList}
            onShowAnalysis={this.handleShowAnalysis}
            onClose={this.handleClosePreview}
            onBatchShowAnalysis={this.batchShowAnalysis}
          /> :
          null}
        {showPaperDetail ?
          <PaperDetail
            onBack={this.handleBackToList}
            data={currentPaperDetail}
            edit={isEdit}
            formData={itemsList}
            questionTypes={questionTypes}
            onDel={this.handleDelSmall}
            onOrder={this.handleOrderSmall}
            onShowAnalysis={this.handleShowAnalysis}
            onBatchShowAnalysis={this.batchShowAnalysis}
            onDeleteBig={this.handleDeleteBig}
            onSetScore={this.handleSetScore}
            onSubmit={this.handleSubmit}
            onAddSmall={this.handleAddQuestion}
            onEditSmall={this.handleEditSmall}
            onDirectBack={() => { this.setState({ showPaperDetail: false }) }}
          /> :
          null}
      </div>
    );
  }
}
