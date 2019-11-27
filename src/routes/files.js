import express from 'express';

import { filesBucket } from '../config/storage';

const router = express.Router();

router.post('/', (req, res) => {
  const file = filesBucket.file(req.body.name);

  file.createResumableUpload()
    .then((uri) => {
      res.status(200).json(uri[0]);
    })
    .catch((err) => {
      res.status(500).json(err);
      console.error(err);
    });
});

export default router;
