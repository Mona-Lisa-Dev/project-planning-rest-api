const express = require('express');
const router = express.Router();

const guard = require('../../helpers/guard');

const {
  validateCreateProject,
  validateObjectId,
  validateNameProject,
  validateEmail,
} = require('../../validation/projects');

const ctrl = require('../../controllers/projects');

router.get('/', guard, ctrl.getAllProjects);
// TODO  закомментить
// router.get('/:projectId', guard, validateObjectId, ctrl.getProjectById);

router.post('/', guard, validateCreateProject, ctrl.createProject);

router.delete('/:projectId', guard, validateObjectId, ctrl.deleteProject);

router.patch(
  '/:projectId/name',
  guard,
  validateNameProject,
  validateObjectId,
  ctrl.updateProjectName,
);

router.patch(
  '/:projectId/participant',
  guard,
  validateEmail,
  validateObjectId,
  ctrl.addParticipant,
);

router.delete(
  '/:projectId/participant',
  guard,
  validateEmail,
  validateObjectId,
  ctrl.deleteParticipant,
);

module.exports = router;
