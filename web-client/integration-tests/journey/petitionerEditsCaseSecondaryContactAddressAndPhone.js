import { contactSecondaryFromState } from '../helpers';
import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerEditsCaseSecondaryContactAddressAndPhone = test => {
  return it('petitioner updates secondary contact address and phone', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address1',
      value: '101 Main St.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address3',
      value: 'Apt. 101',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '1111111111',
    });

    await test.runSequence('submitEditSecondaryContactSequence');

    const contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.address1).toEqual('101 Main St.');
    expect(contactSecondary.address3).toEqual('Apt. 101');
    expect(contactSecondary.phone).toEqual('1111111111');

    const helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const noticeDocument = helper.formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Address and Telephone Number for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
