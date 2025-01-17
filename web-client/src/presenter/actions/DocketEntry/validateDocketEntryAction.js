import { state } from 'cerebral';

/**
 * validates the docket entry form.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validation use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateDocketEntryAction = ({
  applicationContext,
  get,
  path,
}) => {
  const entryMetadata = get(state.form);

  let errors = applicationContext
    .getUseCases()
    .validateDocketEntryInteractor(applicationContext, {
      entryMetadata,
    });

  if (
    entryMetadata.dateReceivedYear &&
    entryMetadata.dateReceivedYear.toString().length !== 4
  ) {
    if (!errors) {
      errors = {};
    }

    errors.dateReceived = errors.dateReceived || 'Enter a four-digit year';
  }

  if (
    entryMetadata.serviceDateYear &&
    entryMetadata.serviceDateYear.toString().length !== 4
  ) {
    if (!errors) {
      errors = {};
    }

    errors.serviceDate = errors.serviceDate || 'Enter a four-digit year';
  }

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = [
      'documentTitle',
      'primaryDocumentFile',
      'dateReceived',
      'eventCode',
      'freeText',
      'freeText2',
      'previousDocument',
      'serviceDate',
      'trialLocation',
      'ordinalValue',
      'certificateOfServiceDate',
      'objections',
      'filers',
      'partyIrsPractitioner',
      'otherFilingParty',
    ];

    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
