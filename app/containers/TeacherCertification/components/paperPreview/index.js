import React from 'react';
import { Modal, Button, Switch } from 'antd';
import styled from 'styled-components';
import { countScore, findLabel } from '../../TCPaperManagement/utils';
import PaperListItem from '../paperListItem';
const PaperInfo = styled.div`
  margin-bottom: 10px;
`;
const PaperName = styled.p`
font-size: 16px;
text-align: center;
`;
const BackBtn = styled(Button)`
position: absolute;
top: 10px;
right: 10px;
`;
const ActionP = styled.p`
display: flex;
justify-content: space-between;
`;

class PaperPreview extends React.Component {
  /**
   * 生成头部的试卷相关信息
   * @param data
   * @param dict
   * @returns {{scores: number, quoteCount: number, name: string, count: number, info: string}}
   */
  handleInfo =(data, dict) => {
    let res = {
      name: '',
      info: '',
      scores: 0,
      quoteCount: 0,
      count: 0
    };
    data.name && (res.name = data.name);
    data.quoteCount && (res.quoteCount = data.quoteCount);
    let scoreAndNum = countScore(data.examPaperContentOutpuDtoList);
    res.scores = scoreAndNum.score;
    res.count = scoreAndNum.num;
    let paperType = findLabel(dict, 'typeCode', data.typeCode);
    let phase = findLabel(dict, 'phaseCode', data.phaseCode);
    let subject = findLabel(dict, 'subjectCode', data.subjectCode);
    let year = findLabel(dict, 'yearCode', data.yearCode);
    res.info = [paperType, phase, subject, year].join('/');
    return res;
  }
  render() {
    const { data, dict, onShowAnalysis, onClose, onBatchShowAnalysis, headInfo, species, backText = '返回试卷列表' } = this.props;
    // 试卷内容
    const headerInfo = headInfo || this.handleInfo(data, dict);
    return (
      <Modal
        visible={true}
        title="试卷预览"
        footer={null}
        width={1100}
        closable={false}
      >
        <PaperName>
          <strong>{headerInfo.name}</strong>
        </PaperName>
        <PaperInfo>
          <p style={{ fontSize: 14, marginBottom: 20 }}>
            {headerInfo.info}
            &nbsp;&nbsp;&nbsp;&nbsp;
            题目：{headerInfo.count} &nbsp;&nbsp; 使用：{headerInfo.quoteCount}
          </p>
          <ActionP>
            <span>本试卷共计{headerInfo.count}题，共计{headerInfo.scores}分</span>
            <span>
              答案和解析：
              <Switch checkedChildren="显示" unCheckedChildren="隐藏" onChange={onBatchShowAnalysis}></Switch>
            </span>
          </ActionP>
        </PaperInfo>
        <BackBtn onClick={onClose}>{backText}</BackBtn>
        {
          data && data.examPaperContentOutpuDtoList ?
            data.examPaperContentOutpuDtoList.map((item, index) => {
              return  <PaperListItem
                key={item.name}
                index={index + 1}
                bigQuestionList={item}
                species={species}
                preview
                onShowAnalysis={onShowAnalysis}
              />;
            }) :
            null
        }
      </Modal>
    );
  }
}

export default PaperPreview;
