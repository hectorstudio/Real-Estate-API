import express from 'express';

import buildingSchema from '../schemas/buildings';
import permissionSchema from '../schemas/permissions';
import auth from '../middlewares/auth';
import { addNewBuilding, updateBuilding, getBuildings } from '../controllers/buildings';
import { getUserByFirebaseID, getUserByEmail, getUserById } from '../controllers/users';
import { CONTENT_TYPES } from '../constants/permissions';
import {
  getUserPermissionsByContentIds,
  updateUserPermissions,
  addUserPermissions,
  deleteUserPermissions,
} from '../controllers/permissions';

const router = express.Router();

/* Get all buildings */
router.get('/', auth, (req, res) => {
  getUserByFirebaseID(res.uid).then((user) => {
    getBuildings(user.id).then((data) => {
      const buildingsIds = data.rows.map((row) => row.id);

      getUserPermissionsByContentIds(CONTENT_TYPES.buildings, buildingsIds).then((permissionData) => {
        const buildings = data.rows.map((row) => ({
          ...buildingSchema.toJs(row),
          permissions: permissionData.rows.filter((x) => x.content_id === row.id).map((x) => permissionSchema.toJs(x)),
          role: row.role,
        }));

        res.status(200).json(buildings);
      });
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

// PATCH building permissions route
// TODO: Permissions
router.patch('/:buildingId/permissions', auth, (req, res) => {
  const values = req.body;
  const { buildingId } = req.params;

  const { role, userId } = values;

  updateUserPermissions(userId, CONTENT_TYPES.buildings, buildingId, role)
    .then((data) => {
      const response = buildingSchema.toJs(data.rows[0]);
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
      console.error(err);
    });
});

// TODO: Permissions
router.post('/:buildingId/permissions', auth, (req, res) => {
  const values = req.body;
  const { buildingId } = req.params;

  const { role, email } = values;

  getUserByEmail(email).then((userData) => {
    if (!userData.rows.length) {
      res.status(404).json({});
      return;
    }

    const user = userData.rows[0];
    addUserPermissions(user.id, CONTENT_TYPES.buildings, buildingId, role)
      .then((data) => {
        const response = permissionSchema.toJs(data.rows[0]);
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).json(err);
        console.error(err);
      });
  });
});

// TODO: Permissions
router.delete('/:buildingId/permissions', auth, (req, res) => {
  const values = req.body;
  const { buildingId } = req.params;

  const { userId } = values;

  getUserById(userId).then((userData) => {
    if (!userData.rows.length) {
      res.status(404).json({});
      return;
    }

    const user = userData.rows[0];
    deleteUserPermissions(user.id, CONTENT_TYPES.buildings, buildingId)
      .then(() => {
        res.status(200).json({});
      })
      .catch((err) => {
        res.status(500).json(err);
        console.error(err);
      });
  });
});

export default router;
