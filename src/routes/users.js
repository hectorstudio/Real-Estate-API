import express from 'express';
import fs from 'fs';
import path from 'path';

import auth from '../middlewares/auth';
import userSchema from '../schemas/users';
import {
  addNewUser,
  getAllUsers,
  getUserByFirebaseID,
  updateAccount,
  verifyAccount,
} from '../controllers/users';
import { upload } from '../config/upload';
import { filesBucket } from '../config/storage';
import { STORAGE_PATHS } from '../constants';

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
      res.status(500).json(err);
      throw err;
    });
});

//
// PRIVATE
//

/* GET all users */
router.get('/', auth, (req, res) => {
  getAllUsers()
    .then((data) => {
      const response = data.rows.map((x) => userSchema.toJs(x));
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(404).json(err);
      console.error(err);
    });
});

/* GET current user */
router.get('/currentUser', auth, (req, res) => {
  getUserByFirebaseID(res.uid)
    .then((user) => {
      const response = userSchema.toJs(user);
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(404).json(err);
      console.error(err);
    });
});

// PATCH account update route
router.patch('/', auth, (req, res) => {
  const values = req.body;

  getUserByFirebaseID(res.uid)
    .then((user) => {
      updateAccount(user.id, userSchema.toDb(values))
        .then((data) => {
          console.log(values);
          const response = userSchema.toJs(data.rows[0]);
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(500).json(err);
          console.error(err);
        });
    });
});

// PATCH verify account route
router.patch('/verify', auth, (req, res) => {
  getUserByFirebaseID(res.uid)
    .then((user) => verifyAccount(user.id)
      .then((data) => {
        const response = userSchema.toJs(data.rows[0]);
        res.status(200).json([response]);
      })
      .catch((err) => {
        res.status(500).json(err);
        console.error(err);
      }));
});

// POST user photo image upload
router.post('/photo', upload.single('file'), auth, (req, res) => {
  const { file } = req;

  const extension = file.originalname.split('.').reverse()[0];

  getUserByFirebaseID(res.uid)
    .then((user) => {
      const options = {
        destination: STORAGE_PATHS.user.photo(user.id, `${file.filename}.${extension}`),
        public: true,
      };
      filesBucket.upload(file.path, options)
        .then((fileResponse) => {
          const { mediaLink } = fileResponse[1];
          const values = {
            photoUrl: mediaLink,
          };
          updateAccount(user.id, userSchema.toDb(values))
            .then((data) => {
              const response = userSchema.toJs(data.rows[0]);
              res.status(200).json(response);

              // Remove uploaded file
              const localFilePath = path.join(global.projectPath, file.path);
              fs.unlink(localFilePath, () => { });
            })
            .catch((err) => {
              res.status(500).json(err);
              console.error(err);
            });
        })
        .catch((err) => {
          res.status(500).json(err);
          console.error(err);
        });
    });
});

export default router;
