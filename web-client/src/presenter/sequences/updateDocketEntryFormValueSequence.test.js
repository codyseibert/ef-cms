import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';

let test;
let mockCaseDetail;
let mockFormState;

describe('updateDocketEntryFormValueSequence', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    test = CerebralTest(presenter);

    mockCaseDetail = {
      docketEntries: [
        {
          docketEntryId: '123',
          documentTitle: 'Test Document One',
        },
        {
          docketEntryId: '234',
          documentTitle: 'Test Document Two',
        },
        {
          docketEntryId: '345',
          documentTitle: 'Test Document Three',
        },
      ],
    };

    mockFormState = {
      category: 'beep',
      certificateOfServiceDate: 'some-date',
      certificateOfServiceDay: 'some-day',
      certificateOfServiceMonth: 'some-month',
      certificateOfServiceYear: 'some-year',
      documentTitle: 'Some Random Document Title',
      documentType: 'boop',
      scenario: 'bop',
      secondaryDocument: {
        category: 'beep',
        documentTitle: 'Some Random Document Title',
        documentType: 'boop',
        scenario: 'bop',
      },
    };
  });

  beforeEach(() => {
    test.setState('caseDetail', mockCaseDetail);
    test.setState('form', { ...mockFormState });
  });

  describe('any key', () => {
    it('sets the props.value on state.form', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'someKey',
        value: 'someValue',
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
        someKey: 'someValue',
      });
    });

    it('unsets the state.form property with the name given in props.key if the props.value is an empty string', async () => {
      test.setState('form.someKey', 'someValue');
      expect(test.getState('form')).toEqual({
        ...mockFormState,
        someKey: 'someValue',
      });

      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'someKey',
        value: '',
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
        someKey: undefined,
      });

      expect(test.getState('form.someKey')).toBeUndefined();
    });
  });

  describe('previousDocument', () => {
    it('sets the previousDocument from the case docketEntries on state.form.previousDocument', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'previousDocument',
        value: mockCaseDetail.docketEntries[1].docketEntryId,
      });

      expect(test.getState('form.previousDocument')).toEqual(
        mockCaseDetail.docketEntries[1],
      );
      expect(
        test.getState('form.secondaryDocument.previousDocument'),
      ).toBeUndefined();
    });
  });

  describe('secondaryDocument.previousDocument', () => {
    it('sets the secondaryDocument.previousDocument from the case docketEntries on state.form.secondaryDocument.previousDocument', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'secondaryDocument.previousDocument',
        value: mockCaseDetail.docketEntries[1].docketEntryId,
      });

      expect(test.getState('form.secondaryDocument.previousDocument')).toEqual(
        mockCaseDetail.docketEntries[1],
      );
      expect(test.getState('form.previousDocument')).toBeUndefined();
    });
  });

  describe('initEventCode', () => {
    it('overwrites form values for `category`, `documentType`, and `scenario` with those respective values from the INTERNAL_EVENT_CATEGORY entry with the given eventCode', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'initEventCode',
        value: 'A',
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
        category: 'Answer (filed by respondent only)',
        // documentTitle does not change
        documentType: 'Answer',
        initEventCode: 'A',
        scenario: 'Standard',
      });
    });
  });

  describe('initEventCode', () => {
    it('unsets certificateOfService date part fields when the the props.key is `certificateOfService`', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'certificateOfService',
        value: true,
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
        certificateOfService: true,
        certificateOfServiceDate: undefined,
        certificateOfServiceDay: undefined,
        certificateOfServiceMonth: undefined,
        certificateOfServiceYear: undefined,
      });
    });
  });

  describe('eventCode', () => {
    it('overwrites form values for `category`, `documentTitle`, `documentType`, and `scenario` with those respective values from the INTERNAL_EVENT_CATEGORY entry with the given eventCode', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'eventCode',
        value: 'ACED',
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
        category: 'Decision',
        documentTitle: 'Agreed Computation for Entry of Decision',
        documentType: 'Agreed Computation for Entry of Decision',
        eventCode: 'ACED',
        freeText: undefined,
        objections: undefined,
        ordinalValue: undefined,
        pending: undefined,
        scenario: 'Standard',
        secondaryDocument: undefined,
        serviceDate: undefined,
        serviceDateDay: undefined,
        serviceDateMonth: undefined,
        serviceDateYear: undefined,
        trialLocation: undefined,
      });
    });

    it('unsets form.previousDocument when the props.key is eventCode', async () => {
      test.setState('form.previousDocument', {});

      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'eventCode',
        value: 'ACED',
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
        category: 'Decision',
        documentTitle: 'Agreed Computation for Entry of Decision',
        documentType: 'Agreed Computation for Entry of Decision',
        eventCode: 'ACED',
        freeText: undefined,
        objections: undefined,
        ordinalValue: undefined,
        pending: undefined,
        previousDocument: undefined,
        scenario: 'Standard',
        secondaryDocument: undefined,
        serviceDate: undefined,
        serviceDateDay: undefined,
        serviceDateMonth: undefined,
        serviceDateYear: undefined,
        trialLocation: undefined,
      });
    });
  });

  describe('secondaryDocument.eventCode', () => {
    it('overwrites form values for `category`, `documentTitle`, `documentType`, and `scenario` with those respective values from the INTERNAL_EVENT_CATEGORY entry with the given secondaryDocument.eventCode', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'secondaryDocument.eventCode',
        value: 'ACED',
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
        secondaryDocument: {
          category: 'Decision',
          documentTitle: 'Agreed Computation for Entry of Decision',
          documentType: 'Agreed Computation for Entry of Decision',
          eventCode: 'ACED',
          freeText: undefined,
          ordinalValue: undefined,
          previousDocument: undefined,
          scenario: 'Standard',
          serviceDate: undefined,
          trialLocation: undefined,
        },
      });
    });

    it('unsets form.secondaryDocument if secondaryDocument.eventCode is falsy', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'secondaryDocument.eventCode',
        value: undefined,
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
        secondaryDocument: undefined,
      });
    });
  });

  describe('additionalInfo', () => {
    it('sets form.additionalInfo if the key is additionalInfo and has a value', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'additionalInfo',
        value: 'test value',
      });

      expect(test.getState('form.additionalInfo')).toEqual('test value');
    });

    it('unsets form.additionalInfo if the key is additionalInfo and has no value', async () => {
      test.setState('form.additionalInfo', 'some_value');

      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'additionalInfo',
        value: '',
      });

      expect(test.getState('form.additionalInfo')).toBeUndefined();
    });
  });

  describe('additionalInfo2', () => {
    it('sets form.additionalInfo2 if the key is additionalInfo2 and has a value', async () => {
      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'additionalInfo2',
        value: 'test value',
      });

      expect(test.getState('form.additionalInfo2')).toEqual('test value');
    });

    it('unsets form.additionalInfo2 if the key is additionalInfo2 and has no value', async () => {
      test.setState('form.additionalInfo2', 'some_value');

      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'additionalInfo2',
        value: '',
      });

      expect(test.getState('form.additionalInfo2')).toBeUndefined();
    });
  });

  describe('hasOtherFilingParty', () => {
    it('unsets form.hasOtherFilingParty if the key is hasOtherFilingParty', async () => {
      test.setState('form.hasOtherFilingParty', 'some_value');

      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'hasOtherFilingParty',
        value: '',
      });

      expect(test.getState('form.hasOtherFilingParty')).toBeUndefined();
    });
  });
});
