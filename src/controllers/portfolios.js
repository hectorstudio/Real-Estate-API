import uuidv4 from 'uuid/v4';

import { pool } from '../config/db';
import { updateValues } from '../helpers';
import { CONTENT_TYPES } from '../constants/permissions';

export const getAllPortfolios = () => pool.query('SELECT * FROM portfolios');

export const getPortfolios = (userId) => pool.query(`
SELECT po.*
FROM Portfolios po
LEFT JOIN permissions pe
ON pe.content_id = text(po.id)
WHERE pe.content_type = $1
AND text(pe.user_id) = $2
`, [CONTENT_TYPES.portfolios, userId]);

export const getPortfolioById = (userId) => pool.query('SELECT * FROM portfolios WHERE id = $1', [userId]);

export const addNewPortfolio = (data) => {
  const {
    name,
  } = data;

  const addDate = new Date().getTime() / 1000;
  const userId = uuidv4();

  return pool.query(
    'INSERT INTO portfolios (id, name, add_date) values ($1, $2, to_timestamp($3)) RETURNING *',
    [userId, name, addDate],
  );
};

export const updatePortfolio = (portfolioId, values) => pool.query(
  `UPDATE portfolios SET ${updateValues(values)} WHERE id = $1 RETURNING *`,
  [portfolioId],
);
