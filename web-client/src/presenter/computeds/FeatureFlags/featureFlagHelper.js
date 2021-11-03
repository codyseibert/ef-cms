import { state } from 'cerebral';

export const featureFlagHelper = (get, applicationContext) => {
  const { role } = get(state.user);

  const isUserInternal = applicationContext.getUtilities().isInternalUser(role);
  const isOrderSearchEnabled = get(state.isOrderSearchEnabled);

  let isOrderSearchEnabledForRole = false;
  if (isUserInternal) {
    isOrderSearchEnabledForRole = isOrderSearchEnabled;
  } else {
    isOrderSearchEnabledForRole = get(state.isExternalOrderSearchEnabled);
  }

  const isOpinionSearchEnabled = applicationContext.isFeatureEnabled(
    'advanced_opinion_search',
  );

  return {
    isOpinionSearchEnabled,
    // isExternalOrderSearchEnabled,
    isOrderSearchEnabledForRole,
  };
};
