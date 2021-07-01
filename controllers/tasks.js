const Tasks = require('../repository/tasks');
const Sprints = require('../repository/sprints');
const { HttpCode } = require('../helpers/constants');

const createTask = async (req, res, next) => {
  const { projectId, sprintId } = req.params;

  const sprint = await Sprints.getById(projectId, sprintId);

  try {
    const task = await Tasks.createTask({
      ...req.body,
      sprint: sprintId,
      project: projectId,
      durationSprint: sprint.duration,
    });
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { task } });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  const { sprintId, taskId } = req.params;
  try {
    const task = await Tasks.getTaskById(sprintId, taskId);
    if (task) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { task } });
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

const updateTask = async (req, res, next) => {
  const { sprintId, taskId, day, value, spent } = req.params;

  try {
    if (req.body.spentHours === 0) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Please, enter number, that is more than 0',
      });
    } // может и не понадобится

    const findTask = await Tasks.getTaskById(sprintId, taskId);

    const spendHoursArray = findTask.hoursSpent.map((el, i) =>
      i === day - 1 ? value : el,
    );

    const task = await Tasks.updateTask(
      sprintId,
      taskId,
      spent,
      spendHoursArray,
    );

    if (task) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { task } });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Task is not found',
    });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  const sprintId = req.params.sprintId;
  try {
    const tasks = await Tasks.allTasks(sprintId);
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { tasks } });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  const { sprintId, taskId } = req.params;
  // console.log(sprintId);
  try {
    const task = await Tasks.removeTask(sprintId, taskId);
    if (task) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Task is deleted',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'The task is not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTaskById,
  updateTask,
  getAllTasks,
  deleteTask,
};
