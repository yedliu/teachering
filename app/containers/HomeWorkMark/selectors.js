import { createSelector } from 'reselect';

/**
 * Direct selector to the HomeWorkMark state domain
 */

const selectHomeWorkMarkDomain = () => (state) => state.get('HomeWorkMark');

const makeSelectHomeWorkMarkData = () => createSelector(
  selectHomeWorkMarkDomain(),
  (substate) => substate.get('homeworkmarkdata')
);

const makeSelectTeaTotalComment = () => createSelector(
  selectHomeWorkMarkDomain(),
  (substate) => substate.get('teaTotalComment')
);

const makeSelectStudentItem = () => createSelector(
  selectHomeWorkMarkDomain(),
  (substate) => substate.get('selectstudent')
);

const makeSelectAlertMsg = () => createSelector(
  selectHomeWorkMarkDomain(),
  (substate) => substate.get('alertmsg')
);

export {
  makeSelectHomeWorkMarkData,
  makeSelectTeaTotalComment,
  makeSelectStudentItem,
  makeSelectAlertMsg,
  };
