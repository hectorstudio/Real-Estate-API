import { unauthorized } from '../constants/responses';

export default (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      unauthorized(res);
    }

    const idToken = authorization.replace('Bearer ', '');

    return admin.auth().verifyIdToken(idToken)
      .catch ((error) => {
        unauthorized(res);
      });
  } catch(err) {
    unauthorized(res);
  }
};
