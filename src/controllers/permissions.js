import { pool } from '../config/db';

export const getUserPermissions = (userId, contentType, contentId) => pool.query(
  'SELECT * FROM permissions WHERE user_id = $1 AND content_type = $2 AND content_id = $3',
  [userId, contentType, contentId],
);
