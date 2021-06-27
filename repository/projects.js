const Project = require('../model/project');

const addProject = async body => {
  const result = await Project.create(body);
  return result;
};

const listProjects = async () => {
  const results = await Project.find({});
  return results;
};

// const getById = async (userId, projectId) => {
const getById = async projectId => {
  const result = await Project.findOne({
    _id: projectId,
    // owner: userId,
  }).populate({ path: 'owner', select: 'name description -_id' }); // .populate({}) позволяет показывать не просто id пользователя, а ту информацию,кот.указываем в select, "-"-убирает ненужные поля
  return result;
};

module.exports = {
  addProject,
  listProjects,
  getById,
};
