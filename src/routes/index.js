import buildingsRouter from './buildings';
import errorHandler from './errorHandler';
import filesRouter from './files';
import notFound from './notFound';
import portfoliosRouter from './portfolios';
import usersRouter from './users';

export default (app) => app
  .use('/buildings', buildingsRouter)
  .use('/files', filesRouter)
  .use('/portfolios', portfoliosRouter)
  .use('/users', usersRouter)
  .use(errorHandler)
  .use(notFound);
