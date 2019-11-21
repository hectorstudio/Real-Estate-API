import usersRouter from './users';
import notFound from './notFound';
import errorHandler from './errorHandler';

export default (app) => app
  .use('/users', usersRouter)
  .use(notFound)
  .use(errorHandler);
