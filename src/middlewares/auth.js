import { unauthorized } from '../constants/responses';
import admin from '../config/firebase';

export default (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      unauthorized(res);
    }

    const idToken = authorization.replace('Bearer ', '');

    return admin.auth().verifyIdToken(idToken)
      .then((token) => {
        res.uid = token.uid;
        next();
      })
      .catch ((error) => {
        unauthorized(res);
      });
  } catch(err) {
    unauthorized(res);
  }
};
