import createError from 'http-errors';

export default (req, res, next) => {
  const error = createError(404);
  // res.status(404).json({
  //   code: 404,
  //   message: 'Not found',
  // });
  res.status(404).json(error);
  next(createError(404));
};
