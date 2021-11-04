import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getInternalOpinionSearchEnabledAction } from './getInternalOpinionSearchEnabledAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getInternalOpinionSearchEnabledAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should set state.InternalOpinionSearchEnabled to the value returned from the interactor', async () => {
    applicationContext
      .getUseCases()
      .getInternalOpinionSearchEnabledInteractor.mockResolvedValue(true);

    const result = await runAction(getInternalOpinionSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(result.state.isInternalOpinionSearchEnabled).toEqual(true);
  });

  it('should return path.yes() if the interactor returns true', async () => {
    applicationContext
      .getUseCases()
      .getInternalOpinionSearchEnabledInteractor.mockResolvedValue(true);

    await runAction(getInternalOpinionSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() with alert warning if the interactor returns false', async () => {
    applicationContext
      .getUseCases()
      .getInternalOpinionSearchEnabledInteractor.mockResolvedValue(false);

    await runAction(getInternalOpinionSearchEnabledAction, {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls[0][0].alertWarning).toBeDefined();
  });
});
