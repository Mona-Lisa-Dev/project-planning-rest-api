const express = require('express');
const router = express.Router();

// const guard = require('../../helpers/guard');
const {
  validateCreateProject,
  validateObjectId,
  validateNameProject,
} = require('../../validation/projects');

const ctrl = require('../../controllers/projects');

router.get('/', ctrl.getAllProjects);

router.get('/:projectId', validateObjectId, ctrl.getProjectById);

router.post('/', validateCreateProject, ctrl.createProject);

router.delete('/:projectId', validateObjectId, ctrl.deleteProject);

router.patch(
  '/:projectId/name',
  validateNameProject,
  validateObjectId,
  ctrl.updateProjectName,
);

module.exports = router;
