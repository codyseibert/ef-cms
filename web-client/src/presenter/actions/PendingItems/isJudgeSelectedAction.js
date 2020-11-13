import { state } from 'cerebral';

/**
 * takes a path depending on if the judge is selected
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting pendingItems
 * @param {object} providers.props the pendingItems to set
 */
export const isJudgeSelectedAction = ({ get, path }) => {
  const selectedJudge = get(state.pendingReports.selectedJudge);
  return selectedJudge ? path.yes() : path.no();
};