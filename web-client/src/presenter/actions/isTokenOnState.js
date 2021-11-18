import { state } from 'cerebral';

/**
 * invokes the path in the sequences depending on if the user is logged in or not
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.get the cerebral get method
 * @returns {object} the list of section work items
 */
export const isTokenOnState = ({ get, path }) => {
  const token = get(state.token);
  if (token) {
    return path.yes();
  } else {
    return path.no();
  }
};
