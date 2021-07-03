const express = require('express');
const router = express.Router();

const guard = require('../../helpers/guard');

const {
  createSprint,
  getAllSprints,
  updateSprint,
  deleteSprint,
  getSprintById,
} = require('../../controllers/sprints');

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
  createSprint,
);

router.get('/:projectId', guard, validateObjectId, getAllSprints);

router.patch(
  '/:projectId/:sprintId/name',
  validateObjectId,
  validateUpdateSprint,
  guard,
  updateSprint,
);

router.delete('/:projectId/:sprintId', guard, validateObjectId, deleteSprint);

router.get('/:projectId/:sprintId', guard, validateObjectId, getSprintById);

module.exports = router;
