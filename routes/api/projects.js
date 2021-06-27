const express = require('express');
const router = express.Router();

// const guard = require('../../helpers/guard');
const ctrl = require('../../controllers/projects');

router.get('/', ctrl.getAllProjects);

// router.get('/:projectId', ctrl.getProjectById);

router.post('/', ctrl.createProject);

// router.delete('/:projectId', ctrl.deleteProject);

// router.patch('/:projectId/name', ctrl.updateProjectName);

module.exports = router;
