import express from 'express';

import buildingSchema from '../schemas/buildings';
import auth from '../middlewares/auth';
import { addNewBuilding, updateBuilding, getBuildings } from '../controllers/buildings';
import { getUserByFirebaseID } from '../controllers/users';

const router = express.Router();

/* Get all buildings */
router.get('/', auth, (req, res) => {
  getUserByFirebaseID(res.uid).then((user) => {
    getBuildings(user.id).then((data) => {
      const buildings = data.rows.map((row) => buildingSchema.toJs(row));
      res.status(200).json(buildings);
    })
      .catch((err) => {
        res.status(404).json(err);
        console.error(err);
      });
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

// PATCH building update route
router.patch('/:buildingId', auth, (req, res) => {
  const values = req.body;
  const { buildingId } = req.params;

  updateBuilding(buildingId, values)
    .then((data) => {
      const response = buildingSchema.toJs(data.rows[0]);
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
      console.error(err);
    });
});

export default router;
