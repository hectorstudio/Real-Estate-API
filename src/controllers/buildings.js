import uuidv4 from 'uuid/v4';

import { pool } from '../config/db';

export const getAllBuildings = () => pool.query('SELECT * FROM buildings');

export const getBuildingById = (userId) => pool.query('SELECT * FROM buildings WHERE id = $1', [userId]);

export const addNewBuilding = (data) => {
  const {
    address,
    city,
    company,
    country,
    name,
  } = data;

  const addDate = new Date().getTime() / 1000;
  const userId = uuidv4();

  return pool.query(
    'INSERT INTO buildings (id, name, address, country, company, city, add_date) values ($1, $2, $3, $4, $5, $6, to_timestamp($7)) RETURNING *',
    [userId, name, address, country, company, city, addDate],
  );
};
