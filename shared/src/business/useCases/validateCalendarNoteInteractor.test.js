const {
  validateCalendarNoteInteractor,
} = require('./validateCalendarNoteInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { getTextByCount } = require('../utilities/getTextByCount');

describe('validateCalendarNoteInteractor', () => {
  it('returns the expected errors object on a note that is over the valid length', () => {
    const errors = validateCalendarNoteInteractor(applicationContext, {
      note: getTextByCount(1001),
    });

    expect(Object.keys(errors)).toEqual(['note']);
  });

  it('returns null on no errors', () => {
    const errors = validateCalendarNoteInteractor(applicationContext, {
      note: 'hello world',
    });

    expect(errors).toBeNull();
  });
});
