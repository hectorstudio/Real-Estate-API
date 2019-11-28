import uuidv4 from 'uuid/v4';

import { pool } from '../config/db';
import { updateValues } from '../helpers';

export const getAllUsers = () => pool.query('SELECT * FROM users');

export const getUserById = (userId) => pool.query('SELECT * FROM users WHERE id = $1', [userId]);

export const getUserByFirebaseID = (firebaseId) => pool.query('SELECT * FROM users WHERE firebase_id = $1', [firebaseId])
  .then((data) => {
    if (data.rows.length) {
      return data.rows[0];
    }
    throw new Error('getUserByFirebaseID: user not found');
  });

export const addNewUser = (userData) => {
  const {
    email,
    firstName,
    lastName,
    firebaseId,
  } = userData;

  const joinDate = new Date().getTime() / 1000;
  const userId = uuidv4();

  return pool.query(
    'INSERT INTO users (id, email, first_name, last_name, firebase_id, join_date) values ($1, $2, $3, $4, to_timestamp($5)) RETURNING *',
    [userId, email, firstName, lastName, firebaseId, joinDate],
  );
};

export const verifyAccount = (userId) => pool.query(
  'UPDATE users SET is_verified = true WHERE id = $1 RETURNING *',
  [userId],
);

export const updateAccount = (userId, values) => pool.query(
  `UPDATE users SET ${updateValues(values)} WHERE id = $1 RETURNING *`,
  [userId],
);
