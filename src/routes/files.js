import express from 'express';

import fileSchema from '../schemas/files';
import auth from '../middlewares/auth';
import { filesBucket } from '../config/storage';
import {
  addNewFile,
  deleteFile,
  deleteFiles,
  getAllFiles,
  getFileById,
  getFilesByBuildingId,
  markAsUploadedFile,
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

/* Get all files */
router.get('/:buildingId', auth, (req, res) => {
  const { buildingId } = req.params;

  getFilesByBuildingId(buildingId)
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
router.post('/:buildingId', auth, (req, res) => {
  const { buildingId } = req.params;
  const { name, size } = req.body;

  if (!name) {
    res.status(400).json({ message: 'File name not included in request' });
  }

  const fileData = {
    name,
    size,
  };

  // TODO: Move out of the router
  addNewFile(buildingId, fileData, res.uid).then((data) => {
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

/* Delete files */
router.delete('/', auth, (req, res) => {
  const ids = req.body;

  deleteFiles(ids).then(() => {
    res.status(200).json({});
  })
    .catch((err) => {
      res.status(500).json('Could not delete files');
      console.error(err);
    });
});

// TODO: Need to find better solutions - (Cloud Functions, Storage triggers)
/* Mark file as successfully uploaded */
router.patch('/success/:fileId', auth, (req, res) => {
  const { fileId } = req.params;

  markAsUploadedFile(fileId).then((data) => {
    const file = data.rows[0];
    res.status(200).json(fileSchema.toJs(file));
  })
    .catch((err) => {
      res.status(500).json('Could not update file');
      console.error(err);
    });
});

export default router;
