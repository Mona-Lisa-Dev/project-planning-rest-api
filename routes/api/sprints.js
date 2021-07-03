const express = require('express');
const router = express.Router();

const guard = require('../../helpers/guard');

const ctrl = require('../../controllers/sprints');
const {
  validateCreateSprint,
  validateUpdateSprint,
  validateObjectId,
} = require('../../validation/sprints');

router.post(
  '/:projectId',
  guard,
  validateObjectId,
  validateCreateSprint,
  ctrl.createSprint,
);

router.get('/:projectId', guard, validateObjectId, ctrl.getAllSprints); //

router.patch(
  '/:projectId/:sprintId/name',
  validateObjectId,
  validateUpdateSprint,
  guard,
  ctrl.updateSprint,
);

router.delete(
  '/:projectId/:sprintId',
  guard,
  validateObjectId,
  ctrl.deleteSprint,
);

router.get(
  '/:projectId/:sprintId',
  guard,
  validateObjectId,
  ctrl.getSprintById,
);

module.exports = router;
