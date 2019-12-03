import express from 'express';

import fileSchema from '../schemas/files';
import auth from '../middlewares/auth';
import { filesBucket } from '../config/storage';
import {
  addNewFile,
  deleteFile,
  getAllFiles,
  getFileById,
} from '../controllers/files';

const router = express.Router();

/* Get all files */
router.get('/', auth, (req, res) => {
  getAllFiles()
    .then((data) => {
      const files = data.rows.map((x) => fileSchema.toJs(x));
      res.status(200).json(files);
    })
    .catch((err) => {
      res.status(404).json(err);
      console.error(err);
    });
});

/* Get download link */
router.get('/download/:fileId', auth, (req, res) => {
  const { fileId } = req.params;

  getFileById(fileId).then((file) => {
    if (!file) res.status(404).json('File not found');

    const expires = Date.now() + 1000 * 60 * 60; // One hour

    const config = {
      action: 'read',
      expires,
    };

    filesBucket.file(file.path).getSignedUrl(config)
      .then((url) => {
        res.status(200).json(url[0]);
      })
      .catch((err) => {
        res.status(500).json('Could not generate signed download link');
        console.error(err);
      });
  });
});

/* Add a new file */
router.post('/', auth, (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: 'File name not included in request' });
  }

  const fileData = {
    name,
    path: `$id/${name}`,
  };

  addNewFile(fileData, res.uid).then((data) => {
    const file = data.rows[0];
    const fileObj = filesBucket.file(file.path);

    fileObj.createResumableUpload()
      .then((url) => {
        const response = {
          file: fileSchema.toJs(file),
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

/* Delete file */
router.delete('/:fileId', auth, (req, res) => {
  const { fileId } = req.params;

  deleteFile(fileId).then(() => {
    res.status(200).json({});
  })
    .catch((err) => {
      res.status(500).json('Could not delete a file');
      console.error(err);
    });
});

export default router;
