import usersRouter from './users';
import filesRouter from './files';
import buildingsRouter from './buildings';
import notFound from './notFound';
import errorHandler from './errorHandler';

export default (app) => app
  .use('/buildings', buildingsRouter)
  .use('/files', filesRouter)
  .use('/users', usersRouter)
  .use(notFound)
  .use(errorHandler);
