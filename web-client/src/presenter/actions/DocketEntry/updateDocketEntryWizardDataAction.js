import { find, omit, pick } from 'lodash';
import { state } from 'cerebral';

const setDocumentPropsFromFormAndBaseDocument = ({
  applicationContext,
  eventCode,
  formProperties,
  propertyList,
}) => {
  let entry;
  const { INTERNAL_CATEGORY_MAP } = applicationContext.getConstants();

  find(
    INTERNAL_CATEGORY_MAP,
    entries => (entry = find(entries, { eventCode })),
  );

  return {
    ...omit(formProperties, propertyList),
    ...pick(entry || {}, propertyList),
  };
};

/**
 * clears data in the state.form based on which field is being updated
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const updateDocketEntryWizardDataAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  let form;
  switch (props.key) {
    case 'initEventCode':
      form = setDocumentPropsFromFormAndBaseDocument({
        applicationContext,
        eventCode: props.value,
        formProperties: get(state.form),
        propertyList: ['category', 'documentType', 'scenario'],
      });
      store.set(state.form, form);
      break;
    case 'certificateOfService':
      store.unset(state.form.certificateOfServiceDate);
      store.unset(state.form.certificateOfServiceMonth);
      store.unset(state.form.certificateOfServiceDay);
      store.unset(state.form.certificateOfServiceYear);
      break;
    case 'eventCode':
      form = setDocumentPropsFromFormAndBaseDocument({
        applicationContext,
        eventCode: props.value,
        formProperties: get(state.form),
        propertyList: ['category', 'documentType', 'documentTitle', 'scenario'],
      });
      store.set(state.form, form);

      store.unset(state.form.previousDocument);
      store.unset(state.form.serviceDate);
      store.unset(state.form.serviceDateDay);
      store.unset(state.form.serviceDateMonth);
      store.unset(state.form.serviceDateYear);
      store.unset(state.form.trialLocation);
      store.unset(state.form.ordinalValue);
      store.unset(state.form.freeText);
      store.unset(state.form.secondaryDocument);
      store.unset(state.form.objections);
      store.unset(state.form.pending);
      break;
    case 'secondaryDocument.eventCode':
      form = setDocumentPropsFromFormAndBaseDocument({
        applicationContext,
        eventCode: props.value,
        formProperties: get(state.form.secondaryDocument),
        propertyList: ['category', 'documentType', 'documentTitle', 'scenario'],
      });
      store.set(state.form.secondaryDocument, form);
      store.unset(state.form.secondaryDocument.previousDocument);
      store.unset(state.form.secondaryDocument.serviceDate);
      store.unset(state.form.secondaryDocument.trialLocation);
      store.unset(state.form.secondaryDocument.ordinalValue);
      store.unset(state.form.secondaryDocument.freeText);

      if (!props.value) {
        store.unset(state.form.secondaryDocument);
      }
      break;
    case 'additionalInfo':
    case 'additionalInfo2':
      if (!props.value) {
        store.unset(state.form[props.key]);
      }
      break;
    case 'hasOtherFilingParty':
      store.unset(state.form.otherFilingParty);
      break;
  }
};
