const express = require('express');
const router = express.Router();

const guard = require('../../helpers/guard');

const {
  validateCreateProject,
  validateObjectId,
  validateNameProject,
} = require('../../validation/projects');

const ctrl = require('../../controllers/projects');

router.get('/', guard, ctrl.getAllProjects);

router.get('/:projectId', guard, validateObjectId, ctrl.getProjectById);

router.post('/', guard, validateCreateProject, ctrl.createProject);

router.delete('/:projectId', guard, validateObjectId, ctrl.deleteProject);

router.patch(
  '/:projectId/name',
  guard,
  validateNameProject,
  validateObjectId,
  ctrl.updateProjectName,
);

module.exports = router;
