const Project = require('../model/project');

const addProject = async body => {
  const result = await Project.create(body);
  return result;
};

module.exports = {
  addProject,
};
