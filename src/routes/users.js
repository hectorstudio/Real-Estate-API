import express from 'express';

import auth from '../middlewares/auth';
import userSchema from '../schemas/users';
import {
  addNewUser,
  getAllUsers,
  getUserByFirebaseID,
  getUserById,
  updateAccount,
  verifyAccount,
} from '../controllers/users';

const router = express.Router();

//
// PUBLIC
//

/* ADD single user */
router.post('/', (req, res) => {
  addNewUser(req.body)
    .then((data) => {
      const response = userSchema.toJs(data.rows[0]);
      res.status(200).json([response]);
    })
    .catch((err) => {
      res.status(500);
      throw err;
    });
});

//
// PRIVATE
//

/* GET current user */
router.get('/currentUser', auth, (req, res) => {
  getUserByFirebaseID(res.uid)
    .then((user) => {
      const response = userSchema.toJs(user);
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(404);
      console.error(err)
    });
});

// PATCH account update route
router.patch('/', auth, (req, res) => {
  const values = req.body;

  getUserByFirebaseID(res.uid)
    .then((user) => {
      updateAccount(user.id, values)
        .then((data) => {
          const response = userSchema.toJs(data.rows[0]);
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(500);
          console.error(err);
        });
    });
});

// PATCH verify account route
router.patch('/verify', auth, (req, res) => {
  getUserByFirebaseID(res.uid)
    .then((user) =>
      verifyAccount(user.id)
        .then((data) => {
          const response = userSchema.toJs(data.rows[0]);
          res.status(200).json([response]);
        })
        .catch((err) => {
          res.status(500);
          console.error(err);
        }));
});

export default router;
