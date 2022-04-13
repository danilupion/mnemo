import { ClientErrorNotFound } from '../../helpers/httpError';

export default (): void => {
  throw new ClientErrorNotFound();
};
