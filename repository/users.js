const User = require('../model/user');

const findById = async id => {
  return await User.findOne({ _id: id });
};

const findByEmail = async email => {
  return await User.findOne({ email });
};

const create = async options => {
  const user = new User(options);
  return await user.save();
};

const getUserByToken = async (token, body) => {
  const result = await User.findOne({ token }, { ...body });
  return result;
};

const updateToken = async (id, token) => {
  return await User.findByIdAndUpdate({ _id: id }, { token });
};

const updateUser = async (id, body) => {
  const result = await User.findByIdAndUpdate(id, { ...body }, { new: true });
  return result;
};

// const getUserByVerifyToken = async token => {
//   return await User.findOne({ verifyToken: token });
// };

const updateVerifyToken = async (id, verify = true, token = null) => {
  return await User.findByIdAndUpdate(id, { verify, verifyToken: token });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  updateUser,
  getUserByToken,
  updateVerifyToken,
};
