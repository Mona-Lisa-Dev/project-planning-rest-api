const Joi = require('joi');

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
      // console.log(body);
      await schema.validateAsync(body);
      next();
    } else {
      next({ status: 400, message: `Fields are missing` });
    }
  } catch (err) {
    next({ status: 400, message: `Field ${err.message.replace(/"/g, '')}` });
  }
};

module.exports.validateUpdateHours = (req, _res, next) => {
  return validate(schemaUpdateHours, req.body, next);
};

module.exports.validateCreateTask = (req, _res, next) => {
  return validate(schemaCreateTask, req.body, next);
};
