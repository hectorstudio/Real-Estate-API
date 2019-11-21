import express from 'express';

import userSchema from '../schemas/users';
import { getAllUsers, getUser, addNewUser, verifyAccount, updateAccount } from '../controllers/users';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  getAllUsers()
    .then((data) => {
      res.status(200).json(data.rows);
    })
    .catch((err) => {
      throw err;
    });
});

/* GET single user */
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  getUser(userId)
    .then((data) => {
      res.status(200).json(data.rows);
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
