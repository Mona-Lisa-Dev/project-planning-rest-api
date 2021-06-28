const User = require('../model/user');

const getAll = async query => {
  // const { limit = 10, offset = 0, filter } = query;
  const results = await User.paginate(
    {},
    {
      limit: 10,
      offset: 0,
      select: 'email -_id',
      // filter ? filter.split('|').join(' ') : '',
    },
  );
  const { docs: users, totalDocs: total } = results;
  return { users, total };
};

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

module.exports = {
  getAll,
  findById,
  findByEmail,
  create,
  getUserByToken,
};
