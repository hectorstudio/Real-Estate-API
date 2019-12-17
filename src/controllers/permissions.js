import uuidv4 from 'uuid/v4';
import { pool } from '../config/db';

export const getUserPermissions = (userId, contentType, contentId) => pool.query(
  'SELECT * FROM permissions WHERE user_id = $1 AND content_type = $2 AND content_id = $3',
  [userId, contentType, contentId],
);

export const getUserPermissionsByContentIds = (contentType, contentIds) => pool.query(
  `SELECT * FROM permissions WHERE content_type = $1 AND content_id IN (${contentIds.map((x) => `'${x}'`).join(', ')})`,
  [contentType],
);

export const updateUserPermissions = (userId, contentType, contentId, role) => pool.query(
  'UPDATE permissions SET role = $1 WHERE user_id = $2 AND content_type = $3 AND content_id = $4 RETURNING *',
  [role, userId, contentType, contentId],
);

export const addUserPermissions = (userId, contentType, contentId, role) => {
  const id = uuidv4();

  return pool.query(
    'INSERT INTO permissions (id, user_id, content_type, content_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, userId, contentType, contentId, role],
  );
};

export const addUserPermissionsWithEmail = (email, contentType, contentId, role) => {
  const id = uuidv4();

  return pool.query(
    'INSERT INTO permissions (id, email, content_type, content_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, email, contentType, contentId, role],
  );
};

export const deleteUserPermissions = (userId, contentType, contentId) => pool.query(
  'DELETE FROM permissions WHERE user_id = $1 AND content_type = $2 AND content_id = $3 RETURNING *',
  [userId, contentType, contentId],
);
