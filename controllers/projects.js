const Projects = require('../repository/projects');
const { HttpCode } = require('../helpers/constants');

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Projects.listProjects();
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { projects } });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  //   const userId = req.user.id;
  try {
    const project = await Projects.addProject({ ...req.body, owner: null }); // owner: userId
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { project } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  //   getProjectById,
  createProject,
  //   deleteProject,
  //   updateProjectName ,
};
