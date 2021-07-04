const express = require('express');
const router = express.Router();
const guard = require('../../helpers/guard');

const valid = require('../../validation/projects');

const ctrl = require('../../controllers/projects');

router.get('/', guard, ctrl.getAllProjects);

router.get('/:projectId', guard, valid.validateObjectId, ctrl.getProjectById);

router.post('/', guard, valid.validateCreateProject, ctrl.createProject);

router.delete('/:projectId', guard, valid.validateObjectId, ctrl.deleteProject);

router.patch(
  '/:projectId/name',
  guard,
  valid.validateNameProject,
  valid.validateObjectId,
  ctrl.updateProjectName,
);

router.patch(
  '/:projectId/description',
  guard,
  valid.validateDescriptionProject,
  valid.validateObjectId,
  ctrl.updateProjectDescription,
);

router.patch(
  '/:projectId/participant',
  guard,
  valid.validateEmail,
  valid.validateObjectId,
  ctrl.addParticipant,
);

router.post(
  '/:projectId/participant',
  guard,
  valid.validateEmail,
  valid.validateObjectId,
  ctrl.deleteParticipant,
);

router.get(
  '/:projectId/participant',
  guard,
  valid.validateObjectId,
  ctrl.getParticipants,
);

module.exports = router;
