const { getPetitionerPrimaryContact } = require('./PetitionerPrimaryContact');

describe('Petition', () => {
  describe('for Petitioner Primary contact', () => {
    it('can validate primary contact name', () => {
      const entityConstructor = getPetitionerPrimaryContact({
        countryType: 'domestic',
      });
      const petition = new entityConstructor({
        name: 'Eric',
        address1: '123 Deming Way',
        city: 'Los Angeles',
        state: 'TN',
        zip: '90210',
        phone: '555-555-1212',
        country: 'USA',
        email: 'taxpayer@example.com',
      });
      expect(petition.isValid()).toEqual(true);
    });
  });
});
