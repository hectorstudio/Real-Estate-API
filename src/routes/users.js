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
    .then((data) => {
      const response = data.rows.map(x => userSchema.toJs(x));
      res.status(200).json(response);
    })
    .catch((err) => {
      throw err;
    });
});

// PATCH verify account route
router.patch('/:userId/verify', auth, (req, res) => {
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
router.patch('/:userId', auth, (req, res) => {
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

//

/* GET users listing. */
// router.get('/', (req, res) => {
//   getAllUsers()
//     .then((data) => {
//       const response = data.rows.map(x => userSchema.toJs(x));
//       res.status(200).json(response);
//     })
//     .catch((err) => {
//       throw err;
//     });
// });

/* GET single user by ID */
// router.get('/:userId', (req, res) => {
//   const { userId } = req.params;

//   getUserById(userId)
//     .then((data) => {
//       const response = data.rows.map(x => userSchema.toJs(x));
//       res.status(200).json(response);
//     })
//     .catch((err) => {
//       throw err;
//     });
// });

/* GET single user by firebase ID */
// router.get('/firebase/:firebaseId', (req, res) => {
//   const { firebaseId } = req.params;

//   getUserByFirebaseID(firebaseId)
//     .then((data) => {
//       const response = data.rows.map(x => userSchema.toJs(x));
//       res.status(200).json(response);
//     })
//     .catch((err) => {
//       throw err;
//     });
// });

export default router;
