import uuidv4 from 'uuid/v4';

import { FILE_STATUS } from '../constants';
import { pool } from '../config/db';

export const getAllFiles = () => pool.query(
  'SELECT * FROM files WHERE status != $1',
  [FILE_STATUS.DELETED],
);

export const getFileById = (fileId) => pool.query(
  'SELECT * FROM files WHERE id = $1 AND status != $2',
  [fileId, FILE_STATUS.DELETED],
).then((data) => {
  if (data.rows && data.rows.length) {
    return data.rows[0];
  }
  return undefined;
});

export const addNewFile = (fileData, firebaseId) => {
  const {
    name,
    path,
  } = fileData;

  const id = uuidv4();
  const filePath = path.replace('$id', id);
  const addDate = new Date().getTime() / 1000;

  return pool.query(
    `INSERT INTO files (id, name, path, add_date, status, add_user_id) values ($1, $2, $3, to_timestamp($4), $5, (SELECT id from users WHERE firebase_id='${firebaseId}')) RETURNING *`,
    [id, name, filePath, addDate, FILE_STATUS.UPLOADING],
  );
};

// TODO: Handle permissions
export const deleteFile = (fileId) => pool.query(
  'UPDATE files SET status = $1 WHERE id = $2 RETURNING *',
  [FILE_STATUS.DELETED, fileId],
);
