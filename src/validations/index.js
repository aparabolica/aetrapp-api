const errors = require("feathers-errors");
const Joi = require("joi");

const email = Joi.string()
  .trim()
  .email()
  .required();

module.exports = {
  options: {
    abortEarly: false,
    convert: true,
    allowUnknown: false,
    stripUnknown: true
  },
  findByEmail: function(hook) {
    const { query } = hook.params;

    const schema = Joi.object().keys({
      email
    });
    const result = Joi.validate(query, schema);

    if (result.error)
      throw new errors.BadRequest("Empty or invalid e-mail address.", query);
    else return hook;
  }
};
