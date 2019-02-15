const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerIntermediaryContact(raw) {
  Object.assign(this, raw);
}

PetitionerIntermediaryContact.errorToMessageMap = {
  name: 'Name is a required field.',
  inCareOf: 'In Care Of has errors.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State is a required field.',
  zip: 'Zip Code is a required field.',
  // country: '',
  // email: '',
  phone: 'Phone is a required field.',
};

joiValidationDecorator(
  PetitionerIntermediaryContact,
  joi.object().keys({
    name: joi.string().required(),
    inCareOf: joi.string().optional(),
    address1: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi.string().required(),
    // country: joi.string().required(),
    // email: joi.string().required(),
    phone: joi.string().required(),
  }),
  undefined,
  PetitionerIntermediaryContact.errorToMessageMap,
);

module.exports = PetitionerIntermediaryContact;
