const Project = require('../model/project');

const addProject = async body => {
  const result = await Project.create(body);
  return result;
};

const listProjects = async () => {
  const results = await Project.find({});
  return results;
};

module.exports = {
  addProject,
  listProjects,
};
