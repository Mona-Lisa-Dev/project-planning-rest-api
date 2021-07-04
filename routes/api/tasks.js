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

const {
  validateCreateTask,
  validateObjectId,
  validateUpdTask,
} = require('../../validation/tasks');

router.post(
  '/:projectId/:sprintId',
  guard,
  validateObjectId,
  validateCreateTask,
  createTask,
); //

router.patch(
  '/:sprintId/:taskId/day=:day/value=:value',
  guard,
  validateObjectId,
  validateUpdTask,
  updateTask,
); /// +-

router.get('/:sprintId/:taskId', guard, validateObjectId, getTaskById);

router.get('/:sprintId', guard, validateObjectId, getAllTasks); //

router.delete('/:sprintId/:taskId', guard, validateObjectId, deleteTask); //

module.exports = router;
