const Projects = require('../repository/projects');
const { HttpCode } = require('../helpers/constants');

const getAllProjects = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const projects = await Projects.listProjects(userId);
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { projects } });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const project = await Projects.addProject({ ...req.body, owner: userId });
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { project } });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  try {
    const project = await Projects.getById(userId, projectId);
    // const project = await Projects.getById(projectId);
    // console.log(project); // toObject
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

const deleteProject = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  try {
    const project = await Projects.removeProject(userId, projectId);
    // const project = await Projects.removeProject(projectId);
    if (project) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Project deleted',
      });
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

const updateProjectName = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  try {
    if (typeof req.body.name === 'undefined') {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Missing field Name!',
      });
    }
    const project = await Projects.updateName(userId, projectId, req.body);
    // const project = await Projects.updateName(projectId, req.body);
    if (project) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { project } });
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
  deleteProject,
  updateProjectName,
};
