const express = require('express');
const router = express.Router();

const guard = require('../../helpers/guard');
const {
  createTask,
  updateTask,
  getAllTasks,
  deleteTask,
  getTaskById,
} = require('../../controllers/tasks');

const valid = require('../../validation/tasks');

router.post(
  '/:projectId/:sprintId',
  guard,
  valid.validateObjectIdProjectSprint,
  valid.validateCreateTask,
  createTask,
);

router.patch(
  '/:sprintId/:taskId/day=:day/value=:value',
  guard,
  valid.validateObjectIdSprintTask,
  updateTask,
);

router.get(
  '/:sprintId/:taskId',
  guard,
  valid.validateObjectIdSprintTask,
  getTaskById,
);

router.get('/:sprintId', guard, valid.validateObjectIdSprint, getAllTasks);

router.delete(
  '/:sprintId/:taskId',
  guard,
  valid.validateObjectIdSprintTask,
  deleteTask,
);

module.exports = router;
