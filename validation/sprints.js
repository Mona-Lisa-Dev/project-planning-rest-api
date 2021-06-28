const mongoose = require('mongoose');
const Joi = require('joi');

const { HttpCode } = require('../helpers/constants');

const schemaCreateSprint = Joi.object({
  name: Joi.string().min(4).max(30).required(),
  startDate: Joi.date().required(),
  duration: Joi.number().required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${err.message.replace(/"/g, '')}`,
    });
  }
};

// const validateId = async (id, next) => {
//   if (mongoose.isValidObjectId(id)) {
//     next();
//     return;
//   }
//   next({
//     status: HttpCode.BAD_REQUEST,
//     message: `Id is not valid`,
//   });
// };

const validateId = async (projectId, sprintId, next) => {
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

  next();
};

module.exports.validateCreateSprint = (req, _res, next) => {
  return validate(schemaCreateSprint, req.body, next);
};

module.exports.validateObjectId = (req, _res, next) => {
  return validateId(req.params.projectId, req.params.sprintId, next);
};
