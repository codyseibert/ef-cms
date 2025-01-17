import { isEmpty, isEqual } from 'lodash';
import { state } from 'cerebral';

export const formattedTrialSessionDetails = (get, applicationContext) => {
  const formattedTrialSession = applicationContext
    .getUtilities()
    .formattedTrialSessionDetails({
      applicationContext,
      trialSession: get(state.trialSession),
    });

  if (formattedTrialSession) {
    const { DATE_FORMATS, SESSION_STATUS_GROUPS, TRIAL_SESSION_SCOPE_TYPES } =
      applicationContext.getConstants();

    formattedTrialSession.showOpenCases =
      formattedTrialSession.computedStatus === SESSION_STATUS_GROUPS.open;
    formattedTrialSession.showOnlyClosedCases =
      formattedTrialSession.computedStatus === SESSION_STATUS_GROUPS.closed;

    if (formattedTrialSession.chambersPhoneNumber) {
      formattedTrialSession.chambersPhoneNumber = applicationContext
        .getUtilities()
        .formatPhoneNumber(formattedTrialSession.chambersPhoneNumber);
    }

    if (formattedTrialSession.startDate) {
      const trialDateFormatted = applicationContext
        .getUtilities()
        .formatDateString(formattedTrialSession.startDate);
      const nowDateFormatted = applicationContext
        .getUtilities()
        .formatNow(DATE_FORMATS.YYYYMMDD);
      const trialDateInFuture = trialDateFormatted > nowDateFormatted;
      formattedTrialSession.canDelete =
        trialDateInFuture && !formattedTrialSession.isCalendared;
      formattedTrialSession.canEdit =
        trialDateInFuture &&
        formattedTrialSession.computedStatus !== SESSION_STATUS_GROUPS.closed;

      const allCases = formattedTrialSession.caseOrder || [];
      const inactiveCases = allCases.filter(
        sessionCase => sessionCase.removedFromTrial === true,
      );
      const hasNoActiveCases =
        isEmpty(allCases) || isEqual(allCases, inactiveCases);

      if (
        hasNoActiveCases &&
        !trialDateInFuture &&
        formattedTrialSession.sessionScope ===
          TRIAL_SESSION_SCOPE_TYPES.standaloneRemote &&
        formattedTrialSession.isClosed !== true
      ) {
        formattedTrialSession.canClose = true;
      }
    }
  }

  return formattedTrialSession;
};
