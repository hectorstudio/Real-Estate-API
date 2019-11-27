import express from 'express';

import auth from '../middlewares/auth';
import { filesBucket } from '../config/storage';
import { addNewFile } from '../controllers/files';

const router = express.Router();

router.post('/', auth, (req, res) => {
  const { name } = req.body;

  const fileData = {
    name: name,
    path: `$id/${name}`
  };

  addNewFile(fileData, res.uid).then((data) => {
    const file = data.rows[0];
    const fileObj = filesBucket.file(file.path);

    fileObj.createResumableUpload()
      .then((url) => {
        const response = {
          file,
          url: url[0],
        };
        res.status(200).json(response);
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

export default router;
