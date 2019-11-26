import usersRouter from './users';
import filesRouter from './files';
import notFound from './notFound';
import errorHandler from './errorHandler';

export default (app) => app
  .use('/users', usersRouter)
  .use('/files', filesRouter)
  .use(notFound)
  .use(errorHandler);
