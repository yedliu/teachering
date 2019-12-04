/**
 *
 * FlexBox
 *
 */

// import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const FlexBox = styled.div`
  display: flex;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlexRowCenter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const FlexRowCenterSpaceBetween = styled(FlexRowCenter)`
  justify-content: space-around;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexColumnCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FlexColSpaceBetween = styled(FlexColumn)`
  justify-content: space-between;
`;

export const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const FadeIn = css`
  animation: ${fadeIn} ${(props) => (props.delay ? props.delay + 's' : '.3s')} ${(props) => (props.fn ? props.fn : 'linear')};
`;

export const FadeOut = css`
  animation: ${fadeOut} ${(props) => (props.delay ? props.delay + 's' : '.3s')} ${(props) => (props.fn ? props.fn : 'linear')};
`;

export const DivShadow = css`
  box-shadow: ${(props) => (props.shadow ? props.shadow : '0px 2px 4px rgba(233, 236, 244, .5)')};
  border-radius: ${(props) => (props.radius ? props.radius : '6px')};
`;

export default FlexBox;
