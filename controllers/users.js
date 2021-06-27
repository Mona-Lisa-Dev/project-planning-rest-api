const usersModel = require('../repository/users');
const { HttpCode } = require('../helpers/constants');

const signup = async (req, res, next) => {
  try {
    const user = await usersModel.findByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is in use',
      });
    }
    const newUser = await usersModel.create(req.body);
    console.log(`here shoul be user ${newUser}`);
    const { id, name, email, subscription } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { id, name, email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup };
