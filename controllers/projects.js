const Projects = require('../repository/projects');
const { HttpCode } = require('../helpers/constants');

const getAllProjects = async (req, res, next) => {
  const user = req.user;
  try {
    const projects = await Projects.listProjects(user);
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
    // console.log(project); // toObject
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

const addParticipant = async (req, res, next) => {
  const userId = req.user.id; // TODO  userId  проверить используется ли в итоге
  const projectId = req.params.projectId;
  try {
    if (typeof req.body.email === 'undefined') {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Missing field Email!',
      });
    }
    const project = await Projects.updateParticipants(
      userId,
      projectId,
      req.body,
    );
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

const deleteParticipant = async (req, res, next) => {
  const userId = req.user.id; // TODO  userId  проверить используется ли в итоге
  const projectId = req.params.projectId;
  try {
    const project = await Projects.removeParticipant(
      userId,
      projectId,
      req.body,
    );
    if (project) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Participant deleted',
        data: { project },
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

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  deleteProject,
  updateProjectName,
  addParticipant,
  deleteParticipant,
};
