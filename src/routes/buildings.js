import express from 'express';

import buildingSchema from '../schemas/buildings';
import auth from '../middlewares/auth';
import { getAllBuildings, addNewBuilding } from '../controllers/buildings';

const router = express.Router();

/* Get all buildings */
router.get('/', auth, (req, res) => {
  getAllBuildings()
    .then((data) => {
      const files = data.rows.map((x) => buildingSchema.toJs(x));
      res.status(200).json(files);
    })
    .catch((err) => {
      res.status(404).json(err);
      console.error(err);
    });
});

/* Add a new building */
router.post('/', (req, res) => {
  addNewBuilding(req.body)
    .then((data) => {
      const response = buildingSchema.toJs(data.rows[0]);
      res.status(200).json([response]);
    })
    .catch((err) => {
      res.status(500).json(err);
      throw err;
    });
});

export default router;
