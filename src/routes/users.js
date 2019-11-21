import express from 'express';

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

/* GET users listing. */
router.get('/', (req, res) => {
  getAllUsers()
    .then((data) => {
      const response = data.rows.map(x => userSchema.toJs(x));
      res.status(200).json(response);
    })
    .catch((err) => {
      throw err;
    });
});

/* GET single user by ID */
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  getUserById(userId)
    .then((data) => {
      const response = data.rows.map(x => userSchema.toJs(x));
      res.status(200).json(response);
    })
    .catch((err) => {
      throw err;
    });
});

/* GET single user by firebase ID */
router.get('/firebase/:firebaseId', (req, res) => {
  const { firebaseId } = req.params;

  getUserByFirebaseID(firebaseId)
    .then((data) => {
      const response = data.rows.map(x => userSchema.toJs(x));
      res.status(200).json(response);
    })
    .catch((err) => {
      throw err;
    });
});

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

// PATCH verify account route
router.patch('/:userId/verify', (req, res) => {
  const { userId } = req.params;

  verifyAccount(userId)
    .then((data) => {
      const response = userSchema.toJs(data.rows[0]);
      res.status(200).json([response]);
    })
    .catch((err) => {
      res.status(500);
      throw err;
    });
});

// PATCH account update route
router.patch('/:userId', (req, res) => {
  const { userId } = req.params;
  const values = req.body;

  updateAccount(userId, values)
    .then((data) => {
      const response = userSchema.toJs(data.rows[0]);
      res.status(200).json([response]);
    })
    .catch((err) => {
      res.status(500);
      throw err;
    });
});

export default router;
