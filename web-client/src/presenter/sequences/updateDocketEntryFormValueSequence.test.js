import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
// import { updateDocketEntryFormValueSequence } from './updateDocketEntryFormValueSequence';

let test;
let mockCaseDetail;
let mockFormState;

describe('updateDocketEntryFormValueSequence', () => {
  beforeAll(() => {
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

    it('unsets form.previousDocument when the props.key is eventCode and state.screenMetadata.supporting is falsy', async () => {
      test.setState('form.previousDocument', {});
      test.setState('screenMetadata.supporting', undefined);

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

    it('sets form.previousDocument and merges screenMetadata.primary when the props.key is eventCode and there is one docketEntryId in screenMetadata.filedDocketEntryIds matching an entry in the currentCaseDetail.docketEntries', async () => {
      test.setState('form.previousDocument', {});
      test.setState('screenMetadata.supporting', true);
      test.setState('screenMetadata.filedDocketEntryIds', ['234']);
      test.setState('screenMetadata.primary', { foo: 'bar' });

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
        foo: 'bar', // from screenMetadata.primary
        freeText: undefined,
        objections: undefined,
        ordinalValue: undefined,
        pending: undefined,
        previousDocument: mockCaseDetail.docketEntries[1],
        scenario: 'Standard',
        secondaryDocument: undefined,
        serviceDate: undefined,
        serviceDateDay: undefined,
        serviceDateMonth: undefined,
        serviceDateYear: undefined,
        trialLocation: undefined,
      });
    });

    it('does not set form.previousDocument or merge screenMetadata.primary when the props.key is eventCode and there is more than one docketEntryId in screenMetadata.filedDocketEntryIds', async () => {
      test.setState('form.previousDocument', {});
      test.setState('screenMetadata.supporting', true);
      test.setState('screenMetadata.filedDocketEntryIds', ['123', '234']);
      test.setState('screenMetadata.primary', { foo: 'bar' });

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
        previousDocument: {},
        scenario: 'Standard',
        secondaryDocument: undefined,
        serviceDate: undefined,
        serviceDateDay: undefined,
        serviceDateMonth: undefined,
        serviceDateYear: undefined,
        trialLocation: undefined,
      });
    });

    it('does not set form.previousDocument or merge screenMetadata.primary when the props.key is eventCode and there is one docketEntryId in screenMetadata.filedDocketEntryIds that does not match an entry in the currentCaseDetail.docketEntries', async () => {
      test.setState('form.previousDocument', {});
      test.setState('screenMetadata.supporting', true);
      test.setState('screenMetadata.filedDocketEntryIds', ['nope']);
      test.setState('screenMetadata.primary', { foo: 'bar' });

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
        previousDocument: {},
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

  describe('previousDocument', () => {
    it('makes no states changes when props.key is previousDocument and state.screenMetadata.supporting is falsy', async () => {
      test.setState('screenMetadata.supporting', undefined);

      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'previousDocument',
        value: 'some_value',
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
      });
    });

    it('unsets attachments and certificate of service date fields when props.key is previousDocument and state.screenMetadata.supporting is truthy', async () => {
      // HERE HERE!
      test.setState('screenMetadata.supporting', true);

      await test.runSequence('updateDocketEntryFormValueSequence', {
        key: 'previousDocument',
        value: 'some_value',
      });

      expect(test.getState('form')).toEqual({
        ...mockFormState,
        attachments: undefined,
        certificateOfService: undefined,
        certificateOfServiceDate: undefined,
        certificateOfServiceDay: undefined,
        certificateOfServiceMonth: undefined,
        certificateOfServiceYear: undefined,
      });
    });
  });
});
