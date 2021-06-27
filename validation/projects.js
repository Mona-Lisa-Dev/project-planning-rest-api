const mongoose = require('mongoose');
const Joi = require('joi');

const { HttpCode } = require('../helpers/constants');

const schemaCreateProject = Joi.object({
  name: Joi.string().min(4).max(30).required(),

  description: Joi.string().min(4).max(30).optional(),
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

const validateId = async (id, next) => {
  if (await mongoose.isValidObjectId(id)) {
    next();
    return;
  }
  next({
    status: HttpCode.BAD_REQUEST,
    message: `Id is not valid`,
  });
};

module.exports.validateCreateProject = (req, _res, next) => {
  return validate(schemaCreateProject, req.body, next);
};

module.exports.validateObjectId = (req, _res, next) => {
  return validateId(req.params.projectId, next);
};
