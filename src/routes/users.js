import express from 'express';

import { getAllUsers, getUser, addNewUser } from '../controllers/users';

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  getAllUsers()
    .then((data) => {
      res.status(200).json(data.rows);
    })
    .catch((err) => {
      throw err;
    });
});

/* GET single user */
router.get('/:userId', function (req, res) {
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
router.post('/', function (req, res) {
  addNewUser(req.body)
    .then((data) => {
      res.status(200).json(data.rows);
    })
    .catch((err) => {
      res.status(500);
      throw err;
    });
});

// TODO: Verify account route

// TODO: Account update route

module.exports = router;
