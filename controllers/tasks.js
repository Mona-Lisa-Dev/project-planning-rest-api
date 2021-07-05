const Tasks = require('../repository/tasks');
const Sprints = require('../repository/sprints');
const { HttpCode } = require('../helpers/constants');

const createTask = async (req, res, next) => {
  const { projectId, sprintId } = req.params;
  const incomingScheduledTime = parseInt(req.body.scheduledTime);
  const findSprint = await Sprints.getById(projectId, sprintId);

  if (!findSprint) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  }

  const currentScheduledTime = findSprint.allScheduledTime;
  const sprint = await Sprints.updateSprint(projectId, sprintId, {
    allScheduledTime: incomingScheduledTime + currentScheduledTime || 0,
  });

  if (!sprint) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  }
  try {
    const task = await Tasks.createTask({
      ...req.body,
      sprint: sprintId,
      project: projectId,
      durationSprint: sprint.duration,
      startDate: sprint.startDate,
    });

    // TODO
    await Sprints.updateSprintDays(projectId, sprintId, task);
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
  const { projectId, sprintId, taskId, day, value } = req.params;

  try {
    const findSprint = await Sprints.getById(projectId, sprintId);

    const updatedSprintDays = findSprint.days
      .map(el =>
        el.date === day
          ? {
              ...el,
              tasks: el.tasks.map(task =>
                task.id === taskId
                  ? { ...task, spenHours: parseInt(value) }
                  : task,
              ),
            }
          : el,
      )
      .map(el => {
        return {
          ...el,
          tasks: el.tasks.map(task =>
            task.id === taskId
              ? { ...task, totalTime: task.totalTime + parseInt(value) }
              : task,
          ),
        };
      });

    if (!updatedSprintDays) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Sprint is not found',
      });
    }

    const sprint = Sprints.updateSprintCurrenDay(
      projectId,
      sprintId,
      updatedSprintDays,
    );

    if (sprint) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { updatedSprintDays },
      });
    }

    // const projectId = findTask.project;
    // const findSprint = await Sprints.getById(projectId, sprintId);

    // const currentTotalDaly = findSprint.totalDaly;

    // const updatedTotalDaly = currentTotalDaly.map(el =>
    //   Object.keys(el)[0] === day
    //     ? { [Object.keys(el)[0]]: Object.values(el)[0] + parseInt(value) }
    //     : el,
    // );

    // Sprints.updateSprint(projectId, sprintId, {
    //   totalDaly: updatedTotalDaly,
    // });

    // const taskByDaysUpd = findTask.taskByDays.map(el =>
    //   Object.keys(el)[0] === day
    //     ? { [Object.keys(el)[0]]: parseInt(value) }
    //     : el,
    // );

    // const totalTime = await findTask.taskByDays.reduce(
    //   (acc, el) =>
    //     Object.keys(el)[0] === day
    //       ? acc + parseInt(value)
    //       : acc + Object.values(el)[0],
    //   0,
    // );

    // const task = await Tasks.updateTask(
    //   sprintId,
    //   taskId,
    //   // taskByDaysUpd,
    //   totalTime,
    // );

    // if (task) {
    //   return res.status(HttpCode.OK).json({
    //     status: 'success',
    //     code: HttpCode.OK,
    //     data: { task },
    //   });
    // }

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

// const deleteTask = async (req, res, next) => {
//   const { sprintId, taskId } = req.params;
//   try {
//     const task = await Tasks.removeTask(sprintId, taskId);
//     if (task) {
//       return res.status(HttpCode.OK).json({
//         status: 'success',
//         code: HttpCode.OK,
//         message: 'Task is deleted',
//       });
//     }
//     return res.status(HttpCode.NOT_FOUND).json({
//       status: 'error',
//       code: HttpCode.NOT_FOUND,
//       message: 'The task is not found',
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// TODO  deleteTaskDays
const deleteTaskDays = async (req, res, next) => {
  const { sprintId, taskId } = req.params;
  try {
    const task = await Tasks.removeTask(sprintId, taskId);

    if (!task) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found task',
      });
    }
    const projectId = task.project;
    await Sprints.deleteTaskSprintDays(projectId, sprintId, taskId);
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
  // deleteTask,
  deleteTaskDays,
};
