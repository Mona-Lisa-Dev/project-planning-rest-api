const Project = require('../model/project');

const addProject = async body => {
  const result = await Project.create(body);
  return result;
};

const listProjects = async userId => {
  const results = await Project.find({ owner: userId }).populate({
    path: 'owner',
    select: 'name email _id',
  });
  return results;
};

const getById = async (userId, projectId) => {
  const result = await Project.findOne({
    _id: projectId,
    owner: userId,
  }).populate({ path: 'owner', select: 'name email _id' }); // .populate({}) позволяет показывать не просто id пользователя, а ту информацию,кот.указываем в select, "-"-убирает ненужные поля
  return result;
};

const removeProject = async (userId, projectId) => {
  const result = await Project.findOneAndRemove({
    _id: projectId,
    owner: userId,
  });
  return result;
};

const updateName = async (userId, projectId, body) => {
  const result = await Project.findOneAndUpdate(
    {
      _id: projectId,
      owner: userId,
    },
    { ...body },
    { new: true },
  ).populate({
    path: 'owner',
    select: 'name email _id',
  });

  return result;
};
// updateParticipants // participants
const updateParticipants = async (userId, projectId, body) => {
  const newParticipant = [body.email];
  console.log(
    '🚀 ~ file: projects.js ~ line 50 ~ updateParticipants ~ newParticipant',
    newParticipant,
  );

  const result = await Project.findOneAndUpdate(
    {
      _id: projectId,
      owner: userId,
    },
    { $push: { participants: newParticipant } },
    { new: true },
  ).populate({
    path: 'owner',
    select: 'name email _id',
  });

  return result;
};

module.exports = {
  addProject,
  listProjects,
  getById,
  removeProject,
  updateName,
  updateParticipants,
};
