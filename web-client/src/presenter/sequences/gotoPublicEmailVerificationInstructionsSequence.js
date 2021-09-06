import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoPublicEmailVerificationInstructionsSequence =
  startWebSocketConnectionSequenceDecorator([
    clearAlertsAction,
    clearScreenMetadataAction,
    setCurrentPageAction('EmailVerificationInstructions'),
  ]);
