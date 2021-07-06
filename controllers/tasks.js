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
  }); // что то не  так

  try {
    const task = await Tasks.createTask({
      ...req.body,
      sprint: sprintId,
      project: projectId,
      durationSprint: sprint.duration,
      startDate: sprint.startDate,
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
  const { sprintId, taskId, day, value } = req.params;

  try {
    const findTask = await Tasks.getTaskById(sprintId, taskId);

    if (!findTask) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Task is not found',
      });
    }
    // const projectId = findTask.project;
    // const findSprint = await Sprints.getById(projectId, sprintId);

    // const currentTotalDaly = findSprint.totalDaly;

    // console.log(findTask.taskByDays);

    // const updatedTotalDaly = currentTotalDaly.map(el =>
    //   Object.keys(el)[0] === day
    //     ? {
    //         [Object.keys(el)[0]]: parseInt(value),
    //       }
    //     : el,
    // ); // sprint.totalDaly нужно что бы пересчитывало а не просто добавляло

    // Sprints.updateSprint(projectId, sprintId, {
    //   totalDaly: updatedTotalDaly,
    // });

    const taskByDaysUpd = findTask.taskByDays.map(el =>
      Object.keys(el)[0] === day
        ? { [Object.keys(el)[0]]: parseInt(value) }
        : el,
    );

    const totalTime = await findTask.taskByDays.reduce(
      (acc, el) =>
        Object.keys(el)[0] === day
          ? acc + parseInt(value)
          : acc + Object.values(el)[0],
      0,
    );

    const task = await Tasks.updateTask(
      sprintId,
      taskId,
      taskByDaysUpd,
      totalTime,
    );

    // const updatedTask = await Tasks.getTaskById(sprintId, taskId);
    // const taskDays = updatedTask.taskByDays;
    // const previosDayValye = Object.values(
    //   taskDays.find(el => Object.keys(el)[0] === day),
    // )[0];

    // console.log(previosDayValye);

    // const tasks = await Tasks.allTasks(sprintId);
    // тут проверка на не найдено

    // const arraysOfDays = tasks.reduce(
    //   (acc, task) => [...acc, ...task.taskByDays],
    //   [],
    // );

    // const days = arraysOfDays.reduce((acc, day) => {
    //   if (acc.filter(el => Object.keys(el)[0] === Object.keys(day)[0])) {
    //     return { ...acc };
    //   }

    //   return;
    // }, []);

    // console.log(days);

    // console.log(arraysOfDays.reduce((acc, el) => [...acc, ...el], []));

    if (task) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { task },
      });
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
  try {
    const foundTask = await Tasks.getTaskById(sprintId, taskId);
    const projectId = foundTask.project;
    const foundSprint = await Sprints.getById(projectId, sprintId);

    console.log(foundSprint.allScheduledTime);

    Sprints.updateSprint(projectId, sprintId, {
      allScheduledTime: foundSprint.allScheduledTime - foundTask.scheduledTime,
    });

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
}; // при удалении  не обновляется allScheduledTime в спринте

const getTaskByDay = async (req, res, next) => {
  const { sprintId, day } = req.params;

  try {
    const tasks = await Tasks.allTasks(sprintId);

    if (tasks.length === 0) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Tasks is not found',
      });
    }

    const tasksByDay = tasks.map(task => {
      return {
        name: task.name,
        totalTime: task.totalTime,
        scheduledTime: task.scheduledTime,
        sprint: task.sprint,
        project: task.project,
        id: task.id,
        byDay: task.taskByDays.find(days => Object.keys(days)[0] === day),
      };
    });

    if (tasks) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { tasksByDay } });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Tasks is found',
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
  getTaskByDay,
};
