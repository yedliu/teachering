import styled from 'styled-components';

import { ButtonStylesThree, ButtonStylesTwo, ButtonStylesOne, ButtonSmall, ButtonStyleDiable, ButtonBig, hoverWhite, hoverRed, hoverGrey } from './buttonStyles';

export const Two = styled.a`${ButtonStylesTwo + hoverRed}`;
export const Five = styled.a`${ButtonStylesTwo + ButtonSmall + hoverRed}`;
export const Three = styled.a`${ButtonStylesTwo + ButtonStylesThree}`;
export const Six = styled.a`${ButtonStylesTwo + ButtonStylesThree + ButtonSmall}`;
export const One = styled.a`${ButtonStylesTwo + ButtonStylesOne}`;
export const Four = styled.a`${ButtonStylesTwo + ButtonStylesOne + ButtonSmall + hoverWhite}`;
export const Seven = styled.a`${ButtonBig + ButtonStyleDiable}`;
export const Eight = styled.a`${ButtonBig + ButtonStyleDiable + ButtonSmall + hoverGrey}`;
export const OriginA = styled.a`
  color: #2385EE;
  transition: all ease .2s;
  font-size:14px;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    opacity: 0.7;
  }
`;
// export default A;
