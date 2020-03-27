import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { shouldShowPreviewAction } from './shouldShowPreviewAction';

const mockFile = {
  name: 'mockfile.pdf',
};

describe('shouldShowPreviewAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeEach(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('returns the yes path if the given documentSelectedForScan is on state.form', async () => {
    runAction(shouldShowPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'primaryDocumentFile',
        },
        form: {
          primaryDocumentFile: mockFile,
        },
      },
    });
    expect(pathYesStub).toHaveBeenCalled();
  });

  it('returns the no path if the given documentSelectedForScan is NOT on state.form', async () => {
    runAction(shouldShowPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'primaryDocumentFile',
        },
        form: {},
      },
    });
    expect(pathNoStub).toHaveBeenCalled();
  });
});
