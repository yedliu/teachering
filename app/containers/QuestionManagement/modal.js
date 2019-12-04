import React from 'react';
import { Button, Modal } from 'antd';

import { FlexRowDiv } from 'components/Div';
import { CongratulateDiv } from './style';

const publishEnum = {
  publishSuccess: '恭喜，您的试卷已经成功保存至试卷库！',
  draftSuccess: '您的试卷已经保存至草稿箱！',
  publishFailed: '发布失败！',
  draftFailed: '保存失败！'
};

/* 发布试卷结果modal
** publishSuccess发布成功 publishFailed发布失败
** draftSuccess存草稿成功 draftFailed存草稿失败
*/
export const publishModal = (state, isDataExternal, successCb, editCb, backCb) => {
  return (<Modal
    visible
    footer={null}
    closable={false}
    style={{ minWidth: 1000, minHeight: 800 }}
  >
    <CongratulateDiv>
      {publishEnum[state]}
    </CongratulateDiv>
    <FlexRowDiv style={{ justifyContent: 'center', marginBottom: '100px' }}>
      {['publishSuccess', 'draftSuccess'].includes(state) ? <Button type="primary" size="large" onClick={successCb}>确认</Button> : ''}
      {['publishFailed', 'draftFailed'].includes(state) ?
        <div>
          <Button type="primary" size="large" style={{ margin: '0 15px' }} onClick={editCb}>重新编辑</Button>
          <Button type="primary" size="large" onClick={backCb}>{isDataExternal ? '返回试卷列表' : '回到主界面'}</Button>
        </div> : ''}
    </FlexRowDiv>
  </Modal>);
};
