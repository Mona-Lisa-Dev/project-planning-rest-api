// const createTask = ({ title, text }) => {
//   return Task.create({ title, text });
// };
const Project = require('../model/project');

const addProject = async body => {
  const result = await Project.create(body);
  return result;
};

module.exports = {
  addProject,
};
