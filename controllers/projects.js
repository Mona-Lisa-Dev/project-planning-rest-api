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

const getProjectById = async (req, res, next) => {
  // const userId = req.user.id;
  const projectId = req.params.projectId;
  try {
    // const project = await Projects.getById(userId, projectId);
    const project = await Projects.getById(projectId);
    console.log(project); // toObject
    if (project) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { project } }); // toJSON
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  //   deleteProject,
  //   updateProjectName ,
};
