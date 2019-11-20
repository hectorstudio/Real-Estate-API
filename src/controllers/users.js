import { pool } from '../config/db';
import userSchema from '../schemas/users';

export const getAllUsers = () =>
  pool.query('SELECT * FROM users');

export const getUser = (userId) =>
  pool.query(`SELECT * FROM users WHERE id=${userId}`);

export const addNewUser = (userData) => {
  const {
    email,
    password,
    firstName,
    lastName,
    firebaseId,
  } = userData;

  const joinDate = new Date().getTime();

  return pool.query(
    'INSERT INTO users (email, password, first_name, last_name, firebase_id) values ($1, $2, $3, $4, $5)',
    [email, password, firstName, lastName, firebaseId]
      //, joinDate]
  );
}
