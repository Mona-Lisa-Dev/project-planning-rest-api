const mongoose = require('mongoose');
const Joi = require('joi');
const { HttpCode } = require('../helpers/constants');

const schemaCreateTask = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  scheduledHours: Joi.number().min(1).max(40).required(),
  spentHours: Joi.number().min(1).max(8).optional(),
  isDone: Joi.boolean().optional(),
});

const schemaUpdateHours = Joi.object({
  spentHours: Joi.number().required(),
});

const validate = async (schema, body, next) => {
  try {
    if (Object.keys(body).length !== 0) {
      await schema.validateAsync(body);
      next();
    } else {
      next({ status: HttpCode.BAD_REQUEST, message: `Fields are missing` });
    }
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Field ${err.message.replace(/"/g, '')}`,
    });
  }
};

const validateId = async (projectId, sprintId, taskId, next) => {
  projectId &&
    !mongoose.isValidObjectId(projectId) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Project Id is not valid`,
    });

  sprintId &&
    !mongoose.isValidObjectId(sprintId) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Sprint Id is not valid`,
    });

  taskId &&
    !mongoose.isValidObjectId(taskId) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Task Id is not valid`,
    });

  next();
};

module.exports.validateUpdateHours = (req, _res, next) => {
  return validate(schemaUpdateHours, req.body, next);
};

module.exports.validateCreateTask = (req, _res, next) => {
  return validate(schemaCreateTask, req.body, next);
};

module.exports.validateObjectIdProjectSprint = (req, _res, next) => {
  return validateId(req.params.projectId, req.params.sprintId, null, next);
};

module.exports.validateObjectIdSprint = (req, _res, next) => {
  return validateId(null, req.params.sprintId, null, next);
};

module.exports.validateObjectIdSprintTask = (req, _res, next) => {
  return validateId(null, req.params.sprintId, req.params.taskId, next);
};
