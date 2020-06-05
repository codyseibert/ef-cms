import { chooseMessageBoxAction } from '../actions/chooseMessageBoxAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getInboxCaseMessagesForSectionAction } from '../actions/getInboxCaseMessagesForSectionAction';
import { getInboxCaseMessagesForUserAction } from '../actions/getInboxCaseMessagesForUserAction';
import { getOutboxCaseMessagesForSectionAction } from '../actions/getOutboxCaseMessagesForSectionAction';
import { getOutboxCaseMessagesForUserAction } from '../actions/getOutboxCaseMessagesForUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseMessagesAction } from '../actions/setCaseMessagesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const goToCaseMessages = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearErrorAlertsAction,
  chooseMessageBoxAction,
  {
    myinbox: [getInboxCaseMessagesForUserAction],
    myoutbox: [getOutboxCaseMessagesForUserAction],
    sectioninbox: [getInboxCaseMessagesForSectionAction],
    sectionoutbox: [getOutboxCaseMessagesForSectionAction],
  },
  setCaseMessagesAction,
  setCurrentPageAction('CaseMessages'),
];

export const gotoCaseMessagesSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToCaseMessages,
    unauthorized: [redirectToCognitoAction],
  },
];
