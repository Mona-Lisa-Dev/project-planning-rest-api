const express = require('express');
const router = express.Router();

// const guard = require('../../helpers/guard');
const {
  validateCreateProject,
  validateObjectId,
} = require('../../validation/projects');

const ctrl = require('../../controllers/projects');

router.get('/', ctrl.getAllProjects);

router.get('/:projectId', validateObjectId, ctrl.getProjectById);

router.post('/', validateCreateProject, ctrl.createProject);

// router.delete('/:projectId', ctrl.deleteProject);

// router.patch('/:projectId/name', ctrl.updateProjectName);

module.exports = router;
