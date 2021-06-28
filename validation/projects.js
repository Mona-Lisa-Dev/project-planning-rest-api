const mongoose = require('mongoose');
const Joi = require('joi');
const { HttpCode } = require('../helpers/constants');

const schemaCreateProject = Joi.object({
  name: Joi.string().min(4).max(30).required(),
  description: Joi.string().min(4).max(30).optional(),
});

const schemaNameProject = Joi.object({
  name: Joi.string().min(4).max(30).required(),
});

const schemaEmail = Joi.object({
  email: Joi.string().required(),
  //   email: Joi.string().email({
  //     minDomainSegments: 4,
  //     tlds: { allow: ['com', 'net', 'ua','ru','co'] },
  //   }).required(),
});

const schemaDescriptionProject = Joi.object({
  description: Joi.string().min(4).max(30).required(),
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

module.exports.validateNameProject = (req, _res, next) => {
  return validate(schemaNameProject, req.body, next);
};

module.exports.validateEmail = (req, _res, next) => {
  return validate(schemaEmail, req.body, next);
};

module.exports.validateDescriptionProject = (req, _res, next) => {
  return validate(schemaDescriptionProject, req.body, next);
};