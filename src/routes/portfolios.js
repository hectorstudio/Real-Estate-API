import express from 'express';

import portfolioSchema from '../schemas/portfolios';
import permissionSchema from '../schemas/permissions';
import auth from '../middlewares/auth';
import { getPortfolios, addNewPortfolio, updatePortfolio } from '../controllers/portfolios';
import { getUserByFirebaseID, getUserByEmail, getUserById } from '../controllers/users';
import { CONTENT_TYPES } from '../constants/permissions';
import {
  getUserPermissionsByContentIds,
  updateUserPermissions,
  addUserPermissions,
  deleteUserPermissions,
} from '../controllers/permissions';

const router = express.Router();

/* Get portfolios for currnete user */
router.get('/', auth, (req, res) => {
  getUserByFirebaseID(res.uid).then((user) => {
    getPortfolios(user.id).then((data) => {
      const portfolioIds = data.rows.map((row) => row.id);

      getUserPermissionsByContentIds(CONTENT_TYPES.portfolios, portfolioIds).then((permissionData) => {
        const portfolios = data.rows.map((row) => ({
          ...portfolioSchema.toJs(row),
          permissions: permissionData.rows.filter((x) => x.content_id === row.id).map((x) => permissionSchema.toJs(x)),
          role: row.role,
        }));

        res.status(200).json(portfolios);
      });
    })
      .catch((err) => {
        res.status(404).json(err);
        console.error(err);
      });
  });
});

/* Add a new portfolio */
router.post('/', (req, res) => {
  addNewPortfolio(req.body)
    .then((data) => {
      const response = portfolioSchema.toJs(data.rows[0]);
      res.status(200).json([response]);
    })
    .catch((err) => {
      res.status(500).json(err);
      throw err;
    });
});

// PATCH portfolio update route
router.patch('/:portfolioId', auth, (req, res) => {
  const values = req.body;
  const { portfolioId } = req.params;

  updatePortfolio(portfolioId, values)
    .then((data) => {
      const response = portfolioSchema.toJs(data.rows[0]);
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
      console.error(err);
    });
});


// PATCH portfolio permissions route
// TODO: Permissions
router.patch('/:portfolioId/permissions', auth, (req, res) => {
  const values = req.body;
  const { portfolioId } = req.params;

  const { role, userId } = values;

  updateUserPermissions(userId, CONTENT_TYPES.portfolios, portfolioId, role)
    .then((data) => {
      const response = portfolioSchema.toJs(data.rows[0]);
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
      console.error(err);
    });
});

// TODO: Permissions
router.post('/:portfolioId/permissions', auth, (req, res) => {
  const values = req.body;
  const { portfolioId } = req.params;

  const { role, email } = values;

  getUserByEmail(email).then((userData) => {
    if (!userData.rows.length) {
      addUserPermissions(email, CONTENT_TYPES.portfolios, portfolioId, role)
        .then((data) => {
          const response = permissionSchema.toJs(data.rows[0]);
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(500).json(err);
          console.error(err);
        });
      return;
    }

    const user = userData.rows[0];
    addUserPermissions(user.id, CONTENT_TYPES.portfolios, portfolioId, role)
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
router.delete('/:portfolioId/permissions', auth, (req, res) => {
  const values = req.body;
  const { portfolioId } = req.params;

  const { userId } = values;

  getUserById(userId).then((userData) => {
    if (!userData.rows.length) {
      res.status(404).json({});
      return;
    }

    const user = userData.rows[0];
    deleteUserPermissions(user.id, CONTENT_TYPES.portfolios, portfolioId)
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
