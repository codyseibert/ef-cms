const { createISODateString, FORMATS } = require('../utilities/DateHandler');
const { JoiValidationConstants } = require('./JoiValidationConstants');

describe('JoiValidationConstants', () => {
  describe('current year validation', () => {
    it('validates a recent year', () => {
      const { error } = JoiValidationConstants.YEAR_MAX_CURRENT.validate(2018);
      expect(error).toBeFalsy();
    });
    it('rejects an invalid year', () => {
      const { error } = JoiValidationConstants.YEAR_MAX_CURRENT.validate(42);
      expect(error).toBeTruthy();
    });
  });
  describe('postal code validation', () => {
    it('validates 5-digit zipcodes', () => {
      const { error } = JoiValidationConstants.US_POSTAL_CODE.validate('12345');
      expect(error).toBeFalsy();
    });
    it('validates 5+4 zipcodes', () => {
      const { error } =
        JoiValidationConstants.US_POSTAL_CODE.validate('12345-9876');
      expect(error).toBeFalsy();
    });
    it('rejects bad zipcodes', () => {
      const { error } = JoiValidationConstants.US_POSTAL_CODE.validate('1234A');
      expect(error).not.toBeFalsy();
    });
  });

  describe('24-hour time validation', () => {
    it('validates times in 24-hour format', () => {
      let result;
      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('00:23');
      expect(result.error).toBeFalsy();

      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('19:58');
      expect(result.error).toBeFalsy();

      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('23:00');
      expect(result.error).toBeFalsy();
    });
    it('rejects invalid times or formats', () => {
      let result;
      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('0:23');
      expect(result.error).toBeTruthy();

      result = JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('19.58');
      expect(result.error).toBeTruthy();

      result =
        JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.validate('5:00pm');
      expect(result.error).toBeTruthy();
    });
  });

  describe('joi validation of ISO-8601 timestamps', () => {
    const schema = JoiValidationConstants.ISO_DATE;

    it(`validates ISO string generated by DateHandler which uses format ${FORMATS.ISO}`, () => {
      const isoTimestamp = createISODateString(); // matches desired FORMATS.ISO
      const results = schema.validate(isoTimestamp);
      expect(results.error).toBeUndefined();
    });

    describe('identifies as invalid a list of date formats which conform to ISO-8601 but are not valid for our application', () => {
      const iso8601Invalid = [
        // '2020-05-03', // TODO: this will soon become invalid also.
        '2020-05-04T19:40:23+00:00',
        '20200504T194023Z',
        '2020-W19',
        '2020-W19-1',
        '--05-04',
        '2020068',
        '2020-05-04 24:00:00:00.000',
        '20130208T080910.123',
        '2013-02-08 09:30:26.123+07',
      ];
      for (const isoExample of iso8601Invalid) {
        it(`detects ${isoExample} as invalid`, () => {
          const result = schema.validate(isoExample);
          expect(result.error.toString()).toMatch('ValidationError');
        });
      }
    });
  });

  describe('docket record', () => {
    it('validates a valid docket record', () => {
      let result;
      result = JoiValidationConstants.DOCKET_RECORD.validate([
        {
          index: 1,
        },
        {
          index: 2,
        },
      ]);

      expect(result.error).toBeFalsy();
    });

    it('validates a docket record with no indexes', () => {
      let result;
      result = JoiValidationConstants.DOCKET_RECORD.validate([{}, {}]);

      expect(result.error).toBeFalsy();
    });

    it('invalidates a docket record with non-unique', () => {
      let result;
      result = JoiValidationConstants.DOCKET_RECORD.validate([
        {
          index: 1,
        },
        { index: 1 },
      ]);

      expect(result.error).toBeTruthy();
    });
  });
});
