import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';

export const validateCaseDetailSequence = [
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  { success: [], error: [] }, // TODO: is there a way we don't need to put this here?
];
