import { pool } from '../config/db';
import userSchema from '../schemas/users';
import { updateValues } from '../helpers';

export const getAllUsers = () =>
  pool.query('SELECT * FROM users');

export const getUserById = (userId) =>
  pool.query('SELECT * FROM users WHERE id = $1', [userId]);

export const getUserByFirebaseID = (firebaseId) =>
  pool.query('SELECT * FROM users WHERE firebase_id = $1', [firebaseId]);

export const addNewUser = (userData) => {
  const {
    email,
    password,
    firstName,
    lastName,
    firebaseId,
  } = userData;

  const joinDate = new Date().getTime() / 1000;

  return pool.query(
    'INSERT INTO users (email, password, first_name, last_name, firebase_id, join_date) values ($1, $2, $3, $4, $5, to_timestamp($6)) RETURNING *',
    [email, password, firstName, lastName, firebaseId, joinDate]
  );
}

export const verifyAccount = (userId) =>
  pool.query(
    'UPDATE users SET is_verified = true WHERE id = $1 RETURNING *',
    [userId]
  );

export const updateAccount = (userId, values) =>
  pool.query(
    `UPDATE users SET ${updateValues(values)} WHERE id = $1 RETURNING *`,
    [userId]
  );
