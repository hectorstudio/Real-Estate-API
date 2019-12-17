import uuidv4 from 'uuid/v4';

import { FILE_STATUS, STORAGE_PATHS } from '../constants';
import { pool } from '../config/db';

export const getAllFiles = () => pool.query(
  'SELECT * FROM files WHERE status != $1',
  [FILE_STATUS.DELETED],
);

export const getFilesByBuildingId = (buildingId) => pool.query(
  'SELECT * FROM files WHERE status != $1 AND building_id = $2',
  [FILE_STATUS.DELETED, buildingId],
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

export const addNewFile = (buildingId, fileData, firebaseId) => {
  const {
    name,
    size,
  } = fileData;

  const id = uuidv4();
  const path = STORAGE_PATHS.file(buildingId, id);
  const addDate = new Date().getTime() / 1000;

  return pool.query(
    `INSERT INTO files (id, building_id, name, path, add_date, status, size, add_user_id) values ($1, $2, $3, $4, to_timestamp($5), $6, $7, (SELECT id from users WHERE firebase_id='${firebaseId}')) RETURNING *`,
    [id, buildingId, name, path, addDate, FILE_STATUS.UPLOADING, size],
  );
};

// TODO: Handle permissions
export const deleteFile = (fileId) => pool.query(
  'UPDATE files SET status = $1 WHERE id = $2 RETURNING *',
  [FILE_STATUS.DELETED, fileId],
);

export const deleteFiles = (ids) => pool.query(
  `UPDATE files SET status = $1 WHERE id IN(${ids.map((x) => `'${x}'`).join(',')}) RETURNING *`,
  [FILE_STATUS.DELETED],
);

export const markAsUploadedFile = (id) => pool.query(
  'UPDATE files SET status = $1 WHERE ID = $2 RETURNING *',
  [FILE_STATUS.READY, id],
);
