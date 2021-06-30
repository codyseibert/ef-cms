import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateDocketEntryWizardDataAction } from './updateDocketEntryWizardDataAction';

describe('updateDocketEntryWizardDataAction', () => {
  presenter.providers.applicationContext = applicationContext;

  describe('initEventCode', () => {
    it('should not override documentTitle', async () => {
      const mockDocumentTitle = 'Entry of Disappearance';
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'initEventCode',
          value: 'EA',
        },
        state: {
          form: {
            documentTitle: mockDocumentTitle,
          },
        },
      });

      expect(result.state.form.documentTitle).toEqual(mockDocumentTitle);
    });
  });

  describe('certificateOfService', () => {
    it('clear Certificate Of Service date items when certificateOfService is updated', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'certificateOfService',
        },
        state: {
          form: {
            certificateOfServiceDate: '12-12-1212',
            certificateOfServiceDay: 12,
            certificateOfServiceMonth: 12,
            certificateOfServiceYear: 12,
          },
        },
      });

      expect(result.state.form.certificateOfServiceDate).toEqual(undefined);
      expect(result.state.form.certificateOfServiceDay).toEqual(undefined);
      expect(result.state.form.certificateOfServiceMonth).toEqual(undefined);
      expect(result.state.form.certificateOfServiceYear).toEqual(undefined);
    });
  });

  describe('eventCode', () => {
    it('unsets form state values when props.key=eventCode', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'eventCode',
        },
        state: {
          form: {
            documentTitle: 'document title',
            secondaryDocument: {
              freeText: 'Guy Fieri is my spirit animal.',
              ordinalValue: 'asdf',
              previousDocument: {},
              serviceDate: applicationContext
                .getUtilities()
                .createISODateString(),
              trialLocation: 'Flavortown',
            },
          },
        },
      });

      expect(result.state.form).toEqual({});
    });
  });

  describe('secondaryDocument.eventCode', () => {
    it('unsets secondaryDocument form state values', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'secondaryDocument.eventCode',
        },
        state: {
          form: {
            documentTitle: 'document title',
            secondaryDocument: {
              freeText: 'Guy Fieri is my spirit animal.',
              ordinalValue: 'asdf',
              previousDocument: {},
              serviceDate: applicationContext
                .getUtilities()
                .createISODateString(),
              trialLocation: 'Flavortown',
            },
          },
        },
      });

      expect(result.state.form).toEqual({
        documentTitle: 'document title',
      });
    });
  });

  describe('additionalInfo', () => {
    it('unsets additionalInfo if empty', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'additionalInfo',
        },
        state: {
          form: {
            additionalInfo: '',
            documentTitle: 'document title',
          },
        },
      });

      expect(result.state.form.additionalInfo).toEqual(undefined);
    });

    it('does not unset additionalInfo if not empty', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'additionalInfo',
          value: 'abc',
        },
        state: {
          form: {
            additionalInfo: 'abc',
            documentTitle: 'document title',
          },
        },
      });

      expect(result.state.form.additionalInfo).toEqual('abc');
    });
  });

  describe('additionalInfo2', () => {
    it('does not unset additionalInfo2 if not empty', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },

        props: {
          key: 'additionalInfo2',
          value: 'abc',
        },
        state: {
          form: {
            additionalInfo2: 'abc',
            documentTitle: 'document title',
          },
        },
      });

      expect(result.state.form.additionalInfo2).toEqual('abc');
    });

    it('unsets additionalInfo2 if empty', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },

        props: {
          key: 'additionalInfo2',
        },
        state: {
          form: {
            additionalInfo2: '',
            documentTitle: 'document title',
          },
        },
      });

      expect(result.state.form.additionalInfo2).toEqual(undefined);
    });
  });

  describe('hasOtherFilingParty', () => {
    it('should clear otherFilingParty when hasOtherFilingParty is updated', async () => {
      const result = await runAction(updateDocketEntryWizardDataAction, {
        modules: { presenter },
        props: {
          key: 'hasOtherFilingParty',
        },
        state: {
          form: {
            otherFilingParty: 'Not the petitioner',
          },
        },
      });

      expect(result.state.form.otherFilingParty).toEqual(undefined);
    });
  });
});
