/**
 *
 * Button.react.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { PropTypes, Children } from 'react';

import { Two, Three, One, Four, Five, Six, Seven, Eight } from './A';

import Wrapper from './Wrapper';

function Button(props) {
  // Render an anchor tag
  let MyButtonCss;
  switch (props.showtype) {
    case 1:
      MyButtonCss = One;
      break;
    case 2:
      MyButtonCss = Two;
      break;
    case 3:
      MyButtonCss = Three;
      break;
    case 4:
      MyButtonCss = Four;
      break;
    case 5:
      MyButtonCss = Five;
      break;
    case 6:
      MyButtonCss = Six;
      break;
    case 7:  // bigButton disabled
      MyButtonCss = Seven;
      break;
    case 8:  // smallButton disabled
      MyButtonCss = Eight;
      break;
    default:
      MyButtonCss = Four;
      break;
  }

  return (
    <Wrapper style={props.parentStyle || {}}>
      {
        (
          <MyButtonCss
            style={props.style}
            className={props.className} href={props.href} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              props.onClick(e);
            }}
          >
            {Children.toArray(props.children)}
          </MyButtonCss>)
      }
    </Wrapper>
  );
}

Button.propTypes = {
  handleRoute: PropTypes.func,
  href: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  showtype: PropTypes.number,
  children: PropTypes.any.isRequired,
  parentStyle: PropTypes.object,
};

export default Button;
