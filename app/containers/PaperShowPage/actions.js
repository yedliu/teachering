/*
 *
 * PaperShowPage actions
 *
 */

import {
  DEFAULT_ACTION,
  CHANGE_INDEX_ACTION,
  INIT_INDEX_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function changeIndexAction(item) {
  return {
    type: CHANGE_INDEX_ACTION,
    item,
  };
}
export function initIndexAction() {
  return {
    type: INIT_INDEX_ACTION,
  };
}
