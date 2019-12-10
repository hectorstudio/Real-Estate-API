import { unauthorized } from '../constants/responses';
import admin from '../config/firebase';

export default (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      unauthorized(res);
    }

    const idToken = authorization.replace('Bearer ', '');

    // TODO: Save both firebase id and user id
    admin.auth().verifyIdToken(idToken)
      .then((token) => {
        res.uid = token.uid;
        next();
      })
      .catch(() => {
        unauthorized(res);
      });
  } catch (err) {
    unauthorized(res);
  }
};
