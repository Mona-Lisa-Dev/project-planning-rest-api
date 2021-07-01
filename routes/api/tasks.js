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
  valid.validateCreateTask,
  createTask,
);

router.patch(
  '/:sprintId/:taskId/day=:day/value=:value/spent=:spent',
  guard,
  valid.validateUpdateHours,
  updateTask,
);
router.get('/:sprintId/:taskId', guard, getTaskById);
router.get('/:sprintId', guard, getAllTasks); // conflicts with router.get('/:projectId/:sprintId', guard, ctrl.getSprintById) - in sprints. Need to change endpoint!
router.delete('/:sprintId/:taskId', guard, deleteTask);

module.exports = router;
