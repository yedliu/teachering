/**
*
* Div
*
*/

import styled, { keyframes, css } from 'styled-components';
// import styled from 'styled-components';

export const fadeIn = keyframes`
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
`;

const Div = styled.div`
   background-color:white;
`;


export const FadeInDiv = styled(Div)`
   animation: ${fadeIn} .3s linear;
`;

// import styled from 'styled-components';


export const FlexRowDiv = styled.div`
  display:flex;
  flex-direction: row;
`;

export const FlexColumnDiv = styled.div`
   display:flex;
   flex-direction: column;
`;

export const DivShadow = css`
    box-shadow:  0px 2px 4px rgba(233, 236, 244, .5);  
    border-radius: 6px;
`;
export const DialogLargeDiv = styled(FlexColumnDiv)`
  width:800px;
  height:610px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  box-shadow: 0 8px 24px 0 rgba(0,0,0,0.20);
  border-radius: 6px;
`;
export default Div;
