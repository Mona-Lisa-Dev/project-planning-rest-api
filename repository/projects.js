const Project = require('../model/project');

const addProject = async body => {
  const result = await Project.create(body);
  return result;
};

const listProjects = async userId => {
  // const results = await Project.find({});
  // return results;
  const results = await Project.find({ owner: userId }).populate({
    path: 'owner',
    select: 'name description -_id',
  });
  return results;
};

const getById = async (userId, projectId) => {
  // const getById = async projectId => {
  const result = await Project.findOne({
    _id: projectId,
    owner: userId,
  }).populate({ path: 'owner', select: 'name description -_id' }); // .populate({}) позволяет показывать не просто id пользователя, а ту информацию,кот.указываем в select, "-"-убирает ненужные поля
  return result;
};

const removeProject = async (userId, projectId) => {
  // const removeProject = async projectId => {
  const result = await Project.findOneAndRemove({
    _id: projectId,
    owner: userId,
  });
  return result;
};

const updateName = async (userId, contactId, body) => {
  // const updateName = async (contactId, body) => {
  const result = await Project.findOneAndUpdate(
    {
      _id: contactId,
      owner: userId,
    },
    { ...body },
    { new: true },
  ).populate({
    path: 'owner',
    select: 'name description -_id',
  });

  return result;
};

module.exports = {
  addProject,
  listProjects,
  getById,
  removeProject,
  updateName,
};
