import React from 'react';
import { Spin } from 'antd';

import { SubmitLoading } from './style';

export const MaskLoading = ({ text }) => <SubmitLoading><Spin size="large" tip={text} /></SubmitLoading>;
