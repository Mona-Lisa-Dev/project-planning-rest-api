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
  valid.validateObjectId,
  valid.validateNameProject,
  ctrl.updateProjectName,
);

router.patch(
  '/:projectId/description',
  guard,
  valid.validateObjectId,
  valid.validateDescriptionProject,
  ctrl.updateProjectDescription,
);

router.patch(
  '/:projectId/participant',
  guard,
  valid.validateObjectId,
  valid.validateEmail,
  ctrl.addParticipant,
);

router.post(
  '/:projectId/participant',
  guard,
  valid.validateObjectId,
  valid.validateEmail,
  ctrl.deleteParticipant,
); // почему post?


// router.get(
//   '/:projectId/participant',
//   guard,
//   validateObjectId,
//   ctrl.getParticipants,
// );


module.exports = router;
